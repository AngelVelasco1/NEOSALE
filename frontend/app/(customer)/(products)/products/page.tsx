"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { IProduct } from "../../types";
import { getProducts } from "../services/api";
import { ProductCard } from "../components/ProductCard";
import { ProductFilter } from "../components/Filters";

function ProductsPage() {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const searchParams = useSearchParams();

  // Función auxiliar para normalizar cadenas y ignorar acentos en búsquedas
  const normalizeForSearch = (str: string): string => {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
    };
    fetchProducts();
  }, []);

  // Handle URL search params and filtering
  useEffect(() => {
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      // Filter products based on search query, ignoring accents
      const queryNormalized = normalizeForSearch(searchQuery);
      const filtered = products.filter(
        (product) =>
          normalizeForSearch(product.name).includes(queryNormalized) ||
          normalizeForSearch(product.category).includes(queryNormalized)
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [products, searchParams]);

  return (
    <div className="relative min-h-screen bg-linear-to-br from-slate-900  via-slate to-slate-900">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(71,85,105,0.12)_1px,transparent_1px),linear-gradient(90deg,rgba(71,85,105,0.12)_1px,transparent_1px)] bg-position-[80px_80px]" />
      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[350px_1fr] gap-8">
          {/* Filter Sidebar */}
          <div className="lg:block">
            <ProductFilter
              products={products}
              setFilteredProducts={setFilteredProducts}
            />
          </div>

          {/* Products Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-bold text-white">
                Productos ({filteredProducts.length})
              </h1>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  data={{
                    id: product.id.toString(),
                    name: product.name,
                    price: product.price,
                    stock: product.stock,
                    color: product.color,
                    color_code: product.color_code,
                    image_url: product.image_url,
                  }}
                />
              ))}
            </div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">
                  No se encontraron productos con los filtros aplicados.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductsPage;
