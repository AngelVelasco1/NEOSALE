"use client";

import React, { useCallback, useEffect } from "react";
import Image from "next/image";
import { Button } from "../../../../components/ui/button";
import { RadioGroup, RadioGroupItem } from "../../../../components/ui/radio-group";
import { useState } from "react";
import { useCart } from "../../(cart)/hooks/useCart";
import { PaymentIcon, paymentMethods } from "../../../components/PaymentIcon";
import { SetQuantity } from "../../../components/SetQuantity";
import { IProductDetails } from "../types";
import { Skeleton } from "@/components/ui/skeleton";

export interface ProductDetailsProps {
  data: IProductDetails;
}

export const ProductDetails = ({ data }: ProductDetailsProps) => {
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");
  const { addProductToCart } = useCart();
  const images = Array.isArray(data.images) ? data.images : [];

  const handleAddToCart = useCallback(() => {
    const product = {
      id: data.id,
      color: selectedColor,
      colorCode: data.images[selectedImage].colorcode,
      colorName: data.images[selectedImage].color,
      imageUrl: data.images[selectedImage].imageurl,
      name: data.name,
      price: data.price,
      quantity: quantity,
      size: selectedSize,
      total: data.price * quantity,
    };
    addProductToCart(product);
  }, [data, selectedImage, selectedColor, selectedSize, quantity]);

  const handleImageChange = (index: number, color: string) => {
    if (color === selectedColor) {
      setSelectedImage(index);
    } else {
      setSelectedColor(color);
      const firstImageIndex = data.images.findIndex(
        (img) => img.colorcode === color
      );
      setSelectedImage(firstImageIndex !== -1 ? firstImageIndex : 0);
    }
  };

  useEffect(() => {
  if (images.length > 0) {
    setSelectedColor(images[0].colorcode || "");
  }
}, [images]);

  return (
    <div className="grid gap-10 md:grid-cols-2 space-y-4 p-4">
      <div className="flex flex-row-reverse">
        <div className="flex-1 relative aspect-square  rounded-lg bg-gray-100">
          {
          images.length > 0 && images[selectedImage]?.imageurl ? (  
            <Image
              src={images[selectedImage].imageurl}
              alt={images[selectedImage].color}
              width={460}
              height={460}
              className="object-contain p-8 z-40"
              priority
            />
          ) : (
            <Skeleton />
          )
        }
          
          
        </div>
        <div className="grid grid-cols-1 w-1/5 h-fit gap-5 m-auto">
          {images.length > 0 ? (
            images.map((image, index: number) => (
              <button
                key={index}
                onClick={() => handleImageChange(index, image.colorcode)}
                className={`relative aspect-square overflow-hidden rounded-lg bg-gray-100 ${
                  selectedImage === index
                    ? "ring-2 ring-primary ring-offset-2"
                    : ""
                }`}
              >
                <Image
                  src={image.imageurl}
                  alt={`${data.name} thumbnail ${index + 1}`}
                  fill
                  className="object-contain"
                />
              </button>
            ))
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-gray-500">No images available</p>
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <h1 className="text-3xl line-clamp-3 font-semibold  tracking-wide">
            {data.name}
          </h1>
          <h4 className="text-lg line-clamp-3">{data.description}</h4>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-bold">${data.price}</span>
            </div>
            <span className="rounded-full bg-red-100 px-2.5 py-0.5 text-sm font-semibold text-red-700">
              Ahorra {10}%
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <p
            className={
              data.stock > 0
                ? "text-sm text-muted-foreground font-bold text-teal-500"
                : "text-sm text-muted-foreground font-bold text-rose-500"
            }
          >
            {data.stock > 0 ? "item in stock" : "item out stock"}
          </p>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary"
              style={{ width: `${(data.stock / 20) * 100}%` }}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between">
            <label className="text-base">Tamaño:</label>
          </div>
          <RadioGroup
            defaultValue={selectedSize}
            onValueChange={setSelectedSize}
            className="flex flex-wrap gap-3"
          >
            {data?.sizes?.split(",").map((size) => (
              <label
                key={size}
                className={`flex cursor-pointer items-center justify-center rounded-md border px-3 py-2 text-sm
                    ${
                      selectedSize === size &&
                      "border-2 border-black bg-black text-white"
                    }`}
              >
                <RadioGroupItem value={size} className="sr-only" />
                {size.charAt(0).toUpperCase() + size.slice(1)}
              </label>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <label className="text-base">Color:</label>
          <RadioGroup
            defaultValue={selectedColor}
            onValueChange={setSelectedColor}
            className="flex gap-3"
          >
            {images
              .map((img) => img.colorcode)
              .filter(
                (value: string, index: number, self: Array<string>) =>
                  value && self.indexOf(value) === index
              )
              .map((colorCode: string) => (
                <button
                  key={colorCode}
                  onClick={() => handleImageChange(0, colorCode)}
                  className={`w-8 h-8 rounded-full
                    ${
                      selectedColor === colorCode
                        ? "ring-2 ring-black"
                        : "ring-2 ring-slate-500"
                    }`}
                  style={{ backgroundColor: colorCode }}
                />
              ))}
          </RadioGroup>
        </div>

        <div className="flex items-end gap-5">
          <SetQuantity
            cartProduct={{ quantity }}
            handleDecrease={() => setQuantity((prev) => Math.max(1, prev - 1))}
            handleIncrease={() =>
              setQuantity((prev) => Math.min(data.stock, prev + 1))
            }
          />
          <div className="w-10/12">
            <Button
              onClick={() => handleAddToCart()}
              className={`w-10/12 p-6 transition-transform hover:bg-emerald-200`}
              size="lg"
              variant="outline"
            >
              Añadir al carrito
            </Button>
          </div>
        </div>

        <div className="bg-muted pt-4">
          <div className="flex items-center gap-2">
            <span className="font-medium">
              Envíos gratis: Por compras superiores a 100.000
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mb-4">
          {paymentMethods.map((method, index) => (
            <PaymentIcon key={index} icon={method.icon} />
          ))}
          <p className="text-center text-lg font-medium text-gray-900">
            Seguridad Garantizada
          </p>
        </div>
      </div>
    </div>
  );
};
