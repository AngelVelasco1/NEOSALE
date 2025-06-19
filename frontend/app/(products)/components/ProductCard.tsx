import Image from "next/image"
import Link from "next/link"
import React from 'react';
import { Skeleton } from "../../../components/ui/skeleton";

import { IProduct } from "../types";

export interface ProductCardProps {
    data: IProduct
}

export const ProductCard = ({ data }: ProductCardProps) => {  
  return (
  <Link href={`/${data.id}`}>
      <div className="flex flex-col group relative transition-transform hover:scale-105 p-3 gap-4">
        <div className="relative aspect-square overflow-hidden w-full">
          {data.imageUrl ? <Image
            src={data.imageUrl}
            alt="product"
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-contain object-center rounded-lg"
            priority
          /> : <Skeleton className="w-full h-full rounded-lg" />}
          

        </div>
        <div>
          <h3 className="text-sm font-medium text-gray-900 truncate">{data.name}</h3>
        </div>
        <div className="flex justify-between items-center">
          <p className="text-lg font-semibold text-gray-900">${data.price}</p>
          <p>{data.stock > 0 ? "Disponible" : "No disponible"}</p>
        </div>
      </div>
    </Link>    
    )
}

