"use client";
import { Banner } from "../components/Banner";
import { ProductCard } from "./(products)/components/ProductCard";

import React, { useEffect, useState } from "react";
import { getLatestProducts } from "./(products)/services/api";
import { IProduct } from "./(products)/types";
import { redirect } from "next/navigation";
import { Testimonials } from "../components/Testimonials";
import { BenefitsList } from "../components/BenefitsList";

export default function Home() {
  const [products, setProducts] = useState<IProduct[]>([]);


  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getLatestProducts();
      setProducts(data);
    };

    fetchProducts();
  }, []);
  return (
    <>
      <div className="container mx-auto flex flex-col gap-y-16">
        <div>
          <Banner />
        </div>
        <h3 className="text-3xl text-center">Ultimos Productos</h3>
        <div
          className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3
          2xl:grid-cols-4 gap-16 px-10 py-4`}
        >
          {products.map((product) => {
            return <ProductCard key={product.id} data={product} />;
          })}
          </div>
          <div
            className={
              "w-fit bg-[#A18A68] m-auto py-2 px-4 rounded-md text-white"
            }
          >
            <button onClick={() => redirect("/products")}>Show More</button>
        </div>

        <div className="mt-16 mb-4">
           <BenefitsList />
        </div>

        <div >
          <Testimonials />
        </div>
      </div>
    </>
  );
}
