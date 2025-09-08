"use client";
import React, { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ShoppingCart,
  Truck,
  Shield,
  Star,
  Check,
  Heart,
  Share2,
  Sparkles,
} from "lucide-react";
import { useCart } from "../../(cart)/hooks/useCart";
import { SetQuantity } from "../../../components/SetQuantity";
import type { IProductDetails, CartProductsInfo } from "../../types";
import {
  RiVisaLine,
  RiMastercardFill,
  RiPaypalFill,
  RiCashLine,
} from "react-icons/ri";
import { ErrorsHandler } from "@/app/errors/errorsHandler";
import { getProductVariantApi } from "../services/api";

export interface ProductDetailsProps {
  data: IProductDetails;
}

const paymentMethods = [
  { icon: <RiVisaLine />, name: "Visa" },
  { icon: <RiMastercardFill />, name: "Mastercard" },
  { icon: <RiPaypalFill />, name: "PayPal" },
  { icon: <RiCashLine />, name: "Efectivo" },
];

export const ProductDetails = ({ data }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const [variantStock, setVariantStock] = useState<number>(0);
  const [isLoadingStock, setIsLoadingStock] = useState(false);
  const [isSelectedVariant, setIsSelectedVariant] = useState(false);
  const { addProductToCart } = useCart();

  const images = Array.isArray(data.images) ? data.images : [];

  const fetchVariantStock = useCallback(
    async (id: number, color_code: string, size: string) => {
      if (!color_code || !size) {
        setVariantStock(0);
        setIsSelectedVariant(false);
        return;
      }

      try {
        setIsLoadingStock(true);
        const variant = await getProductVariantApi({
          id,
          color_code,
          size,
        });
        const variantStock = variant.stock || 0;

        setVariantStock(variantStock);
        setIsSelectedVariant(true);

        if (quantity > variantStock) {
          setQuantity(Math.max(1, Math.min(variantStock, quantity)));
        }
        setIsLoadingStock(false);
      } catch (error) {
        console.error("Error fetching variant stock:", error);
        setVariantStock(0);
        setIsSelectedVariant(false);
        setIsLoadingStock(false);
      }
    },
    [quantity]
  );

  useEffect(() => {
    if (selectedColor && selectedSize) {
      fetchVariantStock(data.id, selectedColor, selectedSize);
    } else {
      setVariantStock(0);
      setIsSelectedVariant(false);
    }
  }, [selectedColor, selectedSize, data.id, fetchVariantStock]);

  const handleAddToCart = useCallback(async () => {
    if (variantStock === 0) {
      ErrorsHandler.showError("Sin stock", "Esta variante no está disponible");
      return;
    }
    if (quantity > variantStock) {
      ErrorsHandler.showError(
        "Stock insuficiente",
        `Solo quedan ${variantStock} unidades`
      );
      return;
    }

    setIsAddingToCart(true);

    try {
      const selectedImageData = images.find(
        (img) => img.color_code === selectedColor
      );
      const product: CartProductsInfo = {
        id: data.id,
        color: selectedImageData?.color || "",
        color_code: selectedColor,
        imageUrl: selectedImageData?.image_url || "",
        name: data.name,
        price: data.price,
        quantity: quantity,
        size: selectedSize,
        total: data.price * quantity,
        stock: variantStock,
      };

      addProductToCart(product);
      ErrorsHandler.showSuccess("Producto añadido al carrito", "Revísalo");
    } catch (error) {
      ErrorsHandler.showError(error.message, "No se pudo agregar el producto");
    } finally {
      setIsAddingToCart(false);
    }
  }, [
    data,
    selectedColor,
    selectedSize,
    quantity,
    variantStock,
    addProductToCart,
    images,
  ]);

  const handleImageChange = (index: number, color: string) => {
    setSelectedColor(color);

    const colorImageIndex = data.images.findIndex(
      (img) => img.color_code === color
    );
    setSelectedImage(colorImageIndex !== -1 ? colorImageIndex : index);
  };

  useEffect(() => {
    if (images.length > 0) {
      setSelectedColor(images[0].color_code || "");
    }
  }, [images]);

  const isVariantInStock = variantStock > 0;
  const showStockInfo = isSelectedVariant || (selectedColor && selectedSize);
  const discountPercentage = data.base_discount;

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 max-w-7xl mx-auto">
          <div className="flex flex-col space-y-8">
            <div className=" aspect-square bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl overflow-hidden group transition-all duration-500  hover:scale-[1.01]">
              {images.length > 0 && images[selectedImage]?.image_url ? (
                <Image
                  src={images[selectedImage].image_url || "/placeholder.svg"}
                  alt={images[selectedImage].color || data.name}
                  fill
                  className="object-fit transition-all duration-700 ease-out group-hover:scale-105 group-hover:rotate-1"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center animate-pulse">
                    <div className="w-24 h-24 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center shadow-inner">
                      <ShoppingCart className="w-12 h-12 text-gray-500" />
                    </div>
                    <p className="text-sm font-medium">
                      No hay imagen disponible
                    </p>
                  </div>
                </div>
              )}

              {/* Botones de Acción */}
              <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <button className="bg-white/95 backdrop-blur-md hover:bg-white shadow-xl rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl border border-white/50">
                  <Heart className="h-4 w-4 text-gray-600 hover:text-red-500 transition-colors" />
                </button>
                <button className="bg-white/95 backdrop-blur-md hover:bg-white shadow-xl rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110 hover:shadow-2xl border border-white/50">
                  <Share2 className="h-4 w-4 text-gray-600 hover:text-blue-500 transition-colors" />
                </button>
              </div>
            </div>

            <div className="flex gap-6 px-2 overflow-x-auto pb-2 scrollbar-hide">
              {images.length > 0 ? (
                images.map((image, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index, image.color_code)}
                    className={`relative flex-shrink-0 aspect-square w-20 h-20 overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 cursor-pointer group ${
                      selectedImage === index
                        ? "ring-2 ring-blue-500/30 ring-offset-2 ring-offset-white shadow-lg scale-110 shadow-blue-500/25"
                        : "border border-gray-200/70 hover:border-blue-300 hover:shadow-lg"
                    }`}
                    style={{
                      animationDelay: `${index * 150}ms`,
                      animation: `slideInUp 0.6s ease-out forwards ${index * 150}ms`,
                    }}
                  >
                    <Image
                      src={image.image_url || "/placeholder.svg"}
                      alt={`${data.name} thumbnail ${index + 1}`}
                      fill
                      className="object-fit transition-all duration-300 group-hover:scale-110"
                    />
                    {selectedImage === index && (
                      <div className="absolute inset-0 bg-blue-500/10 rounded-2xl" />
                    )}
                  </button>
                ))
              ) : (
                <div className="flex gap-6 px-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="w-24 h-24 rounded-2xl animate-pulse bg-gradient-to-br from-gray-200 to-gray-300"
                    />
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-10">
              <div className="group bg-gradient-to-br from-emerald-50/80 to-green-50/60 rounded-2xl p-6 border border-emerald-200/60 hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-100 to-emerald-200 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    <Truck className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-2 text-lg">
                      Envío Gratis
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Compras superiores a $100.000
                    </p>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-blue-50/80 to-indigo-50/60 rounded-2xl p-6 border border-blue-200/60 hover:shadow-xl transition-all duration-500 hover:scale-105 hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-lg">
                    <Shield className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 mb-2 text-lg">
                      Compra Segura
                    </p>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Protección garantizada
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna Derecha: Información del Producto */}
          <div className="flex flex-col space-y-8">
            {/* Header con Badge y Rating */}
            <div className="space-y-6 animate-in slide-in-from-right duration-700">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <Badge className="bg-gradient-to-r from-blue-500/15 to-indigo-500/15 text-blue-700 border border-blue-200/50 px-5 py-2.5 rounded-full font-semibold shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300 hover:scale-105">
                  <Sparkles className="w-4 h-4 mr-2 animate-pulse" />
                  Nuevo Producto
                </Badge>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-amber-400 text-amber-400 transition-all duration-300 hover:scale-125"
                        style={{
                          animationDelay: `${i * 100}ms`,
                          filter: "drop-shadow(0 0 3px rgb(251 191 36 / 0.5))",
                        }}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-500 font-semibold ml-2 bg-amber-50 px-2 py-1 rounded-full">
                    4.8 ⭐
                  </span>
                </div>
              </div>

              {/* Título y Descripción */}
              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent leading-tight">
                  {data.name}
                </h1>
                <p className="text-slate-600 leading-relaxed text-xl font-medium">
                  {data.description}
                </p>
              </div>

              {/* Precio */}
              <div className="bg-gradient-to-r from-blue-50/90 to-indigo-50/90 rounded-3xl px-8 py-8 border border-blue-200/50 backdrop-blur-xl shadow-xl hover:shadow-2xl transition-all duration-500">
                <div className="flex items-center justify-between">
                  <div className="flex items-baseline gap-6">
                    <span className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                      $
                      {Math.round(
                        data.price - data.price * (discountPercentage / 100)
                      ).toLocaleString()}
                    </span>
                    {discountPercentage > 0 && (
                      <span className="text-2xl text-slate-400 line-through font-bold opacity-75">
                        ${Math.round(data.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {discountPercentage > 0 && (
                    <Badge className="bg-gradient-to-r from-red-500/80 to-red-600/80 text-white border-0 px-6 py-3 text-base font-bold rounded-full shadow-2xl shadow-red-500/25">
                      -{discountPercentage}% OFF
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* Estado de Stock */}
            <div className="bg-white/70 border border-gray-200/60 backdrop-blur-xl rounded-2xl px-7 py-3 w-fit shadow-lg transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center gap-4">
                <div
                  className={`w-4 h-4 rounded-full transition-all duration-500 shadow-lg ${
                    !showStockInfo
                      ? "bg-gradient-to-r from-blue-400 to-blue-600 animate-pulse shadow-blue-500/50"
                      : isVariantInStock
                      ? "bg-gradient-to-r from-emerald-400 to-emerald-600 animate-pulse shadow-emerald-500/50"
                      : "bg-gradient-to-r from-red-400 to-red-600 shadow-red-500/50"
                  }`}
                />
                <div>
                  <span
                    className={`font-bold text-lg transition-colors duration-300 ${
                      !showStockInfo
                        ? "text-slate-600"
                        : isVariantInStock
                        ? "text-emerald-700"
                        : "text-red-600"
                    }`}
                  >
                    {isLoadingStock
                      ? "Verificando disponibilidad..."
                      : !selectedColor || !selectedSize
                      ? "Selecciona variante completa"
                      : isVariantInStock
                      ? "Disponible en stock"
                      : "Producto agotado"}
                  </span>
                  {showStockInfo && isVariantInStock && !isLoadingStock && (
                    <span className="text-slate-500 text-sm  block font-medium">
                      {variantStock} unidades disponibles
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Selector de Tamaño */}
            {data?.sizes && (
              <div className="space-y-5">
                <div className="flex items-center justify-between">
                  <label className="text-xl font-bold text-slate-900">
                    📏 Tamaño
                  </label>
                  <span className="text-sm text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-full">
                    {selectedSize
                      ? `Talla ${selectedSize}`
                      : "Selecciona tu talla"}
                  </span>
                </div>
                <RadioGroup
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                  className="grid grid-cols-4 sm:grid-cols-6 gap-4"
                >
                  {data.sizes.split(",").map((size, index) => (
                    <label
                      key={size}
                      className={`relative flex cursor-pointer items-center justify-center rounded-2xl border-2 p-4 text-sm font-bold transition-all duration-300 hover:scale-110 hover:-translate-y-1 ${
                        selectedSize === size
                          ? "border-blue-500 bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xl shadow-blue-500/60 scale-105"
                          : "border-gray-200 bg-gradient-to-br from-white to-gray-50 text-slate-700 hover:border-blue-400 hover:shadow-xl"
                      }`}
                      style={{
                        animationDelay: `${index * 100}ms`,
                        animation: `fadeInUp 0.6s ease-out forwards ${
                          index * 100
                        }ms`,
                      }}
                    >
                      <RadioGroupItem value={size} className="sr-only" />
                      {size.toUpperCase()}
                     
                    </label>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Selector de Color */}
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <label className="text-xl font-bold text-slate-900">
                  🎨 Color
                </label>
                <span className="text-sm text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-full">
                  {images.find((img) => img.color_code === selectedColor)
                    ?.color || "Selecciona color"}
                </span>
              </div>
              <div className="flex flex-wrap gap-5">
                {images
                  .map((img) => img.color_code)
                  .filter(
                    (value: string, index: number, self: Array<string>) =>
                      value && self.indexOf(value) === index
                  )
                  .map((colorCode: string, index) => (
                    <button
                      key={colorCode}
                      onClick={() => handleImageChange(0, colorCode)}
                      className={`relative w-14 h-14 rounded-full transition-all duration-400 hover:scale-125 hover:-translate-y-1 border-4 shadow-lg ${
                        selectedColor === colorCode
                          ? "ring-4 ring-blue-500 ring-offset-4 ring-offset-white shadow-2xl scale-125 -translate-y-1 border-white"
                          : "border-gray-300 hover:border-white hover:shadow-2xl"
                      }`}
                      style={{
                        backgroundColor: colorCode,
                        animationDelay: `${index * 150}ms`,
                        boxShadow:
                          selectedColor === colorCode
                            ? `0 10px 25px -5px ${colorCode}40, 0 0 0 4px #3b82f6`
                            : `0 4px 12px -2px ${colorCode}30`,
                      }}
                    >
                      {selectedColor === colorCode && (
                        <div className="absolute inset-0 rounded-full bg-white/40 flex items-center justify-center">
                          <Check className="w-6 h-6 text-white drop-shadow-lg " />
                        </div>
                      )}
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300" />
                    </button>
                  ))}
              </div>
            </div>

            {/* Cantidad y Botón de Añadir */}
            <div className="space-y-8 pt-4">
              <div className="flex items-center gap-6">
                <div className="flex-shrink-0">
                  <SetQuantity
                    cartProduct={{ quantity }}
                    handleDecrease={() =>
                      setQuantity((prev) => Math.max(1, prev - 1))
                    }
                    handleIncrease={() =>
                      setQuantity((prev) =>
                        Math.min(variantStock || 99, prev + 1)
                      )
                    }
                  />
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={
                    !selectedSize ||
                    !selectedColor ||
                    !isVariantInStock ||
                    isAddingToCart ||
                    isLoadingStock ||
                    variantStock === 0
                  }
                  className="flex-1 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700 text-white py-8 text-xl font-bold rounded-2xl shadow-2xl hover:shadow-3xl transition-all duration-500 hover:scale-105 hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:translate-y-0 disabled:hover:shadow-2xl min-h-[4rem] border-0"
                  size="lg"
                >
                  {isLoadingStock ? (
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verificando...</span>
                    </div>
                  ) : isAddingToCart ? (
                    <div className="flex items-center gap-4">
                      <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Añadiendo al carrito...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-4">
                      <span>
                        {!selectedColor || !selectedSize
                          ? "🔍 Selecciona variante"
                          : variantStock === 0
                          ? "❌ Sin stock"
                          : "🛒 Añadir al carrito"}
                      </span>
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* Métodos de Pago */}
            <div className="bg-gradient-to-br from-white/90 to-gray-50/80 rounded-3xl p-8 border border-gray-200/60 shadow-2xl backdrop-blur-xl mt-auto hover:shadow-3xl transition-all duration-500">
              <div className="flex items-center gap-5 mb-8">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-xl">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <p className="font-black text-slate-900 text-xl">
                  🔒 Métodos de Pago Seguros
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="group bg-gradient-to-br from-gray-50/90 to-white/90 rounded-2xl p-5 text-center border border-gray-200/60 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 transition-all duration-400 hover:scale-110 hover:-translate-y-2 hover:shadow-2xl"
                    style={{ animationDelay: `${index * 200}ms` }}
                  >
                    <div className="text-4xl mb-3 text-slate-600 group-hover:text-blue-600 transition-all duration-300 group-hover:scale-125">
                      <div className="flex justify-center">{method.icon}</div>
                    </div>
                    <p className="text-xs text-slate-600 font-bold group-hover:text-slate-900 transition-colors duration-300">
                      {method.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
