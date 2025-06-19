"use client";

import React, { useEffect, useState } from "react";
import { IProduct } from "../types";
import { getProducts } from "../services/api";
import { ProductCard } from "../components/ProductCard";
import { Filter } from "../components/filter";

export const ProductsPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
        console.log("API products response:", data);
      setProducts(data);
      setFilteredProducts(data)
    };
    fetchProducts();
  }, []);
  return (
    <div className="container grid grid-cols-[1fr,2fr]">
      <div className="">
        <Filter products={products} setFilteredProducts={setFilteredProducts} />
      </div>
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 
    2xl:grid-cols-5 gap-10 p-4`}
      >
        {filteredProducts.map((product) => {
          return <ProductCard data={product} key={product.id} />;
        })}
      </div>
    </div>
  );
};

export default ProductsPage;
