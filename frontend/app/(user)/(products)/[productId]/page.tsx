import { ProductDetails } from "../components/ProductDetails";
import React from "react";
import { getProduct } from "@/app/(user)/(products)/services/api";
 
type idParam = {
    productId: string
}
export const Product = async ({params}: {params : idParam}) => {
    const { productId } = await params;
    const product = await getProduct(parseInt(productId));    
        
    return (
        <div className={`container mx-auto`}>
            <ProductDetails key={product.id} data={product}/>
        </div>
    )
  
}

export default Product;