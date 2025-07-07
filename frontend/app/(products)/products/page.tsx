"use client";

import React, { useEffect, useState } from "react";
import { IProduct } from "../types";
import { getProducts } from "../services/api";
import { ProductCard } from "../components/ProductCard";
import { Filter } from "../components/Filter";
import { Button } from "@/components/ui/button";
import { MobileFilter } from "../components/MobileFilter";
import { Grid, List } from "lucide-react"


export const ProductsPage = () => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<IProduct[]>([]);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

    const colors = [
    { name: "Azul", value: "blue", color: "bg-blue-500" },
    { name: "Rosa", value: "pink", color: "bg-pink-500" },
    { name: "Púrpura", value: "purple", color: "bg-purple-500" },
    { name: "Negro", value: "black", color: "bg-black" },
    { name: "Blanco", value: "white", color: "bg-white border" },
    { name: "Rojo", value: "red", color: "bg-red-500" },
  ]
  
  useEffect(() => {
    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setFilteredProducts(data);
    };
    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-indigo-100 to-purple-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <div className="w-full lg:w-80 lg:flex-shrink-0">
              <Filter 
                products={products} 
                setFilteredProducts={setFilteredProducts} 
              />  
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {/* Results Count */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-sm text-gray-600">
                {filteredProducts.length} productos encontrados
              </p>
              {/* Sort Dropdown - Opcional */}
              <select className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option>Ordenar por</option>
                <option>Precio: Menor a Mayor</option>
                <option>Precio: Mayor a Menor</option>
                <option>Más Recientes</option>
                <option>Más Populares</option>
              </select>
            </div>

              <div className="flex items-center gap-4 flex-wrap">
                {/* Mobile Filter Button */}
                <MobileFilter products={products} setFilteredProducts={setFilteredProducts} />

                {/* View Mode Toggle */}
                <div className="flex items-center bg-white/70 backdrop-blur-sm rounded-lg border border-blue-200 p-1 mb-4">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                        : "text-gray-600 hover:text-blue-600"
                    }
                  >
                    <Grid className="h-4 w-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={
                      viewMode === "list"
                        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                        : "text-gray-600 hover:text-blue-600"
                    }
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </div>
              </div>

            {/* Products Grid */}
            {filteredProducts.length > 0 ? (
              <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3" : "flex flex-col w-11/12 mx-auto"}`}>
                {filteredProducts.map((product) => (
                  <div key={product.id} className="group">
                    <ProductCard data={product} />
                  </div>
                ))}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-12">
                <div className="w-24 h-24 mx-auto mb-4 text-gray-300">
                  {/* Ícono de búsqueda vacía */}
                  <svg
                    className="w-full h-full"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={1}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No se encontraron productos
                </h3>
                <p className="text-gray-600">
                  Intenta ajustar los filtros de búsqueda
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
