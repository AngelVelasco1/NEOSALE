"use client"

import React, { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Truck, Shield, Star, Check, Heart, Share2, Sparkles } from "lucide-react"
import { useCart } from "../../(cart)/hooks/useCart";
import { SetQuantity } from "../../../components/SetQuantity";
import type { IProductDetails, CartProductsInfo } from "../types";

export interface ProductDetailsProps {
  data: IProductDetails
}

// Mock payment methods
const paymentMethods = [
  { icon: "💳", name: "Visa" },
  { icon: "💳", name: "Mastercard" },
  { icon: "🏦", name: "PSE" },
  { icon: "📱", name: "Nequi" },
]

// Simple PaymentIcon component
const PaymentIcon = ({ icon }: { icon: string }) => (
  <div className="text-2xl p-3 bg-white/80 backdrop-blur-sm rounded-xl shadow-sm border border-white/20 transition-all duration-300 hover:scale-105 hover:shadow-md">
    {icon}
  </div>
)

export const ProductDetails = ({ data }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const { addProductToCart } = useCart()

  const images = Array.isArray(data.images) ? data.images : []

  const handleAddToCart = useCallback(async () => {
    if (!selectedSize) {
      // Animate size selection to draw attention
      const sizeSection = document.getElementById("size-selection")
      if (sizeSection) {
        sizeSection.classList.add("animate-pulse")
        setTimeout(() => sizeSection.classList.remove("animate-pulse"), 1000)
      }
      return
    }

    setIsAddingToCart(true)

    const product: CartProductsInfo = {
      id: data.id,
      color: selectedColor,
      colorCode: data.images[selectedImage]?.color_code || "",
      colorName: data.images[selectedImage]?.color || "",
      imageUrl: data.images[selectedImage]?.image_url || "",
      name: data.name,
      price: data.price,
      quantity: quantity,
      size: selectedSize,
      total: data.price * quantity,
    }

    // Simulate API call delay for better UX
    await new Promise((resolve) => setTimeout(resolve, 800))

    addProductToCart(product)
    setIsAddingToCart(false)
    setShowSuccess(true)

    // Hide success message after 3 seconds
    setTimeout(() => setShowSuccess(false), 3000)
  }, [data, selectedImage, selectedColor, selectedSize, quantity, addProductToCart])

  const handleImageChange = (index: number, color: string) => {
    if (color === selectedColor) {
      setSelectedImage(index)
    } else {
      setSelectedColor(color)
      const firstImageIndex = data.images.findIndex((img) => img.color_code === color)
      setSelectedImage(firstImageIndex !== -1 ? firstImageIndex : 0)
    }
  }

  useEffect(() => {
    if (images.length > 0) {
      setSelectedColor(images[0].color_code || "")
    }
  }, [images])

  const isInStock = data.stock > 0
  const discountPercentage = data.discount;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-gray-50/30 to-white">
      <div className="container mx-auto px-4 py-8">
        {/* Success Message */}
        {showSuccess && (
          <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-500">
            <div className="bg-green-500 text-white px-6 py-3 rounded-2xl shadow-xl flex items-center gap-2">
              <Check className="w-5 h-5" />
              ¡Producto añadido al carrito!
            </div>
          </div>
        )}

        <div className="grid gap-12 lg:grid-cols-2">
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative aspect-square bg-white/60 backdrop-blur-sm rounded-2xl shadow-lg overflow-hidden group w-10/12 mx-auto">
          

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

              {/* Action Buttons */}
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

            {/* Thumbnail Gallery */}
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
                      className="object-contain p-2 transition-transform duration-200"
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
          <div className="space-y-8">
            {/* Header */}
            <div className="space-y-4 animate-in fade-in-50 duration-700">
              <div className="flex items-center gap-2 mb-2">
                <Badge className="bg-blue-100 text-blue-700 border-0 animate-in slide-in-from-left duration-500">
                  <Sparkles className="w-3 h-3 mr-1" />
                  Nuevo
                </Badge>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-yellow-400 text-yellow-400 animate-in zoom-in duration-300"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  ))}
                  <span className="text-sm text-gray-600 ml-1">(4.8)</span>
                </div>
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-800 via-blue-600 to-purple-600 bg-clip-text text-transparent leading-tight animate-in slide-in-from-bottom duration-700">
                {data.name}
              </h1>

              <p className="text-lg text-gray-600 leading-relaxed animate-in fade-in duration-700 delay-200">
                {data.description}
              </p>

              {/* Price */}
              <div className="flex items-center gap-4 animate-in slide-in-from-left duration-700 delay-300">
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    ${Math.round(data.price - (data.price  * ((discountPercentage / 100)))).toLocaleString()}
                  </span>
                  <span className="text-xl text-gray-400 line-through">
                    ${Math.round(data.price).toLocaleString()}
                  </span>
                </div>
                <Badge className="bg-red-100 text-red-700 border-0 px-3 py-1 animate-bounce">
                  Ahorra {discountPercentage}%
                </Badge>
              </div>
            </div>

            {/* Stock Status */}
            <div className="bg-green-100 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-sm animate-in fade-in delay-400 hover:shadow-md transition-shadow duration-300 w-fit items-center">
              <div className="flex items-center justify-between">
                <span className={`font-semibold ${isInStock ? "text-green-700" : "text-red-600"}`}>
                  {isInStock ? (
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 animate-pulse" />
                      En stock ({data.stock} disponibles)
                    </div>
                  ) : (
                    "Agotado"
                  )}
                </span>
              </div>
              
            </div>

            {/* Size Selection */}
            {data?.sizes && (
              <div id="size-selection" className="space-y-4 animate-in fade-in duration-700 delay-500 ">
                <label className="text-lg font-semibold text-gray-800">Tamaño:</label>
                <RadioGroup value={selectedSize} onValueChange={setSelectedSize} className="flex flex-wrap gap-3 mt-1">
                  {data.sizes.split(",").map((size, index) => (
                    <label
                      key={size}
                      className={`flex cursor-pointer items-center justify-center rounded-xl border-2 px-4 py-3 text-sm font-medium transition-all duration-200 hover:scale-105 animate-in zoom-in ${
                        selectedSize === size
                          ? "border-blue-500 bg-blue-500 text-white shadow-lg scale-105"
                          : "border-gray-200 bg-white/60 backdrop-blur-sm text-gray-700 hover:border-gray-300"
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                    >
                      <RadioGroupItem value={size} className="sr-only" />
                      {size.charAt(0).toUpperCase() + size.slice(1)}
                    </label>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Color Selection */}
            <div className="space-y-4 animate-in fade-in duration-700 delay-600">
              <label className="text-lg font-semibold text-gray-800">Color:</label>
              <div className="flex gap-3 mt-1">
                {images
                  .map((img) => img.color_code)
                  .filter((value: string, index: number, self: Array<string>) => value && self.indexOf(value) === index)
                  .map((colorCode: string, index) => (
                    <button
                      key={colorCode}
                      onClick={() => handleImageChange(0, colorCode)}
                      className={`w-10 h-10 rounded-full transition-all duration-200 hover:scale-110 animate-in zoom-in ${
                        selectedColor === colorCode
                          ? "ring-2 ring-blue-500 ring-offset-2 shadow-lg scale-110"
                          : "ring-2 ring-gray-300 hover:ring-gray-400"
                      }`}
                      style={{
                        backgroundColor: colorCode,
                        animationDelay: `${index * 100}ms`,
                      }}
                    />
                  ))}
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="space-y-6 animate-in fade-in duration-700 delay-700">
              <div className="flex items-center gap-6">
                <div className="space-y-2">
                  <SetQuantity
                    cartProduct={{ quantity }}
                    handleDecrease={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    handleIncrease={() => setQuantity((prev) => Math.min(data.stock, prev + 1))}
                  />
                </div>

                <div className="flex-1">
                  <Button
                    onClick={handleAddToCart}
                    disabled={!isInStock || !selectedSize || isAddingToCart}
                    className="w-full bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-6 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                    size="lg"
                  >
                    {isAddingToCart ? (
                      <div className="flex items-center gap-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-xl animate-spin" />
                        Añadiendo...
                      </div>
                    ) : (
                      <>
                        <ShoppingCart className="w-5 h-5 mr-2" />
                        Añadir al carrito
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>

            {/* Shipping Info */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm animate-in fade-in duration-700 delay-800 hover:shadow-md transition-all duration-300 hover:scale-105">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-500/10 rounded-full flex items-center justify-center">
                  <Truck className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="font-semibold text-gray-800">Envío gratis</p>
                  <p className="text-sm text-gray-600">Por compras superiores a $100.000</p>
                </div>
              </div>
            </div>

            {/* Payment Methods */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 shadow-sm animate-in fade-in duration-700 delay-900 hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-500/10 rounded-full flex items-center justify-center">
                  <Shield className="w-5 h-5 text-blue-500" />
                </div>
                <p className="font-semibold text-gray-800">Seguridad Garantizada</p>
              </div>

              <div className="flex flex-wrap items-center gap-4">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="animate-in zoom-in duration-300"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <PaymentIcon icon={method.icon} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>


    </div>
  )
}
