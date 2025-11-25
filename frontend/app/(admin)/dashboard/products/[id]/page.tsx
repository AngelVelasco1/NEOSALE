import { Metadata } from "next";
import { notFound } from "next/navigation";



import { prisma } from "@/lib/prisma";
import { EditableProductPage } from "./_components/EditableProductPage";

type PageParams = {
  params: {
    id: string;
  };
};

export async function generateMetadata({
  params: { id },
}: PageParams): Promise<Metadata> {
  try {
    const productId = parseInt(id);
    const product = await prisma.products.findUnique({
      where: { id: productId },
      select: { name: true },
    });

    if (!product) {
      return { title: "Product not found" };
    }

    return { title: product.name };
  } catch {
    return { title: "Product not found" };
  }
}

export default async function ProductDetails({ params: { id } }: PageParams) {
  try {
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

    const primaryImage = product.images?.[0]?.image_url || "/placeholder.svg";
    const allImages = product.images || [];
    const variants = product.product_variants || [];

    // Calcular estadísticas
    const totalVariants = variants.length;
    const totalStock = variants.reduce((sum, v) => sum + v.stock, product.stock);
    const uniqueColors = [...new Set(variants.map(v => v.color))];
    const uniqueSizes = [...new Set(variants.map(v => v.size))];

    return (
      <EditableProductPage
        product={product}
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