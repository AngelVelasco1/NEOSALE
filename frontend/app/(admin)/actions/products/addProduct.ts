"use server";

import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { auth } from "@/app/(auth)/auth";
import { uploadImageToCloudinary } from "@/lib/cloudinary";
import { productFormSchema } from "@/app/(admin)/dashboard/products/_components/form/schema";
import { formatValidationErrors } from "@/app/(admin)/helpers/formatValidationErrors";
import { ProductServerActionResponse } from "@/app/(admin)/types/server-action";

export async function addProduct(
  formData: FormData
): Promise<ProductServerActionResponse> {
  // Verificar autenticación
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized. Please log in." };
  }

  const userId = parseInt(session.user.id);

  // Verificar que el usuario existe y tiene permisos de admin
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, role: true, active: true },
  });

  if (!user || !user.active) {
    return { success: false, error: "User not found or inactive." };
  }

  if (user.role !== "admin") {
    return { success: false, error: "Unauthorized. Admin access required." };
  }

  const formDataObject = {
    name: formData.get("name"),
    description: formData.get("description"),
    image: formData.get("image"),
    sku: formData.get("sku"),
    category: formData.get("category"),
    subcategory: formData.get("subcategory"),
    brand: formData.get("brand"),
    price: formData.get("price"),
    stock: formData.get("stock"),
    weight_grams: formData.get("weight_grams"),
    sizes: formData.get("sizes"),
    color: formData.get("color"),
    color_code: formData.get("color_code"),
  };

  console.log("[SERVER] Received formData:", formDataObject);

  const parsedData = productFormSchema.safeParse(formDataObject);

  if (!parsedData.success) {
    console.log("[SERVER] Validation failed:", parsedData.error.flatten().fieldErrors);
    return {
      validationErrors: formatValidationErrors(
        parsedData.error.flatten().fieldErrors
      ),
    };
  }

  console.log("[SERVER] Validation passed!");

  const { image, ...productData } = parsedData.data;

  try {
    // Parsear colores
    const colorsData = formData.get("colors");
    let colors: Array<{ name: string; code: string }> = [];
    
    try {
      if (colorsData) {
        colors = JSON.parse(colorsData as string);
        console.log("[SERVER] Parsed colors:", colors);
      }
    } catch (error) {
      console.error("[SERVER] Error parsing colors:", error);
    }

    if (colors.length === 0) {
      console.log("[SERVER] No colors provided");
      return {
        validationErrors: {
          color: "Debes agregar al menos un color",
        },
      };
    }

    const sizesArray = productData.sizes.split(",").map(s => s.trim()).filter(Boolean);
    console.log("[SERVER] Parsed sizes:", sizesArray);

    // Parsear variantStock
    const variantStockData = formData.get("variantStock");
    let variantStock: Record<string, number> = {};
    
    try {
      if (variantStockData) {
        variantStock = JSON.parse(variantStockData as string);
        console.log("[SERVER] Parsed variantStock:", variantStock);
        console.log("[SERVER] Stock keys available:", Object.keys(variantStock));
      }
    } catch (error) {
      console.error("[SERVER] Error parsing variantStock:", error);
    }

    // Recopilar todas las imágenes por color
    const allColorImages: { file: File; colorCode: string; isPrimary: boolean }[] = [];
    const colorImagesInfo = formData.get("colorImages");
    let colorImagesData: Record<string, Array<{ isPrimary: boolean }>> = {};
    
    try {
      if (colorImagesInfo) {
        colorImagesData = JSON.parse(colorImagesInfo as string);
      }
    } catch (error) {
      console.error("Error parsing colorImages:", error);
    }
    
    // Buscar todas las imágenes en el FormData
    formData.forEach((value, key) => {
      if (key.startsWith('colorImage_') && value instanceof File) {
        const parts = key.split('_');
        const colorCode = parts[1];
        const index = parseInt(parts[2] || '0');
        const isPrimary = colorImagesData[colorCode]?.[index]?.isPrimary || false;
        
        allColorImages.push({
          file: value,
          colorCode: colorCode,
          isPrimary: isPrimary
        });
      }
    });

    console.log("[SERVER] Collected", allColorImages.length, "images");

    // Validar que al menos haya una imagen
    if (allColorImages.length === 0) {
      console.log("[SERVER] No images found");
      return {
        validationErrors: {
          image: "Debes subir al menos una imagen",
        },
      };
    }

    // Subir todas las imágenes a Cloudinary ANTES de la transacción
    console.log("[SERVER] Uploading", allColorImages.length, "images to Cloudinary...");
    const uploadedImages: { url: string; colorCode: string; colorName: string; isPrimary: boolean }[] = [];
    
    for (const img of allColorImages) {
      try {
        const imageUrl = await uploadImageToCloudinary(img.file, "neosale/products");
        const colorInfo = colors.find(c => c.code === img.colorCode);
        uploadedImages.push({
          url: imageUrl,
          colorCode: img.colorCode,
          colorName: colorInfo?.name || "Unknown",
          isPrimary: img.isPrimary
        });
        console.log(`[SERVER] ✓ Uploaded image for ${colorInfo?.name}: ${imageUrl}`);
      } catch (error) {
        console.error(`[SERVER] ✗ Failed to upload image for color ${img.colorCode}:`, error);
      }
    }

    // Si no se subió ninguna imagen, retornar error
    if (uploadedImages.length === 0) {
      console.log("[SERVER] All image uploads failed");
      return {
        success: false,
        error: "Error al subir las imágenes a Cloudinary",
      };
    }

    console.log("[SERVER] Successfully uploaded", uploadedImages.length, "of", allColorImages.length, "images");

    // Asegurar que cada color tenga al menos una imagen primaria
    colors.forEach(color => {
      const colorImages = uploadedImages.filter(img => img.colorCode === color.code);
      const hasPrimary = colorImages.some(img => img.isPrimary);
      if (!hasPrimary && colorImages.length > 0) {
        colorImages[0].isPrimary = true;
      }
    });

    console.log("[SERVER] Images uploaded successfully, starting database transaction...");

    // Crear el producto con sus variantes e imágenes en una transacción
    const newProduct = await prisma.$transaction(async (tx) => {
      console.log("[SERVER] Creating base product...");
      
      // Crear el producto base
      const product = await tx.products.create({
        data: {
          name: productData.name,
          description: productData.description,
          price: productData.price,
          stock: 0, // Se calculará después
          weight_grams: productData.weight_grams,
          sizes: productData.sizes,
          base_discount: 0,
          category_id: parseInt(productData.category),
          brand_id: parseInt(productData.brand),
          created_by: userId,
          updated_by: userId,
          active: true,
          in_offer: false,
        },
      });

      console.log("[SERVER] Base product created with ID:", product.id);

      // Crear variantes para cada combinación de color + tamaño
      let totalStock = 0;
      let variantCount = 0;
      
      // Almacenar IDs de variantes por color para asociar imágenes después
      const variantsByColor: Record<string, number[]> = {};
      
      for (const color of colors) {
        variantsByColor[color.code] = [];
        
        for (const size of sizesArray) {
          const variantKey = `${size}-${color.code}`;
          const stock = variantStock[variantKey] || 0;
          totalStock += stock;

          console.log(`[SERVER] Creating variant ${variantCount + 1}: ${color.name} - ${size} (stock: ${stock})`);

          const variant = await tx.product_variants.create({
            data: {
              product_id: product.id,
              color_code: color.code,
              color: color.name,
              size: size,
              stock: stock,
              sku: `${productData.sku}-${color.name.substring(0, 3).toUpperCase()}-${size}`,
              price: productData.price,
              weight_grams: productData.weight_grams,
              active: true,
            },
          });

          variantsByColor[color.code].push(variant.id);
          variantCount++;
        }
      }

      // Crear imágenes una sola vez por color (no por cada talla)
      for (const color of colors) {
        const colorImages = uploadedImages.filter(img => img.colorCode === color.code);
        
        for (const img of colorImages) {
          // Asociar imagen al producto y al primer variant de este color
          const firstVariantId = variantsByColor[color.code][0];
          
          await tx.images.create({
            data: {
              image_url: img.url,
              color_code: color.code,
              color: color.name,
              is_primary: img.isPrimary,
              product_id: product.id,
              variant_id: firstVariantId, 
            },
          });
        }
      }

      console.log(`[SERVER] Created ${variantCount} variants with total stock: ${totalStock}`);

      // Actualizar el stock total del producto
      await tx.products.update({
        where: { id: product.id },
        data: { stock: totalStock },
      });

      console.log("[SERVER] Transaction completed successfully!");

      // Retornar el producto con sus relaciones
      return await tx.products.findUnique({
        where: { id: product.id },
        include: {
          images: true,
          product_variants: {
            where: { active: true },
            include: {
              images: true,
            },
          },
          categories: true,
          brands: true,
        },
      });
    });

    revalidatePath("/dashboard/products");

    return {
      success: true,
      product: {
        id: newProduct!.id.toString(),
        name: newProduct!.name,
        price: newProduct!.price,
        stock: newProduct!.stock,
        color: colors[0]?.name || "",
        color_code: colors[0]?.code || "#000000",
        image_url: newProduct!.images[0]?.image_url,
      },
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
              category:
                "Invalid category selected. Please choose a valid category.",
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
    return { success: false, error: "Something went wrong. Please try again later." };
  }
}