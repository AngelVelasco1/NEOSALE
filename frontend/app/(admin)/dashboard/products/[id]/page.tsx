import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/app/(admin)/components/ui/badge";
import { Button } from "@/app/(admin)/components/ui/button";
import Typography from "@/app/(admin)/components/ui/typography";
import PageTitle from "@/app/(admin)/components/shared/PageTitle";
import { ProductBadgeVariants } from "@/app/(admin)/constants/badge";
import { EditProductSheet } from "./_components/EditProductSheet";

import { prisma } from "@/lib/prisma";

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
  } catch (e) {
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
          where: { is_primary: true },
          take: 1,
        },
      },
    });

    if (!product) {
      return notFound();
    }

    const primaryImage = product.images?.[0]?.image_url || "/placeholder.svg";

    return (
      <section>
        <PageTitle className="lg:mb-10">Detalles del Producto</PageTitle>

        <div className="flex flex-col gap-6 lg:gap-8 md:flex-row mb-6">
          <div className="shrink-0 w-full max-w-80 mx-auto md:mx-0 md:max-w-72  xl:max-w-80">
            <Image
              src={primaryImage}
              alt={product.name}
              width={320}
              height={320}
              priority
              className="w-full aspect-square object-cover rounded-3xl"
            />
          </div>

          <div className="flex flex-col xl:pr-12">
            <div className="flex items-center gap-x-2 mb-2">
              <Typography component="p" className="font-semibold">
                Estado:
              </Typography>

              <Badge
                variant={
                  ProductBadgeVariants[
                    product.stock > 0 ? "selling" : "out-of-stock"
                  ]
                }
                className="shrink-0 text-xs"
              >
                {product.stock > 0 ? "Disponible" : "Agotado"}
              </Badge>
            </div>

            <Typography variant="h1" className="mb-2">
              {product.name}
            </Typography>

            <Typography
              variant="h1"
              component="span"
              className="mb-3 text-3xl md:text-4xl"
            >
              ${product.price.toLocaleString()}
            </Typography>

            <Typography component="p" className="mb-2">
              <Typography className="font-semibold">Stock:</Typography>{" "}
              <Typography className="text-foreground/60">
                {product.stock}
              </Typography>
            </Typography>

            <Typography
              component="p"
              className="mb-4 text-foreground/60 text-justify"
            >
              {product.description}
            </Typography>

            <Typography component="p" className="mb-3">
              <Typography className="font-semibold">Categoría:</Typography>{" "}
              <Typography className="text-foreground/60">
                {product.categories?.name || "Sin categoría"}
              </Typography>
            </Typography>

            <Typography component="p" className="mb-6">
              <Typography className="font-semibold">Marca:</Typography>{" "}
              <Typography className="text-foreground/60">
                {product.brands?.name || "Sin marca"}
              </Typography>
            </Typography>
          </div>
        </div>
      </section>
    );
  } catch (e) {
    return notFound();
  }
}
