import { notFound } from "next/navigation";



import { prisma } from "@/lib/prisma";
import { EditableProductPage } from "./_components/EditableProductPage";

type PageParams = {
  params: Promise<{
    id: string;
  }>;
};

export default async function ProductDetails({ params }: PageParams) {
  try {
    const { id } = await params;
    const productId = parseInt(id);

    if (isNaN(productId)) {
      return notFound();
    }

    const product = await prisma.products.findUnique({
      where: { id: productId },
      include: {
        categories: {
          select: {
            name: true,
          },
        },
        brands: {
          select: {
            name: true,
          },
        },
        images: {
          select: {
            image_url: true,
            is_primary: true,
            color: true,
          },
          orderBy: [
            { is_primary: 'desc' },
            { id: 'asc' }
          ],
        },
        product_variants: {
          select: {
            id: true,
            color: true,
            color_code: true,
            size: true,
            stock: true,
            price: true,
          },
          where: { active: true },
        },
      },
    });

    if (!product) {
      return notFound();
    }

    // Convertir Decimal a number y Date a string para evitar errores en Client Components
    const serializedProduct = {
      ...product,
      price: Number(product.price),
      base_discount: Number(product.base_discount),
      offer_discount: product.offer_discount ? Number(product.offer_discount) : null,
      created_at: product.created_at.toISOString(),
      updated_at: product.updated_at?.toISOString() ?? null,
      deleted_at: product.deleted_at?.toISOString() ?? null,
      offer_start_date: product.offer_start_date?.toISOString() ?? null,
      offer_end_date: product.offer_end_date?.toISOString() ?? null,
      product_variants: product.product_variants.map(variant => ({
        ...variant,
        price: variant.price ? Number(variant.price) : null,
      })),
    };

    const primaryImage = serializedProduct.images?.[0]?.image_url || "/placeholder.svg";
    const allImages = serializedProduct.images || [];
    const variants = serializedProduct.product_variants || [];

    // Calcular estadísticas - El stock total es SOLO la suma de variantes
    const totalVariants = variants.length;
    const totalStock = variants.reduce((sum, v) => sum + v.stock, 0);
    const uniqueColors = [...new Set(variants.map(v => v.color))];
    const uniqueSizes = [...new Set(variants.map(v => v.size))];

    return (
      <EditableProductPage
        product={serializedProduct}
        primaryImage={primaryImage}
        allImages={allImages}
        variants={variants}
        totalStock={totalStock}
        totalVariants={totalVariants}
        uniqueColors={uniqueColors}
        uniqueSizes={uniqueSizes}
      />
    );
  } catch {
    return notFound();
  }
}