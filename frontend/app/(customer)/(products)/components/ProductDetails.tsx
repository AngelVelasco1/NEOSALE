"use client";
import { useCallback, useEffect, useState } from "react";
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
  Lock,
  Zap,
  Package,
} from "lucide-react";
import { useCart } from "../../(cart)/hooks/useCart";
import { SetQuantity } from "../../../components/SetQuantity";
import type { IProductDetails, CartProductsInfo } from "../../types";
import {
  RiVisaLine,
  RiMastercardLine,
  RiBankFill,
  RiWallet3Fill,
} from "react-icons/ri";
import { ErrorsHandler } from "@/app/errors/errorsHandler";
import { getProductVariantApi } from "../services/api";
import { ProductReviews } from "./ProductReviews";

export interface ProductDetailsProps {
  data: IProductDetails;
}

const paymentMethods = [
  { icon: <RiVisaLine />, name: "Visa" },
  { icon: <RiMastercardLine />, name: "Mastercard" },
  { icon: <RiBankFill />, name: "PSE" },
  { icon: <RiWallet3Fill />, name: "Nequi" },
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
        image_url: selectedImageData?.image_url || "",
        name: data.name,
        price: data.price,
        quantity: quantity,
        size: selectedSize,
        total: data.price * quantity,
        stock: variantStock,
        description: data.description,
        alt_text: data.name,
        category: data.category,
      };

      addProductToCart(product);
      ErrorsHandler.showSuccess("Producto añadido al carrito", "Revísalo");
    } catch (error) {
      ErrorsHandler.showError(
        (error as Error).message,
        "No se pudo agregar el producto"
      );
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
  // Usar offer_discount si está en oferta, sino usar base_discount
  const discountPercentage = data.in_offer && data.offer_discount 
    ? data.offer_discount 
    : data.base_discount || 0;

  return (
    <div className="min-h-screen">
      {/* Ambient background effects */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-700"></div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">
        <div className="grid gap-8 lg:gap-12 xl:gap-16 lg:grid-cols-[1fr_1fr] max-w-[1600px] mx-auto">
          {/* Image Gallery Section */}
          <div className="flex flex-col space-y-5 px-10">
            {/* Main Image */}
            <div className="relative aspect-square bg-linear-to-br from-slate-900 to-slate-800 rounded-xl shadow-2xl overflow-hidden group border border-white/5 hover:border-white/10 transition-all duration-500">
              {images.length > 0 && images[selectedImage]?.image_url ? (
                <>
                  <Image
                    src={images[selectedImage].image_url || "/placeholder.svg"}
                    alt={images[selectedImage].color || data.name}
                    fill
                    className="object-fit  transition-all duration-700 ease-out group-hover:scale-105 group-hover:rotate-1"
                    priority
                  />
                  {/* Animated gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-tr from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center">
                    <div className="w-24 h-24 bg-slate-800/80 rounded-3xl mx-auto mb-4 flex items-center justify-center backdrop-blur-xl border border-white/5">
                      <ShoppingCart className="w-12 h-12 text-slate-400" />
                    </div>
                    <p className="text-sm font-medium text-slate-300">
                      No hay imagen disponible
                    </p>
                  </div>
                </div>
              )}

              {/* Floating action buttons */}
              <div className="absolute top-5 right-5 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-4 group-hover:translate-x-0">
                <button className="bg-white/10 backdrop-blur-2xl rounded-2xl w-11 h-11 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/10 group/btn"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `rgba(var(--color-accent-rgb), 0.3)`;
                    e.currentTarget.style.borderColor = `rgba(var(--color-accent-rgb), 0.5)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `rgba(255, 255, 255, 0.1)`;
                    e.currentTarget.style.borderColor = `rgba(255, 255, 255, 0.1)`;
                  }}
                >
                  <Heart className="h-4.5 w-4.5 text-white group-hover/btn:fill-white transition-all" />
                </button>
                <button className="bg-white/10 backdrop-blur-2xl rounded-2xl w-11 h-11 flex items-center justify-center transition-all duration-300 hover:scale-110 border border-white/10"
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = `rgba(var(--color-primary-rgb), 0.3)`;
                    e.currentTarget.style.borderColor = `rgba(var(--color-primary-rgb), 0.5)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = `rgba(255, 255, 255, 0.1)`;
                    e.currentTarget.style.borderColor = `rgba(255, 255, 255, 0.1)`;
                  }}
                >
                  <Share2 className="h-4.5 w-4.5 text-white" />
                </button>
              </div>

              {/* Discount badge */}
              {discountPercentage > 0 && (
                <div className="absolute top-5 left-5 animate-bounce-slow">
                  <div className={`${data.in_offer && data.offer_discount
                      ? 'bg-linear-to-r from-orange-500 to-red-600 shadow-orange-500/50'
                      : 'bg-linear-to-r from-rose-500 to-pink-500 shadow-rose-500/50'
                    } text-white px-4 py-2 rounded-full text-sm font-bold shadow-2xl backdrop-blur-xl border border-white/20 hover:scale-110 transition-transform duration-300`}>
                   -
                    {discountPercentage}% OFF
                    {data.in_offer && data.offer_discount && (
                      <span className="ml-1 text-xs font-normal">OFERTA</span>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Thumbnails */}
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide px-1 ">
              {images.length > 0 ? (
                images.map((image, index: number) => (
                  <button
                    key={index}
                    onClick={() => handleImageChange(index, image.color_code)}
                    className={`relative flex-shrink-0 aspect-square w-20 h-20 ml-2 mt-2 overflow-hidden rounded-2xl transition-all duration-300 ${selectedImage === index
                      ? "ring-offset-2 ring-offset-slate-950 scale-105 shadow-xl "
                      : "opacity-60 hover:opacity-100 border border-white/5 hover:border-white/20 hover:scale-105"
                      }`}
                    style={selectedImage === index ? {
                      ringColor: `var(--color-primary)`,
                      boxShadow: `0 0 0 2px var(--color-primary)`
                    } : {}}
                  >
                    <Image
                      src={image.image_url || "/placeholder.svg"}
                      alt={`${data.name} thumbnail ${index + 1}`}
                      fill
                      className="object-fit"
                    />
                    {selectedImage === index && (
                      <div className="absolute inset-0 rounded-2xl" style={{backgroundColor: `rgba(var(--color-primary-rgb), 0.1)`}}></div>
                    )}
                  </button>
                ))
              ) : (
                <div className="flex gap-3">
                  {[...Array(4)].map((_, i) => (
                    <Skeleton
                      key={i}
                      className="w-20 h-20 rounded-2xl bg-slate-800/50"
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Trust badges - Modern minimal style */}
            <div className="grid grid-cols-3 gap-3 mt-2">
              <div className="bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl p-4 border border-white/5 text-center group hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/20 transition-all duration-300 hover:-translate-y-1">
                <div className="relative">
                  <Truck className="w-5 h-5 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-emerald-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <p className="text-xs font-semibold text-slate-300 group-hover:text-emerald-300 transition-colors">
                  Envío Gratis
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">+$100k</p>
              </div>
              <div className="bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl p-4 border border-white/5 text-center group hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/20 transition-all duration-300 hover:-translate-y-1">
                <div className="relative">
                  <Shield className="w-5 h-5 text-blue-400 mx-auto mb-2 group-hover:scale-110 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-blue-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <p className="text-xs font-semibold text-slate-300 group-hover:text-blue-300 transition-colors">
                  Compra Segura
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">Protegida</p>
              </div>
              <div className="bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-2xl p-4 border border-white/5 text-center group hover:border-purple-500/50 hover:shadow-lg hover:shadow-purple-500/20 transition-all duration-300 hover:-translate-y-1">
                <div className="relative">
                  <Package className="w-5 h-5 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform relative z-10" />
                  <div className="absolute inset-0 bg-purple-400/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <p className="text-xs font-semibold text-slate-300 group-hover:text-purple-300 transition-colors">
                  Devolución
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">30 días</p>
              </div>
            </div>
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col space-y-6 lg:pt-2">
            {/* Header */}
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-4">
                <Badge className="bg-linear-to-r from-blue-500/20 to-purple-500/20 text-blue-300 border border-blue-500/30 px-4 py-1.5 rounded-full font-semibold backdrop-blur-xl hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 cursor-default">
                  <Sparkles className="w-3.5 h-3.5 mr-1.5 animate-pulse" />
                  Nuevo
                </Badge>
                <div className="flex items-center gap-2 bg-slate-900/90 backdrop-blur-xl px-3 py-1.5 rounded-full border border-white/10 hover:border-amber-500/40 hover:shadow-lg hover:shadow-amber-500/30 transition-all duration-300 cursor-default group">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="w-3.5 h-3.5 fill-amber-400 text-amber-400 group-hover:scale-110 transition-transform"
                        style={{ transitionDelay: `${i * 50}ms` }}
                      />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-slate-200 ml-1 group-hover:text-amber-300 transition-colors">
                    4.8
                  </span>
                </div>
              </div>

              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-bold bg-linear-to-r from-white via-slate-100 to-white bg-clip-text text-transparent leading-tight tracking-tight hover:from-blue-400 hover:via-purple-400 hover:to-pink-400 transition-all duration-500">
                {data.name}
              </h1>

              <p className="text-slate-300 leading-relaxed text-base lg:text-lg">
                {data.description}
              </p>
            </div>

            {/* Price Section - Prominent and clean */}
            <div className="relative bg-linear-to-r from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 overflow-hidden group">
              <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-baseline gap-3">
                <span className="text-5xl lg:text-6xl font-black bg-linear-to-r from-white via-slate-100 to-white bg-clip-text text-transparent tracking-tight group-hover:scale-105 group-hover:from-yellow-300 group-hover:via-orange-300 group-hover:to-red-300 transition-all duration-300 inline-block">
                  $
                  {Math.round(
                    data.price - data.price * (discountPercentage / 100)
                  ).toLocaleString()}
                </span>
                {discountPercentage > 0 && (
                  <span className="text-2xl text-slate-400 line-through font-semibold group-hover:text-slate-500 transition-colors">
                    ${Math.round(data.price).toLocaleString()}
                  </span>
                )}
              </div>
            </div>

            {/* Stock Status - Minimalist */}
            <div className="bg-slate-900/60 backdrop-blur-xl rounded-2xl px-5 py-3.5 border border-white/10 w-fit">
              <div className="flex items-center gap-3">
                <div
                  className={`w-2.5 h-2.5 rounded-full ${!showStockInfo
                    ? "bg-blue-400 animate-pulse"
                    : isVariantInStock
                      ? "bg-emerald-400 animate-pulse"
                      : "bg-rose-400"
                    }`}
                />
                <div>
                  <span
                    className={`font-semibold text-sm ${!showStockInfo
                      ? "text-slate-300"
                      : isVariantInStock
                        ? "text-emerald-400"
                        : "text-rose-400"
                      }`}
                  >
                    {isLoadingStock
                      ? "Verificando..."
                      : !selectedColor || !selectedSize
                        ? "Selecciona variante"
                        : isVariantInStock
                          ? "En stock"
                          : "Agotado"}
                  </span>
                  {showStockInfo && isVariantInStock && !isLoadingStock && (
                    <span className="text-slate-300 text-xs block font-medium">
                      {variantStock} unidades
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Size Selection - Modern grid */}
            {data?.sizes && (
              <div className="space-y-3.5">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-bold text-white uppercase tracking-wide">
                    Tamaño
                  </label>
                  {selectedSize && (
                    <span className="text-xs text-slate-200 font-medium">
                      Talla {selectedSize}
                    </span>
                  )}
                </div>
                <RadioGroup
                  value={selectedSize}
                  onValueChange={setSelectedSize}
                  className="grid grid-cols-5 sm:grid-cols-7 gap-2.5"
                >
                  {data.sizes.split(",").map((size) => (
                    <label
                      key={size}
                      className={`relative flex cursor-pointer items-center justify-center rounded-xl border p-3.5 text-sm font-bold transition-all duration-200 hover:scale-105 ${selectedSize === size
                        ? "border-white bg-white text-slate-900 shadow-lg shadow-white/20"
                        : "border-white/10 bg-slate-900/50 text-slate-300 hover:border-white/30 hover:bg-slate-800/50"
                        }`}
                    >
                      <RadioGroupItem value={size} className="sr-only" />
                      {size.toUpperCase()}
                      {selectedSize === size && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center animate-bounce">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </label>
                  ))}
                </RadioGroup>
              </div>
            )}

            {/* Color Selection - Clean and visual */}
            <div className="space-y-3.5">
              <div className="flex items-center justify-between">
                <label className="text-sm font-bold text-white uppercase tracking-wide">
                  Color
                </label>
                {selectedColor && (
                  <span className="text-xs text-slate-200 font-medium">
                    {
                      images.find((img) => img.color_code === selectedColor)
                        ?.color
                    }
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-3">
                {images
                  .map((img) => img.color_code)
                  .filter(
                    (value: string, index: number, self: Array<string>) =>
                      value && self.indexOf(value) === index
                  )
                  .map((colorCode: string) => (
                    <button
                      key={colorCode}
                      onClick={() => handleImageChange(0, colorCode)}
                      className={`relative w-12 h-12 rounded-full transition-all duration-200 border-2 hover:scale-110 ${selectedColor === colorCode
                        ? "ring-2 ring-white ring-offset-2 ring-offset-slate-950 scale-110 border-white"
                        : "border-white/20 hover:border-white/40"
                        }`}
                      style={{ backgroundColor: colorCode }}
                    >
                      {selectedColor === colorCode && (
                        <div className="absolute inset-0 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center animate-pulse">
                          <Check className="w-5 h-5 text-white drop-shadow-lg" />
                        </div>
                      )}
                      <div className="absolute inset-0 rounded-full border-2 border-white/0 hover:border-white/20 transition-all"></div>
                    </button>
                  ))}
              </div>
            </div>

            {/* Add to Cart Section - Bold CTA */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center gap-3">
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
                  className="relative flex-1 py-7 text-base font-bold rounded-2xl transition-all duration-300 hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100 disabled:shadow-none min-h-[3.5rem] border-0 active:scale-95 overflow-hidden group"
                  style={{
                    backgroundImage: `linear-gradient(to right, var(--color-accent), var(--color-primary))`,
                    color: 'white',
                    boxShadow: `0 25px 50px -12px rgba(var(--color-accent-rgb), 0.25)`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb), 0.35)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = `0 25px 50px -12px rgba(var(--color-accent-rgb), 0.25)`;
                  }}
                  size="lg"
                >
                  <div className="absolute inset-0 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" style={{backgroundImage: `linear-gradient(to right, rgba(var(--color-accent-rgb), 0.3), rgba(var(--color-primary-rgb), 0.3), rgba(var(--color-accent-rgb), 0.3))`}}></div>
                  {isLoadingStock ? (
                    <div className="flex items-center gap-2.5 relative z-10">
                      <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                      <span>Verificando...</span>
                    </div>
                  ) : isAddingToCart ? (
                    <div className="flex items-center gap-2.5 relative z-10">
                      <div className="w-4 h-4 border-2 border-slate-900/30 border-t-slate-900 rounded-full animate-spin" />
                      <span>Añadiendo...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2.5 relative z-10">
                      <ShoppingCart className="w-4.5 h-4.5 group-hover:rotate-12 transition-transform duration-300" />
                      <span>
                        {!selectedColor || !selectedSize
                          ? "Selecciona variante"
                          : variantStock === 0
                            ? "Sin stock"
                            : "Añadir al carrito"}
                      </span>
                      <Zap className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                </Button>
              </div>
            </div>

            {/* Payment Methods - Sleek card */}
            <div className="bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl rounded-3xl p-6 border border-white/10 mt-auto">
              <div className="flex items-center gap-3 mb-5">
                <Lock className="w-4.5 h-4.5 text-slate-300" />
                <p className="font-semibold text-slate-200 text-sm">
                  Métodos de pago seguros
                </p>
              </div>

              <div className="grid grid-cols-4 gap-3">
                {paymentMethods.map((method, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/60 rounded-xl p-3 text-center border border-white/10 hover:border-white/20 transition-all duration-200 hover:bg-slate-800/60"
                  >
                    <div className="text-2xl text-slate-300 mb-1.5">
                      <div className="flex justify-center">{method.icon}</div>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">
                      {method.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Reseñas */}
      <ProductReviews productId={data.id} />
    </div>
  );
};


