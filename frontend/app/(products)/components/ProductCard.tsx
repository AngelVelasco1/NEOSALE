import Image from "next/image"
import Link from "next/link"
import { Skeleton } from "../../../components/ui/skeleton"
import type { IProduct } from "../types"
import React from 'react'
export interface ProductCardProps {
  data: IProduct
}

export const ProductCard = ({ data }: ProductCardProps) => {
  return (
    <Link href={`/${data.id}`}>
      <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-50 via-purple-50 to-fuchsia-50 border border-blue-100/50 hover:border-purple-200/70 transition-all duration-500 hover:shadow-2xl hover:shadow-purple-500/20 hover:-translate-y-2">
        {/* Gradient overlay effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-fuchsia-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Content container */}
        <div className="relative p-4 space-y-4">
          {/* Image container */}
          <div className="relative aspect-square overflow-hidden rounded-xl bg-gradient-to-br from-white to-blue-50/50 shadow-inner">
            {data.imageUrl ? (
              <Image
                src={data.imageUrl || "/placeholder.svg"}
                alt="product"
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-contain object-center p-4 group-hover:scale-110 transition-transform duration-700"
                priority
              />
            ) : (
              <Skeleton className="w-full h-full rounded-xl bg-gradient-to-br from-blue-100 to-purple-100" />
            )}

            {/* Stock badge */}
            <div className="absolute top-3 right-3">
              <div
                className={`px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm ${
                  data.stock > 0
                    ? "bg-gradient-to-r from-emerald-400/90 to-green-500/90 text-white shadow-lg"
                    : "bg-gradient-to-r from-red-400/90 to-pink-500/90 text-white shadow-lg"
                }`}
              >
                {data.stock > 0 ? "Disponible" : "Agotado"}
              </div>
            </div>
          </div>

          {/* Product info */}
          <div className="space-y-3">
            {/* Product name */}
            <h3 className="text-sm font-semibold text-gray-800 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:via-purple-600 group-hover:to-fuchsia-600 group-hover:bg-clip-text transition-all duration-300 line-clamp-2 leading-relaxed">
              {data.name}
            </h3>

            {/* Price and stock info */}
            <div className="flex justify-between items-center">
              <div className="space-y-1">
                <p className="text-xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                  ${data.price.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">{data.stock > 0 ? `${data.stock} en stock` : "Sin stock"}</p>
              </div>

              {/* Color indicator */}
              <div className="flex flex-col items-end space-y-1">
                <div
                  className="w-6 h-6 rounded-full border-2 border-white shadow-lg ring-1 ring-gray-200/50"
                  style={{ backgroundColor: data.colorCode }}
                  title={data.color}
                />
                <span className="text-xs text-gray-500 capitalize">{data.color}</span>
              </div>
            </div>
          </div>

          {/* Hover effect gradient line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-indigo-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
        </div>

        {/* Floating action button */}
        <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-y-2 group-hover:translate-y-0">
          <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600 flex items-center justify-center shadow-lg backdrop-blur-sm">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
          </div>
        </div>

        {/* Shimmer effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12" />
      </div>
    </Link>
  )
}
