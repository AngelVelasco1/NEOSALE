"use client";

import React, { useEffect, useState } from "react";
import { IProduct } from "../../types";
import { getProducts } from "../services/api";
import { ProductCard } from "../components/ProductCard";
import { ProductFilter } from "../components/Filters";



export const ProductsPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);

  
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
    };
    fetchProducts();
  }, []);

   return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[300px_1fr] gap-8">
          {/* Filter Sidebar */}
          <div className="lg:block">
            <ProductFilter products={products} setFilteredProducts={setFilteredProducts} />
          </div>

          {/* Products Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-gray-900">Productos ({filteredProducts.length})</h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} data={product} />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No se encontraron productos con los filtros aplicados.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
};

export default ProductsPage;
