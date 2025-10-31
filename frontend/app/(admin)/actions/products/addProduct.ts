"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { auth } from "@/app/(auth)/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { productFormSchema } from "@/app/(dashboard)/products/_components/form/schema";
import { formatValidationErrors } from "@/helpers/formatValidationErrors";
import { ProductServerActionResponse } from "@/types/server-action";

export async function addProduct(
  formData: FormData
): Promise<ProductServerActionResponse> {
  // Verificar autenticación
  const session = await auth();
  if (!session?.user?.id) {
    return { dbError: "Unauthorized. Please log in." };
  }

  const userId = parseInt(session.user.id);

  // Verificar que el usuario existe y tiene permisos de admin
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, active: true },
  });

  if (!user || !user.active) {
    return { dbError: "User not found or inactive." };
  }

  if (user.role !== "admin") {
    return { dbError: "Unauthorized. Admin access required." };
  }

  const parsedData = productFormSchema.safeParse({
    name: formData.get("name"),
    description: formData.get("description"),
    image: formData.get("image"),
    sku: formData.get("sku"),
    category: formData.get("category"),
    brand: formData.get("brand"),
    costPrice: formData.get("costPrice"),
    salesPrice: formData.get("salesPrice"),
    stock: formData.get("stock"),
    weightGrams: formData.get("weightGrams"),
    sizes: formData.get("sizes"),
    color: formData.get("color"),
    colorCode: formData.get("colorCode"),
  });

  if (!parsedData.success) {
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  const { image, ...productData } = parsedData.data;

  // Subir imagen a Cloudinary
  let imageUrl: string | undefined;
  
  if (typeof image === "string") {
    // Si ya es una URL, la usamos directamente
    imageUrl = image;
  } else if (image instanceof File && image.size > 0) {
    try {
      // Subir el archivo a Cloudinary
      imageUrl = await uploadImageToCloudinary(image, "neosale/products");
    } catch (error) {
      console.error("Image upload failed:", error);
      return { 
        validationErrors: { 
          image: "Failed to upload image. Please try again." 
        } 
      };
    }
  }

  try {
    // Crear el producto con su imagen y variante en una transacción
    const newProduct = await prisma.$transaction(async (tx) => {
      // Crear el producto base
      const product = await tx.products.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.salesPrice,
          stock: productData.stock,
          weight_grams: productData.weightGrams,
          sizes: productData.sizes,
          category_id: parseInt(productData.category),
          brand_id: parseInt(productData.brand),
          created_by: userId,
          updated_by: userId,
          active: true,
        },
      });

      // Crear la imagen asociada al producto
      if (imageUrl) {
        await tx.images.create({
          data: {
            image_url: imageUrl,
            color_code: productData.colorCode,
            color: productData.color,
            is_primary: true,
            product_id: product.id,
          },
        });
      }

      // Crear la variante del producto
      await tx.product_variants.create({
        data: {
          product_id: product.id,
          color_code: productData.colorCode,
          color: productData.color,
          size: productData.sizes.split(",")[0].trim(), // Usar la primera talla disponible
          stock: productData.stock,
          sku: productData.sku,
          price: productData.salesPrice,
          weight_grams: productData.weightGrams,
          active: true,
        },
      });

      // Retornar el producto con sus relaciones
      return await tx.products.findUnique({
        where: { id: product.id },
        include: {
          images: true,
          product_variants: true,
          categories: true,
          brands: true,
        },
      });
    });

    revalidatePath("/products");

    return { 
      success: true, 
      product: {
        id: newProduct!.id.toString(),
        name: newProduct!.name,
        price: newProduct!.price,
        stock: newProduct!.stock,
        color: newProduct!.product_variants[0]?.color || productData.color,
        color_code: newProduct!.product_variants[0]?.color_code || productData.colorCode,
        image_url: newProduct!.images[0]?.image_url,
      }
    };
  } catch (error) {
    // Manejar errores de Prisma
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      // Error de constraint único (P2002)
      if (error.code === "P2002") {
        const target = error.meta?.target as string[] | undefined;
        
        if (target?.includes("sku")) {
          return {
            validationErrors: {
              sku: "This product SKU is already assigned to an existing item. Please enter a different SKU.",
            },
          };
        }
      }
      
      // Error de foreign key (P2003)
      if (error.code === "P2003") {
        const field = error.meta?.field_name as string | undefined;
        
        if (field?.includes("category")) {
          return {
            validationErrors: {
              category: "Invalid category selected. Please choose a valid category.",
            },
          };
        }
        
        if (field?.includes("brand")) {
          return {
            validationErrors: {
              brand: "Invalid brand selected. Please choose a valid brand.",
            },
          };
        }
      }
    }

    console.error("Database insert failed:", error);
    return { dbError: "Something went wrong. Please try again later." };
  }
}
