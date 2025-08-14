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
import { getVariantStockApi } from "../services/api"; // ✅ NUEVO IMPORT

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
  // ✅ NUEVOS ESTADOS PARA MANEJO DE STOCK POR VARIANTE
  const [variantStock, setVariantStock] = useState<number>(0);
  const [isLoadingStock, setIsLoadingStock] = useState(false);
  const [hasSelectedVariant, setHasSelectedVariant] = useState(false);
  
  const { addProductToCart } = useCart();

  const images = Array.isArray(data.images) ? data.images : [];

  // ✅ NUEVA FUNCIÓN PARA OBTENER STOCK DE VARIANTE
  const fetchVariantStock = useCallback(async (productId: number, colorCode: string, size: string) => {
    if (!colorCode || !size) {
      setVariantStock(0);
      setHasSelectedVariant(false);
      return;
    }
    
    try {
      setIsLoadingStock(true);
      const response = await getVariantStockApi({
        id: productId,
        color_code: colorCode,
        size: size
      });
      
      const stock = response.data?.stock || response.stock || 0;
      setVariantStock(stock);
      setHasSelectedVariant(true);
      
      // ✅ Ajustar cantidad si excede el stock disponible
      if (quantity > stock) {
        setQuantity(Math.max(1, Math.min(stock, quantity)));
      }
      
    } catch (error) {
      console.error('Error fetching variant stock:', error);
      setVariantStock(0);
      setHasSelectedVariant(true);
    } finally {
      setIsLoadingStock(false);
    }
  }, [quantity]);

  useEffect(() => {
    if (selectedColor && selectedSize) {
      fetchVariantStock(data.id, selectedColor, selectedSize);
    } else {
      setVariantStock(0);
      setHasSelectedVariant(false);
    }
  }, [selectedColor, selectedSize, data.id, fetchVariantStock]);

  const handleAddToCart = useCallback(async () => {
    // Validaciones previas
    if (!selectedColor || !selectedSize) {
      ErrorsHandler.showError("Selección incompleta", "Selecciona color y talla");
      return;
    }

    if (variantStock === 0) {
      ErrorsHandler.showError("Sin stock", "Esta variante no está disponible");
      return;
    }

    if (quantity > variantStock) {
      ErrorsHandler.showError("Stock insuficiente", `Solo quedan ${variantStock} unidades`);
      return;
    }

    setIsAddingToCart(true);
    
    try {
      const selectedImageData = images.find(img => img.color_code === selectedColor);

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
        stock: variantStock // ✅ USAR STOCK DE VARIANTE
      };

      await addProductToCart(product);
      ErrorsHandler.showSuccess("Producto añadido al carrito", "Revísalo");
    } catch (error: unknown) {
      ErrorsHandler.showError(error.message, "No se pudo agregar el producto");
    } finally {
      setIsAddingToCart(false);
    }
  }, [data, selectedColor, selectedSize, quantity, variantStock, addProductToCart, images]);

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

  // ✅ ACTUALIZAR LÓGICA DE STOCK
  const isVariantInStock = variantStock > 0;
  const showStockInfo = hasSelectedVariant || (selectedColor && selectedSize);
  const discountPercentage = data.discount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid gap-12 lg:grid-cols-2 mt-10">
          <div className="space-y-6">
            {/* Main Image - SIN CAMBIOS */}
            <div className="relative aspect-square bg-white/60 backdrop-blur-sm rounded-xl shadow-xl overflow-hidden group w-10/12 mx-auto">
              {images.length > 0 && images[selectedImage]?.image_url ? (
                <Image
                  src={images[selectedImage].image_url || "/placeholder.svg"}
                  alt={images[selectedImage].color}
                  fill
                  className="object-fit transition-all duration-400 group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <ShoppingCart className="w-12 h-12" />
                    </div>
                    <p>No hay imagen disponible</p>
                  </div>
                </div>
              )}

              {/* Action Buttons - SIN CAMBIOS */}
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-lg rounded-full w-10 h-10 transition-all duration-200 hover:scale-110"
                >
                  <Heart className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="bg-white/80 backdrop-blur-sm hover:bg-white/90 shadow-lg rounded-full w-10 h-10 transition-all duration-200 hover:scale-110"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Thumbnail Gallery - SIN CAMBIOS */}
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.length > 0 ? (
                images.map((image, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index, image.color_code)}
                    className={`relative flex-shrink-0 aspect-square w-20 h-20 mt-2 ms-2 overflow-hidden rounded-xl transition-all duration-300 hover:scale-105 ${
                      selectedImage === index
                        ? "ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-105"
                        : "hover:ring-2 hover:ring-gray-300 hover:ring-offset-1"
                    }`}
                  >
                    <div className="absolute inset-0 bg-white/60 backdrop-blur-sm" />
                    <Image
                      src={image.image_url || "/placeholder.svg"}
                      alt={`${data.name} thumbnail ${index + 1}`}
                      fill
                      className="object-fit transition-transform duration-200"
                    />
                  </button>
                ))
              ) : (
                <div className="flex gap-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="w-20 h-20 rounded-xl" />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            {/* Header Section - SIN CAMBIOS HASTA PRICE */}
            <div className="space-y-6 animate-in fade-in-50 duration-700">
              {/* Badges and Rating */}
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <Badge className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-blue-700 border border-blue-200/50 px-3 py-1.5 rounded-full font-medium animate-in slide-in-from-left duration-500">
                    <Sparkles className="w-3 h-3 mr-1.5" />
                    Nuevo Producto
                  </Badge>
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-4 h-4 fill-amber-400 text-amber-400 animate-in zoom-in duration-300"
                        style={{ animationDelay: `${i * 100}ms` }}
                      />
                    ))}
                    <span className="text-sm text-gray-500 ml-2 font-medium">
                      (4.8)
                    </span>
                  </div>
                </div>
              </div>

              {/* Product Title */}
              <div className="space-y-3">
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 leading-tight animate-in slide-in-from-bottom duration-700">
                  {data.name}
                </h1>
                <p className="text-gray-600 leading-relaxed text-lg animate-in fade-in duration-700 delay-200">
                  {data.description}
                </p>
              </div>

              {/* Price Section - SIN CAMBIOS */}
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl px-6 py-7 border border-blue-100/50 animate-in slide-in-from-left duration-700 delay-300">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-baseline gap-3">
                      <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                        $
                        {Math.round(
                          data.price - data.price * (discountPercentage / 100)
                        ).toLocaleString()}
                      </span>
                      {discountPercentage > 0 && (
                        <span className="text-xl text-gray-400 line-through font-medium">
                          ${Math.round(data.price).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  {discountPercentage > 0 && (
                    <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 px-4 py-2 text-sm font-semibold rounded-full animate-pulse shadow-lg">
                      -{discountPercentage}% OFF
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            {/* ✅ STOCK STATUS ACTUALIZADO */}
            <div className="bg-white border border-gray-200/60 rounded-xl px-5 py-4 w-fit animate-in fade-in transition-all duration-300">
              <div className="flex items-center gap-3">
                <div
                  className={`w-3 h-3 rounded-full ${
                    !showStockInfo
                      ? "bg-gray-400" 
                      : isVariantInStock 
                        ? "bg-emerald-500" 
                        : "bg-red-500"
                  }`}
                />
                <div className="flex-1">
                  <span
                    className={`font-semibold ${
                      !showStockInfo
                        ? "text-gray-500"
                        : isVariantInStock 
                          ? "text-gray-900" 
                          : "text-red-600"
                    }`}
                  >
                    {isLoadingStock
                      ? "Verificando..."
                      : !selectedColor || !selectedSize
                        ? "Selecciona variante"
                        : isVariantInStock 
                          ? "En Stock" 
                          : "Agotado"
                    }
                  </span>
                  {showStockInfo && isVariantInStock && !isLoadingStock && (
                    <span className="text-gray-500 text-sm ml-2">
                      {variantStock} unidades disponibles
                    </span>
                  )}
                </div>
                {showStockInfo && isVariantInStock && !isLoadingStock && (
                  <Badge
                    variant="outline"
                    className="text-emerald-600 border-emerald-200 bg-emerald-50"
                  >
                    Disponible
                  </Badge>
                )}
              </div>
            </div>

            {/* Size Selection - SIN CAMBIOS */}
            {data?.sizes && (
              <div
                id="size-selection"
                className="space-y-4 animate-in fade-in duration-700 delay-500"
              >
                <div className="flex items-center justify-between">
                  <label className="text-lg font-semibold text-gray-900">
                    Tamaño
                  </label>
                  <span className="text-sm text-gray-500">
                    Selecciona tu talla
                  </span>
                </div>
                <RadioGroup
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                  className="grid grid-cols-6 gap-3"
                >
                  {data.sizes.split(",").map((size, index) => (
                    <label
                      key={size}
                      className={`relative flex cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all duration-200 hover:scale-105 animate-in zoom-in ${
                        selectedSize === size
                          ? "border-blue-500 bg-blue-500 text-white shadow-lg shadow-blue-500/25 scale-105"
                          : "border-gray-200 bg-white text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <RadioGroupItem value={size} className="sr-only" />
                      {size.toUpperCase()}
                    </label>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Color Selection - SIN CAMBIOS */}
            <div className="space-y-4 animate-in fade-in duration-700 delay-600">
              <div className="flex items-center justify-between">
                <label className="text-lg font-semibold text-gray-900">
                  Color
                </label>
                <span className="text-sm text-gray-500">
                  {images.find((img) => img.color_code === selectedColor)
                    ?.color || "Selecciona color"}
                </span>
              </div>
              <div className="flex gap-3">
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
                      className={`relative w-12 h-12 rounded-full transition-all duration-200 hover:scale-110 animate-in zoom-in ${
                        selectedColor === colorCode
                          ? "ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-110"
                          : "ring-2 ring-gray-300 hover:ring-gray-400 shadow-md"
                      }`}
                      style={{
                        backgroundColor: colorCode,
                        animationDelay: `${index * 100}ms`,
                      }}
                    >
                      {selectedColor === colorCode && (
                        <div className="absolute inset-0 rounded-full bg-white/20 flex items-center justify-center">
                          <Check className="w-5 h-5 text-white drop-shadow-sm" />
                        </div>
                      )}
                    </button>
                  ))}
              </div>
            </div>

            {/* ✅ QUANTITY AND ADD TO CART ACTUALIZADO */}
            <div className="space-y-6 animate-in fade-in duration-700 delay-700">
              <div className="flex items-center gap-4">
                <div className="space-y-2">
                  <SetQuantity
                    cartProduct={{ quantity }}
                    handleDecrease={() =>
                      setQuantity((prev) => Math.max(1, prev - 1))
                    }
                    handleIncrease={() =>
                      setQuantity((prev) => Math.min(variantStock, prev + 1)) // ✅ USAR variantStock
                    }
                  />
                </div>

                <div className="flex-1">
                  <Button
                    onClick={handleAddToCart}
                    disabled={
                      !selectedSize || 
                      !selectedColor || 
                      !isVariantInStock || 
                      isAddingToCart ||
                      isLoadingStock ||
                      variantStock === 0
                    } // ✅ CONDICIONES ACTUALIZADAS
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-6 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:hover:shadow-lg"
                    size="lg"
                  >
                    {isLoadingStock ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Verificando stock...
                      </div>
                    ) : isAddingToCart ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Añadiendo al carrito...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <ShoppingCart className="w-5 h-5" />
                        {!selectedColor || !selectedSize
                          ? "Selecciona variante"
                          : variantStock === 0 
                            ? "Sin stock" 
                            : "Añadir al carrito"
                        }
                      </div>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Features Grid - SIN CAMBIOS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-in fade-in delay-800">
              {/* Shipping Info */}
              <div className="bg-gradient-to-br from-emerald-50 to-green-50 rounded-xl p-5 border border-emerald-200/50 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-emerald-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Truck className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      Envío Gratis
                    </p>
                    <p className="text-sm text-gray-600">
                      Compras superiores a $100.000
                    </p>
                  </div>
                </div>
              </div>

              {/* Security Info */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200/50 hover:shadow-md transition-all duration-300 group">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <Shield className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 mb-1">
                      Compra Segura
                    </p>
                    <p className="text-sm text-gray-600">
                      Protección garantizada
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Methods - SIN CAMBIOS */}
            <div className="bg-white rounded-xl p-6 border border-gray-200/60 shadow-sm animate-in fade-in duration-700 delay-900">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-lg flex items-center justify-center">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <p className="font-semibold text-gray-900">
                  Métodos de Pago Seguros
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-3 text-center border border-gray-200/60 hover:border-blue-300 hover:bg-blue-50 transition-all duration-300 animate-in zoom-in"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="text-3xl mb-1">
                      <p className="flex justify-center">{method.icon}</p>
                    </div>
                    <p className="text-xs text-gray-600 font-medium">
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