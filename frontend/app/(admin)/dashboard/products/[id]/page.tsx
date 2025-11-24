import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";

import { Badge } from "@/app/(admin)/components/ui/badge";
import Typography from "@/app/(admin)/components/ui/typography";
import PageTitle from "@/app/(admin)/components/shared/PageTitle";

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
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <PageTitle className="mb-0">Detalles del Producto</PageTitle>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Columna principal - Información del producto */}
          <div className="xl:col-span-2 space-y-6">
            {/* Card de información principal */}
            <div className="p-6 rounded-xl bg-card border border-border">
              <div className="flex flex-col md:flex-row gap-6">
                {/* Imagen principal */}
                <div className="shrink-0 w-full md:w-64">
                  <div className="relative aspect-square rounded-lg overflow-hidden bg-slate-900/50 border-none border-slate-900/50">
                    <Image
                      src={primaryImage}
                      alt={product.name}
                      fill
                      priority
                      className="object-cover"
                    />
                  </div>
                  
                  {/* Galería de imágenes */}
                  {allImages.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-3">
                      {allImages.slice(0, 4).map((img, idx) => (
                        <div key={idx} className="relative aspect-square rounded-md overflow-hidden bg-slate-900/50 border border-slate-700/50 cursor-pointer hover:border-blue-500/50 transition-colors">
                          <Image
                            src={img.image_url}
                            alt={`${product.name} - ${idx + 1}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Información principal */}
                <div className="flex-1 space-y-4">
                  <div>
                    <Typography variant="h1" className="text-2xl font-bold mb-2">
                      {product.name}
                    </Typography>
                    <div className="flex items-baseline gap-2">
                      <Typography className="text-3xl font-bold text-blue-400">
                        ${product.price.toLocaleString()}
                      </Typography>
                      <span className="text-slate-400 text-sm">COP</span>
                    </div>
                  </div>

                  <Typography className="text-sm text-slate-300 leading-relaxed">
                    {product.description}
                  </Typography>

                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-3 pt-3">
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-blue-400" />
                      <div>
                        <Typography className="text-xs text-slate-400">Categoría</Typography>
                        <Typography className="text-sm font-semibold">{product.categories?.name || "N/A"}</Typography>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-purple-400" />
                      <div>
                        <Typography className="text-xs text-slate-400">Marca</Typography>
                        <Typography className="text-sm font-semibold">{product.brands?.name || "N/A"}</Typography>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-green-400" />
                      <div>
                        <Typography className="text-xs text-slate-400">Stock Total</Typography>
                        <Typography className="text-sm font-semibold">{totalStock} unidades</Typography>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="size-2 rounded-full bg-cyan-400" />
                      <div>
                        <Typography className="text-xs text-slate-400">Peso</Typography>
                        <Typography className="text-sm font-semibold">{product.weight_grams}g</Typography>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Variantes */}
            {totalVariants > 0 && (
              <div className="p-6 rounded-xl bg-card border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <Typography variant="h2" className="text-lg font-bold">
                    Variantes del Producto
                  </Typography>
                  <Badge variant="outline" className="text-xs">
                    {totalVariants} variantes
                  </Badge>
                </div>

                {/* Colores y tallas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {uniqueColors.length > 0 && (
                    <div className="space-y-2">
                      <Typography className="text-xs font-semibold text-slate-400">Colores disponibles</Typography>
                      <div className="flex flex-wrap gap-2">
                        {uniqueColors.map((color) => {
                          const variant = variants.find(v => v.color === color);
                          return (
                            <div
                              key={color}
                              className="flex items-center gap-2 px-3 py-1.5 rounded-md bg-slate-900/30 border border-slate-700/50 text-xs"
                            >
                              <div
                                className="size-3 rounded-full border border-slate-600"
                                style={{ backgroundColor: variant?.color_code }}
                              />
                              <span>{color}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {uniqueSizes.length > 0 && (
                    <div className="space-y-2">
                      <Typography className="text-xs font-semibold text-slate-400">Tallas disponibles</Typography>
                      <div className="flex flex-wrap gap-2">
                        {uniqueSizes.map((size) => (
                          <div
                            key={size}
                            className="px-3 py-1.5 rounded-md bg-slate-900/30 border border-slate-700/50 text-xs font-medium"
                          >
                            {size}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Tabla de variantes */}
                <div className="overflow-hidden rounded-lg border border-slate-700/50">
                  <table className="w-full text-xs">
                    <thead className="bg-slate-900/50">
                      <tr>
                        <th className="px-4 py-3 text-left font-semibold text-slate-400">Color</th>
                        <th className="px-4 py-3 text-left font-semibold text-slate-400">Talla</th>
                        <th className="px-4 py-3 text-right font-semibold text-slate-400">Stock</th>
                        <th className="px-4 py-3 text-right font-semibold text-slate-400">Precio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {variants.map((variant) => (
                        <tr key={variant.id} className="hover:bg-slate-900/20 transition-colors">
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div
                                className="size-3 rounded-full border border-slate-600"
                                style={{ backgroundColor: variant.color_code }}
                              />
                              <span className="font-medium">{variant.color}</span>
                            </div>
                          </td>
                          <td className="px-4 py-3 font-medium">{variant.size}</td>
                          <td className="px-4 py-3 text-right">
                            <Badge 
                              variant={variant.stock > 0 ? "success" : "destructive"} 
                              className="text-xs px-2 py-0.5"
                            >
                              {variant.stock}
                            </Badge>
                          </td>
                          <td className="px-4 py-3 text-right font-semibold">
                            {variant.price ? `$${variant.price.toLocaleString()}` : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar derecho - Información adicional */}
          <div className="space-y-6">
            {/* Estado y disponibilidad */}
            <div className="p-6 rounded-xl bg-card border border-border space-y-4">
              <Typography variant="h3" className="text-base font-bold">
                Estado y Disponibilidad
              </Typography>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30">
                  <Typography className="text-xs text-slate-400">Stock Base</Typography>
                  <Badge variant={product.stock > 0 ? "success" : "destructive"}>
                    {product.stock} unidades
                  </Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30">
                  <Typography className="text-xs text-slate-400">Estado</Typography>
                  <Badge variant={product.active ? "success" : "destructive"}>
                    {product.active ? "Activo" : "Inactivo"}
                  </Badge>
                </div>

                {product.in_offer && (
                  <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
                    <div className="flex items-center justify-between mb-2">
                      <Typography className="text-xs font-semibold text-orange-400">En Oferta</Typography>
                      <Badge variant="warning" className="text-xs">
                        {product.offer_discount ? Number(product.offer_discount) : 0}% OFF
                      </Badge>
                    </div>
                    {product.offer_end_date && (
                      <Typography className="text-xs text-slate-400">
                        Hasta: {new Date(product.offer_end_date).toLocaleDateString()}
                      </Typography>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Descuentos */}
            <div className="p-6 rounded-xl bg-card border border-border space-y-4">
              <Typography variant="h3" className="text-base font-bold">
                Descuentos
              </Typography>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30">
                  <Typography className="text-xs text-slate-400">Descuento Base</Typography>
                  <Typography className="text-sm font-bold text-blue-400">
                    {Number(product.base_discount)}%
                  </Typography>
                </div>

                {product.in_offer && product.offer_discount && (
                  <div className="flex items-center justify-between p-3 rounded-lg bg-slate-900/30">
                    <Typography className="text-xs text-slate-400">Descuento Oferta</Typography>
                    <Typography className="text-sm font-bold text-orange-400">
                      {Number(product.offer_discount)}%
                    </Typography>
                  </div>
                )}
              </div>
            </div>

            {/* Información adicional */}
            <div className="p-6 rounded-xl bg-card border border-border space-y-4">
              <Typography variant="h3" className="text-base font-bold">
                Información Adicional
              </Typography>
              
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center">
                  <Typography className="text-slate-400">Tallas</Typography>
                  <Typography className="font-medium">{product.sizes}</Typography>
                </div>
                <div className="flex justify-between items-center">
                  <Typography className="text-slate-400">Peso</Typography>
                  <Typography className="font-medium">{product.weight_grams}g</Typography>
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-slate-700/30">
                  <Typography className="text-slate-400">Creado</Typography>
                  <Typography className="font-medium">
                    {new Date(product.created_at).toLocaleDateString()}
                  </Typography>
                </div>
                {product.updated_at && (
                  <div className="flex justify-between items-center">
                    <Typography className="text-slate-400">Actualizado</Typography>
                    <Typography className="font-medium">
                      {new Date(product.updated_at).toLocaleDateString()}
                    </Typography>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } catch {
    return notFound();
  }
}
