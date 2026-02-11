import { ProductDetails } from "../components/ProductDetails";
import React, { Suspense } from "react";
import { getProduct } from "@/app/(customer)/(products)/services/api";
import { notFound } from "next/navigation";
 
type idParam = Promise<{
    productId: string
}>

// Fallback component for Suspense
function ProductDetailsSkeleton() {
  return (
    <div className="container mx-auto py-8">
      <div className="animate-pulse space-y-4">
        <div className="h-96 bg-gray-200 rounded-lg" />
        <div className="h-12 bg-gray-200 rounded w-3/4" />
        <div className="h-32 bg-gray-200 rounded" />
      </div>
    </div>
  );
}

async function Product({params}: {params : idParam}) {
    const { productId } = await params;
    
    // Verificar si productId es un número válido
    const numericId = parseInt(productId);
    if (isNaN(numericId) || numericId <= 0 || !productId.match(/^\d+$/)) {
        notFound();
    }
    
    try {
        const product = await getProduct(numericId);
        
        // Verificar si el producto existe
        if (!product || !product.id) {
            notFound();
        }
        
        return (
            <div className={`container mx-auto`}>
                <Suspense fallback={<ProductDetailsSkeleton />}>
                    <ProductDetails key={product.id} data={product}/>
                </Suspense>
            </div>
        );
    } catch (error) {
        // Si hay error al obtener el producto, mostrar 404
        notFound();
    }
}

export default Product;