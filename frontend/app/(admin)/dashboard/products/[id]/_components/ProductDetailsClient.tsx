"use client";

import {
  EditableField,
  ToggleField,
  QuickStats,
  ImageGallery
} from "./InteractiveComponents";
import {
  updateProductField,
  toggleProductStatus,
  toggleProductOffer,
  updateProductStock,
  updateProductPrice
} from "./ProductActions";
import Typography from "@/app/(admin)/components/ui/typography";
import { Badge } from "@/app/(admin)/components/ui/badge";
import {
  Package,
  Palette,
  Ruler,
  Weight,
  Eye,
  TrendingUp,
  ShoppingCart,
  Tag
} from "lucide-react";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  weight_grams: number;
  sizes: string;
  base_discount: number;
  active: boolean;
  in_offer: boolean;
  offer_discount: number | null;
  offer_end_date: Date | null;
  created_at: string;
  updated_at: string | null;
  categories: { name: string } | null;
  brands: { name: string } | null;
  images: Array<{
    image_url: string;
    is_primary: boolean;
    color: string | null;
  }>;
  product_variants: Array<{
    id: number;
    color: string;
    color_code: string;
    size: string;
    stock: number;
    price: number | null;
  }>;
}

interface ProductDetailsClientProps {
  product: Product;
}

export function ProductDetailsClient({ product }: ProductDetailsClientProps) {
  const variants = product.product_variants || [];
  const totalVariants = variants.length;
  const totalStock = variants.reduce((sum, v) => sum + v.stock, product.stock);
  const uniqueColors = [...new Set(variants.map(v => v.color))];
  const uniqueSizes = [...new Set(variants.map(v => v.size))];

  // Handlers para edición
  const handleUpdateField = async (field: string, value: string | number) => {
    const result = await updateProductField(product.id, field, value);
    return result.success;
  };

  const handleToggleStatus = async (isActive: boolean) => {
    const result = await toggleProductStatus(product.id, isActive);
    return result.success;
  };

  const handleToggleOffer = async (inOffer: boolean) => {
    const result = await toggleProductOffer(product.id, inOffer);
    return result.success;
  };

  const handleUpdateStock = async (stock: string | number) => {
    const result = await updateProductStock(product.id, Number(stock));
    return result.success;
  };

  const handleUpdatePrice = async (price: string | number) => {
    const result = await updateProductPrice(product.id, Number(price));
    return result.success;
  };

  // Estadísticas rápidas
  const stats = [
    {
      label: "Stock Total",
      value: totalStock,
      icon: <Package className="h-4 w-4" />,
      color: "bg-blue-500/10 text-blue-400",
      trend: { value: 12, isPositive: true }
    },
    {
      label: "Variantes",
      value: totalVariants,
      icon: <Palette className="h-4 w-4" />,
      color: "bg-purple-500/10 text-purple-400"
    },
    {
      label: "Colores",
      value: uniqueColors.length,
      icon: <Palette className="h-4 w-4" />,
      color: "bg-green-500/10 text-green-400"
    },
    {
      label: "Tallas",
      value: uniqueSizes.length,
      icon: <Ruler className="h-4 w-4" />,
      color: "bg-yellow-500/10 text-yellow-400"
    }
  ];

  return (
    <>
      {/* Estadísticas rápidas */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 backdrop-blur-sm shadow-xl">
        <Typography variant="h3" className="text-lg font-bold mb-4">
          Estadísticas Rápidas
        </Typography>
        <QuickStats stats={stats} />
      </div>

      {/* Información editable */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 backdrop-blur-sm shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <Typography variant="h3" className="text-lg font-bold">
            Información Editable
          </Typography>
          <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
            Click para editar
          </Badge>
        </div>

        <div className="space-y-3">
          <EditableField
            label="Nombre del Producto"
            value={product.name}
            onSave={(value) => handleUpdateField("name", value)}
            icon={<Tag className="h-4 w-4" />}
          />

          <EditableField
            label="Descripción"
            value={product.description}
            type="textarea"
            onSave={(value) => handleUpdateField("description", value)}
            icon={<Eye className="h-4 w-4" />}
          />

          <EditableField
            label="Precio"
            value={product.price}
            type="number"
            onSave={handleUpdatePrice}
            icon={<TrendingUp className="h-4 w-4" />}
            suffix="COP"
          />

          <EditableField
            label="Stock Base"
            value={product.stock}
            type="number"
            onSave={handleUpdateStock}
            icon={<ShoppingCart className="h-4 w-4" />}
            suffix="unidades"
          />

          <EditableField
            label="Peso"
            value={product.weight_grams}
            type="number"
            onSave={(value) => handleUpdateField("weight_grams", value)}
            icon={<Weight className="h-4 w-4" />}
            suffix="gramos"
          />

          <EditableField
            label="Tallas"
            value={product.sizes}
            onSave={(value) => handleUpdateField("sizes", value)}
            icon={<Ruler className="h-4 w-4" />}
          />

          <EditableField
            label="Descuento Base"
            value={Number(product.base_discount) || 0}
            type="number"
            onSave={(value) => handleUpdateField("base_discount", value)}
            icon={<Tag className="h-4 w-4" />}
            suffix="%"
          />
        </div>
      </div>

      {/* Estados y configuración */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 backdrop-blur-sm shadow-xl space-y-4">
        <Typography variant="h3" className="text-lg font-bold">
          Estados y Configuración
        </Typography>

        <div className="space-y-3">
          <ToggleField
            label="Estado del Producto"
            value={product.active}
            onToggle={handleToggleStatus}
            icon={<Package className="h-4 w-4" />}
            trueLabel="Activo"
            falseLabel="Inactivo"
          />

          <ToggleField
            label="En Oferta"
            value={product.in_offer}
            onToggle={handleToggleOffer}
            icon={<Tag className="h-4 w-4" />}
            trueLabel="Sí"
            falseLabel="No"
          />
        </div>

        {product.in_offer && (
          <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30 space-y-3">
            <Typography className="text-sm font-bold text-orange-400">
              Configuración de Oferta
            </Typography>

            <EditableField
              label="Descuento de Oferta"
              value={Number(product.offer_discount) || 0}
              type="number"
              onSave={(value) => handleUpdateField("offer_discount", value)}
              icon={<Tag className="h-4 w-4" />}
              suffix="%"
            />

            {product.offer_end_date && (
              <div className="text-xs text-slate-400">
                Finaliza: {new Date(product.offer_end_date).toLocaleDateString()}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Galería de imágenes mejorada */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 backdrop-blur-sm shadow-xl">
        <Typography variant="h3" className="text-lg font-bold mb-4">
          Galería de Imágenes
        </Typography>
        <ImageGallery
          images={product.images.map(img => ({
            ...img,
            color: img.color || undefined
          }))}
          productName={product.name}
        />
      </div>
    </>
  );
}