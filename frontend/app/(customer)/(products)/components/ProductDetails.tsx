"use client"
import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { ShoppingCart, Truck, Shield, Star, Check, Heart, Share2, Sparkles } from "lucide-react"
import { useCart } from "../../(cart)/hooks/useCart"
import { SetQuantity } from "../../../components/SetQuantity"
import type { IProductDetails, CartProductsInfo } from "../../types"
import { RiVisaLine, RiMastercardFill, RiPaypalFill, RiCashLine } from "react-icons/ri"
import { ErrorsHandler } from "@/app/errors/errorsHandler"
import { getProductVariantApi } from "../services/api"

export interface ProductDetailsProps {
  data: IProductDetails
}

const paymentMethods = [
  { icon: <RiVisaLine />, name: "Visa" },
  { icon: <RiMastercardFill />, name: "Mastercard" },
  { icon: <RiPaypalFill />, name: "PayPal" },
  { icon: <RiCashLine />, name: "Efectivo" },
]

export const ProductDetails = ({ data }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)
  const [selectedColor, setSelectedColor] = useState("")
  const [selectedSize, setSelectedSize] = useState("")
  const [isAddingToCart, setIsAddingToCart] = useState(false)
  const [variantStock, setVariantStock] = useState<number>(0)
  const [isLoadingStock, setIsLoadingStock] = useState(false)
  const [isSelectedVariant, setIsSelectedVariant] = useState(false)
  const { addProductToCart } = useCart()

  const images = Array.isArray(data.images) ? data.images : []

  const fetchVariantStock = useCallback(
    async (id: number, color_code: string, size: string) => {
      if (!color_code || !size) {
        setVariantStock(0)
        setIsSelectedVariant(false)
        return
      }

      try {
        setIsLoadingStock(true)
        const variant = await getProductVariantApi({
          id,
          color_code,
          size,
        })
        const variantStock = variant.stock || 0

        setVariantStock(variantStock)
        setIsSelectedVariant(true)

        if (quantity > variantStock) {
          setQuantity(Math.max(1, Math.min(variantStock, quantity)))
        }
        setIsLoadingStock(false)
      } catch (error) {
        console.error("Error fetching variant stock:", error)
        setVariantStock(0)
        setIsSelectedVariant(false)
        setIsLoadingStock(false)
      }
    },
    [quantity],
  )

  useEffect(() => {
    if (selectedColor && selectedSize) {
      fetchVariantStock(data.id, selectedColor, selectedSize)
    } else {
      setVariantStock(0)
      setIsSelectedVariant(false)
    }
  }, [selectedColor, selectedSize, data.id, fetchVariantStock])

  const handleAddToCart = useCallback(async () => {
    if (variantStock === 0) {
      ErrorsHandler.showError("Sin stock", "Esta variante no está disponible")
      return
    }
    if (quantity > variantStock) {
      ErrorsHandler.showError("Stock insuficiente", `Solo quedan ${variantStock} unidades`)
      return
    }

    setIsAddingToCart(true)

    try {
      const selectedImageData = images.find((img) => img.color_code === selectedColor)
      const product: CartProductsInfo = {
        id: data.id,
        color: selectedImageData?.color || "",
        color_code: selectedColor,
        imageUrl: selectedImageData?.image_url || "",
        name: data.name,
        price: data.price,
        quantity: quantity,
        size: selectedSize,
        subt: data.price * quantity,
        stock: variantStock,
      }

      addProductToCart(product)
      ErrorsHandler.showSuccess("Producto añadido al carrito", "Revísalo")
    } catch (error) {
      ErrorsHandler.showError(error.message, "No se pudo agregar el producto")
    } finally {
      setIsAddingToCart(false)
    }
  }, [data, selectedColor, selectedSize, quantity, variantStock, addProductToCart, images])

  const handleImageChange = (index: number, color: string) => {
    setSelectedColor(color)

    const colorImageIndex = data.images.findIndex((img) => img.color_code === color)
    setSelectedImage(colorImageIndex !== -1 ? colorImageIndex : index)
  }

  useEffect(() => {
    if (images.length > 0) {
      setSelectedColor(images[0].color_code || "")
    }
  }, [images])

  const isVariantInStock = variantStock > 0
  const showStockInfo = isSelectedVariant || (selectedColor && selectedSize)
  const discountPercentage = data.base_discount

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 max-w-7xl mx-auto">
          <div className="flex flex-col space-y-6">
            <div className="relative aspect-square bg-slate-800/50 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden group transition-all duration-500 hover:shadow-blue-500/20 border border-slate-700/50">
              {images.length > 0 && images[selectedImage]?.image_url ? (
                <Image
                  src={images[selectedImage].image_url || "/placeholder.svg"}
                  alt={images[selectedImage].color || data.name}
                  fill
                  className="object-cover transition-all duration-700 ease-out group-hover:scale-105"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-slate-700/50 rounded-full mx-auto mb-4 flex items-center justify-center">
                      <ShoppingCart className="w-12 h-12 text-slate-500" />
                    </div>
                    <p className="text-sm font-medium text-slate-300">No hay imagen disponible</p>
                  </div>
                </div>
              )}

              <div className="absolute top-6 right-6 flex gap-3 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
                <button className="bg-slate-800/90 backdrop-blur-md hover:bg-slate-700 shadow-xl rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-slate-600/50">
                  <Heart className="h-5 w-5 text-slate-300 hover:text-pink-400 transition-colors" />
                </button>
                <button className="bg-slate-800/90 backdrop-blur-md hover:bg-slate-700 shadow-xl rounded-full w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-slate-600/50">
                  <Share2 className="h-5 w-5 text-slate-300 hover:text-blue-400 transition-colors" />
                </button>
              </div>
            </div>

            <div className="flex gap-4 px-2 overflow-x-auto pb-2 scrollbar-hide">
              {images.length > 0 ? (
                images.map((image, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index, image.color_code)}
                    className={`relative flex-shrink-0 aspect-square w-20 h-20 overflow-hidden rounded-2xl transition-all duration-500 hover:scale-105 cursor-pointer ${selectedImage === index
                        ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-slate-900 shadow-lg shadow-blue-500/50 scale-110"
                        : "border-2 border-slate-700/50 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20"
                      }`}
                  >
                    <Image
                      src={image.image_url || "/placeholder.svg"}
                      alt={`${data.name} thumbnail ${index + 1}`}
                      fill
                      className="object-cover transition-all duration-300"
                    />
                    {selectedImage === index && <div className="absolute inset-0 bg-blue-500/20 rounded-2xl" />}
                  </button>
                ))
              ) : (
                <div className="flex gap-4 px-2">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton key={i} className="w-20 h-20 rounded-2xl bg-slate-800/50" />
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="group bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-2xl p-6 border border-slate-700/50 hover:border-emerald-500/50 hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-500 hover:scale-105">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg shadow-emerald-500/30">
                    <Truck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-100 mb-1 text-base">Envío Gratis</p>
                    <p className="text-sm text-slate-400 leading-relaxed">Compras superiores a $100.000</p>
                  </div>
                </div>
              </div>

              <div className="group bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-2xl p-6 border border-slate-700/50 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-500/10 transition-all duration-500 hover:scale-105">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-all duration-300 shadow-lg shadow-blue-500/30">
                    <Shield className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-100 mb-1 text-base">Compra Segura</p>
                    <p className="text-sm text-slate-400 leading-relaxed">Protección garantizada</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col space-y-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 px-5 py-2 rounded-full font-semibold shadow-lg backdrop-blur-sm hover:shadow-blue-500/20 transition-all duration-300">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Nuevo Producto
                </Badge>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-5 h-5 fill-amber-400 text-amber-400 transition-all duration-300 hover:scale-125"
                      />
                    ))}
                  </div>
                  <span className="text-sm text-slate-300 font-semibold ml-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
                    4.8 ⭐
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h1 className="text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent leading-tight">
                  {data.name}
                </h1>
                <p className="text-slate-300 leading-relaxed text-lg">{data.description}</p>
              </div>

              <div className="bg-gradient-to-r from-slate-800/90 to-slate-800/60 rounded-3xl px-8 py-6 border border-slate-700/50 backdrop-blur-xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500">
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div className="flex items-baseline gap-4">
                    <span className="text-5xl lg:text-6xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      ${Math.round(data.price - data.price * (discountPercentage / 100)).toLocaleString()}
                    </span>
                    {discountPercentage > 0 && (
                      <span className="text-2xl text-slate-500 line-through font-bold">
                        ${Math.round(data.price).toLocaleString()}
                      </span>
                    )}
                  </div>
                  {discountPercentage > 0 && (
                    <Badge className="bg-gradient-to-r from-pink-500 to-pink-600 text-white border-0 px-5 py-2 text-base font-bold rounded-full shadow-lg shadow-pink-500/30">
                      -{discountPercentage}% OFF
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 backdrop-blur-xl rounded-2xl px-6 py-4 w-fit shadow-lg">
              <div className="flex items-center gap-4">
                <div
                  className={`w-3 h-3 rounded-full transition-all duration-500 shadow-lg ${!showStockInfo
                      ? "bg-blue-400 animate-pulse shadow-blue-400/50"
                      : isVariantInStock
                        ? "bg-emerald-400 animate-pulse shadow-emerald-400/50"
                        : "bg-red-400 shadow-red-400/50"
                    }`}
                />
                <div>
                  <span
                    className={`font-bold text-base transition-colors duration-300 ${!showStockInfo ? "text-slate-300" : isVariantInStock ? "text-emerald-400" : "text-red-400"
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
                    <span className="text-slate-400 text-sm block font-medium">
                      {variantStock} unidades disponibles
                    </span>
                  )}
                </div>
              </div>
            </div>

            {data?.sizes && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-lg font-bold text-slate-100">📏 Tamaño</label>
                  <span className="text-sm text-slate-400 font-semibold bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
                    {selectedSize ? `Talla ${selectedSize}` : "Selecciona tu talla"}
                  </span>
                </div>
                <RadioGroup
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                  className="grid grid-cols-4 sm:grid-cols-6 gap-3"
                >
                  {data.sizes.split(",").map((size) => (
                    <label
                      key={size}
                      className={`relative flex cursor-pointer items-center justify-center rounded-xl border-2 p-4 text-sm font-bold transition-all duration-300 hover:scale-105 ${selectedSize === size
                          ? "border-blue-500 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-lg shadow-blue-500/50"
                          : "border-slate-700 bg-slate-800/50 text-slate-300 hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20"
                        }`}
                    >
                      <RadioGroupItem value={size} className="sr-only" />
                      {size.toUpperCase()}
                      {selectedSize === size && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <Check className="w-3 h-3 text-blue-600" />
                        </div>
                      )}
                    </label>
                  ))}
                </RadioGroup>
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <label className="text-lg font-bold text-slate-100">🎨 Color</label>
                <span className="text-sm text-slate-400 font-semibold bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700/50">
                  {images.find((img) => img.color_code === selectedColor)?.color || "Selecciona color"}
                </span>
              </div>
              <div className="flex flex-wrap gap-4">
                {images
                  .map((img) => img.color_code)
                  .filter((value: string, index: number, self: Array<string>) => value && self.indexOf(value) === index)
                  .map((colorCode: string) => (
                    <button
                      key={colorCode}
                      onClick={() => handleImageChange(0, colorCode)}
                      className={`relative w-14 h-14 rounded-full transition-all duration-400 hover:scale-110 border-4 shadow-lg ${selectedColor === colorCode
                          ? "ring-4 ring-blue-500 ring-offset-4 ring-offset-slate-900 shadow-2xl scale-110 border-slate-700"
                          : "border-slate-700 hover:border-slate-600 hover:shadow-xl"
                        }`}
                      style={{
                        backgroundColor: colorCode,
                        boxShadow:
                          selectedColor === colorCode
                            ? `0 10px 25px -5px ${colorCode}60, 0 0 0 4px #3b82f6`
                            : `0 4px 12px -2px ${colorCode}40`,
                      }}
                    >
                      {selectedColor === colorCode && (
                        <div className="absolute inset-0 rounded-full bg-white/30 flex items-center justify-center backdrop-blur-sm">
                          <Check className="w-6 h-6 text-white drop-shadow-lg" />
                        </div>
                      )}
                    </button>
                  ))}
              </div>
            </div>

            <div className="space-y-6 pt-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <SetQuantity
                    cartProduct={{ quantity }}
                    handleDecrease={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    handleIncrease={() => setQuantity((prev) => Math.min(variantStock || 99, prev + 1))}
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
                  className="flex-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white py-7 text-lg font-bold rounded-xl shadow-2xl shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-500 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none min-h-[3.5rem] border-0"
                  size="lg"
                >
                  {isLoadingStock ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verificando...</span>
                    </div>
                  ) : isAddingToCart ? (
                    <div className="flex items-center gap-3">
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Añadiendo...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <ShoppingCart className="w-5 h-5" />
                      <span>
                        {!selectedColor || !selectedSize
                          ? "Selecciona variante"
                          : variantStock === 0
                            ? "Sin stock"
                            : "Añadir al carrito"}
                      </span>
                    </div>
                  )}
                </Button>
              </div>
            </div>

            <div className="bg-gradient-to-br from-slate-800/80 to-slate-800/40 rounded-3xl p-6 border border-slate-700/50 shadow-2xl backdrop-blur-xl mt-auto hover:shadow-blue-500/10 transition-all duration-500">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Shield className="w-5 h-5 text-white" />
                </div>
                <p className="font-bold text-slate-100 text-base">Métodos de Pago Seguros</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="group bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50 hover:border-blue-500/50 hover:bg-slate-700/50 transition-all duration-400 hover:scale-105 hover:shadow-lg hover:shadow-blue-500/20"
                  >
                    <div className="text-3xl mb-2 text-slate-400 group-hover:text-blue-400 transition-all duration-300">
                      <div className="flex justify-center">{method.icon}</div>
                    </div>
                    <p className="text-xs text-slate-400 font-semibold group-hover:text-slate-300 transition-colors duration-300">
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
  )
}
