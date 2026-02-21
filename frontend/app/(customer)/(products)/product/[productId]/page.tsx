import { ProductDetails } from "../../components/ProductDetails";
import React from "react";
import { getProduct } from "@/app/(customer)/(products)/services/api";
import { notFound } from "next/navigation";
 
type idParam = Promise<{
    productId: string
}>

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
                <ProductDetails key={product.id} data={product}/>
            </div>
        );
    } catch (error) {
        // Si hay error al obtener el producto, mostrar 404
        notFound();
    }
}

export default Product;