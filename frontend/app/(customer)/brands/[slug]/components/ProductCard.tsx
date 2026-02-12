"use client";

import Image from "next/image";
import Link from "next/link";
import { Package2, ShoppingCart, Eye } from "lucide-react";

interface ProductCardProps {
  product: {
    id: number;
    name: string;
    price: number;
    stock: number;
    images: Array<{
      id: number;
      image_url: string;
      is_primary: boolean;
    }>;
  };
}

export function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.images[0]?.image_url || null;
  const isOutOfStock = product.stock === 0;

  return (
    <Link
      href={`/product/${product.id}`}
      className="group relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-900/80 to-slate-800/60 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300 hover:scale-[1.02]"
    >
      {/* Hover Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-fuchsia-500/0 group-hover:from-purple-500/5 group-hover:to-fuchsia-500/5 transition-all duration-300 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10">
        {/* Product Image */}
        <div className="relative w-full aspect-square bg-slate-800/50 overflow-hidden">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover group-hover:scale-110 transition-transform duration-500"
              unoptimized={primaryImage.includes('via.placeholder.com') || primaryImage.includes('static.nike.com')}
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
              }}
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <Package2 className="w-16 h-16 text-slate-600" />
            </div>
          )}
          
          {/* Quick Actions Overlay */}
          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
            <button 
              className="w-10 h-10 rounded-lg bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center hover:bg-white/30 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.open(`/product/${product.id}`, '_blank');
              }}
              title="Vista rápida"
            >
              <Eye className="w-5 h-5 text-white" />
            </button>
            <button 
              className="w-10 h-10 rounded-lg backdrop-blur-sm border flex items-center justify-center transition-colors"
              style={{
                backgroundColor: `rgba(var(--color-accent-rgb), 0.9)`,
                borderColor: `rgba(var(--color-accent-rgb), 0.5)`,
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = `rgba(var(--color-accent-rgb), 1)`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = `rgba(var(--color-accent-rgb), 0.9)`;
              }}
              onClick={(e) => {
                e.stopPropagation();
              }}
              title="Ver detalles"
            >
              <ShoppingCart className="w-5 h-5 text-white" />
            </button>
          </div>

          {/* Stock Badge */}
          {isOutOfStock && (
            <div className="absolute top-3 right-3 px-2 py-1 rounded-lg bg-red-600/90 backdrop-blur-sm border border-red-500/30">
              <span className="text-xs font-semibold text-white">Agotado</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <h3 className="text-sm font-semibold text-white line-clamp-2 group-hover:text-purple-300 transition-colors">
            {product.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-purple-400">
              ${product.price.toLocaleString()}
            </span>
            
            {!isOutOfStock && (
              <span className="text-xs text-slate-500">
                Stock: {product.stock}
              </span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
