"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Edit3, Save, X, Package, Tag, Weight, Ruler, Eye, TrendingUp, ShoppingCart, ChevronLeft, ChevronRight, ZoomIn, Home } from "lucide-react";
import { Button } from "@/app/(admin)/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/app/(admin)/components/ui/badge";
import { Switch } from "@/app/(admin)/components/ui/switch";
import Typography from "@/app/(admin)/components/ui/typography";
import { toast } from "sonner";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/app/(admin)/components/ui/alert-dialog";
import {
    updateProductField,
    toggleProductStatus,
    toggleProductOffer,
    updateProductStock,
    updateProductPrice
} from "./ProductActions";
import { ProductReviews } from "./ProductReviews";

interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    weight_grams: number;
    sizes: string;
    base_discount: number;
    active: boolean;
    in_offer: boolean;
    offer_discount: number | null;
    offer_end_date: string | null;
    offer_start_date: string | null;
    created_at: string;
    updated_at: string | null;
    deleted_at: string | null;
    categories: { name: string } | null;
    brands: { name: string } | null;
    images: Array<{
        image_url: string;
        is_primary: boolean | null;
        color: string | null;
    }>;
    product_variants: Array<{
        id: number;
        color: string;
        color_code: string;
        size: string;
        stock: number;
        price: number | null;
    }>;
}

interface EditableProductPageProps {
    product: Product;
    primaryImage: string;
    allImages: Array<{
        image_url: string;
        is_primary: boolean | null;
        color: string | null;
    }>;
    variants: Array<{
        id: number;
        color: string;
        color_code: string;
        size: string;
        stock: number;
        price: number | null;
    }>;
    totalStock: number;
    totalVariants: number;
    uniqueColors: string[];
    uniqueSizes: string[];
}

export function EditableProductPage({
    product,
    primaryImage,
    allImages,
    variants,
    totalStock,
    totalVariants,
    uniqueColors,
    uniqueSizes
}: EditableProductPageProps) {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [editValue, setEditValue] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [isGalleryOpen, setIsGalleryOpen] = useState(false);
    const [editingVariant, setEditingVariant] = useState<number | null>(null);
    const [variantEditValues, setVariantEditValues] = useState<{ stock?: string, price?: string }>({});

    const handleEditStart = (field: string, currentValue: string | number) => {
        setEditingField(field);
        setEditValue(currentValue.toString());
    };

    const handleSave = async (field: string, value: string, handler?: (val: any) => Promise<boolean>) => {
        setIsSaving(true);
        let success = false;

        try {
            if (handler) {
                success = await handler(field === "price" || field === "stock" ? Number(value) : value);
            } else {
                const result = await updateProductField(product.id, field,
                    field === "weight_grams" || field === "base_discount" || field === "offer_discount" ? Number(value) : value
                );
                success = result.success;
            }

            if (success) {
                toast.success("Campo actualizado correctamente");
                setEditingField(null);
            } else {
                toast.error("Error al actualizar el campo");
            }
        } catch (error) {
            toast.error("Error al actualizar el campo");
        }

        setIsSaving(false);
    };

    const handleCancel = () => {
        setEditingField(null);
        setEditValue("");
    };

    const handleToggle = async (field: "active" | "in_offer", currentValue: boolean) => {
        setIsSaving(true);
        const handler = field === "active" ? toggleProductStatus : toggleProductOffer;
        const result = await handler(product.id, !currentValue);

        if (result.success) {
            toast.success(`${field === "active" ? "Estado" : "Oferta"} ${!currentValue ? "activado" : "desactivado"} correctamente`);
        } else {
            toast.error(`Error al cambiar ${field === "active" ? "estado" : "oferta"}`);
        }
        setIsSaving(false);
    };

    const handlePriceUpdate = async (price: number) => {
        const result = await updateProductPrice(product.id, price);
        return result.success;
    };

    const handleStockUpdate = async (stock: number) => {
        const result = await updateProductStock(product.id, stock);
        return result.success;
    };

    const handlePreviousImage = () => {
        setSelectedImageIndex((prev) =>
            prev === 0 ? allImages.length - 1 : prev - 1
        );
    };

    const handleNextImage = () => {
        setSelectedImageIndex((prev) =>
            prev === allImages.length - 1 ? 0 : prev + 1
        );
    };

    const openGallery = (index: number) => {
        setSelectedImageIndex(index);
        setIsGalleryOpen(true);
    };

    const handleVariantEditStart = (variantId: number, field: 'stock' | 'price', currentValue: number) => {
        setEditingVariant(variantId);
        setVariantEditValues({ [field]: currentValue.toString() });
    };

    const handleVariantSave = async (variantId: number, field: 'stock' | 'price') => {
        setIsSaving(true);
        const value = variantEditValues[field];

        if (!value) {
            setIsSaving(false);
            return;
        }

        try {
            const response = await fetch(`/api/products/variants/${variantId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ [field]: Number(value) })
            });

            if (response.ok) {
                toast.success(`${field === 'stock' ? 'Stock' : 'Precio'} actualizado correctamente`);
                setEditingVariant(null);
                setVariantEditValues({});
                window.location.reload(); // Recargar para actualizar el stock total
            } else {
                toast.error(`Error al actualizar ${field}`);
            }
        } catch (error) {
            toast.error("Error en la actualización");
        }

        setIsSaving(false);
    };

    const handleVariantCancel = () => {
        setEditingVariant(null);
        setVariantEditValues({});
    };

    return (
        <section className="space-y-6">
            {/* Header mejorado con información del producto */}
            <div className="relative p-7 rounded-3xl bg-linear-to-br from-slate-900/70 to-slate-800/50 border border-slate-700/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                {/* Efectos de fondo */}
                <div className="absolute inset-0 bg-linear-to-r from-blue-500/5 via-purple-500/10 to-cyan-500/5" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-linear-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-linear-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />
                <div className="relative mb-4 pb-4 border-b border-slate-700/30">
                    <div className="flex items-center gap-2 text-sm">
                        <Link href="/dashboard" className="text-slate-500 hover:text-slate-300 transition-colors flex items-center gap-1">
                            <Home className="h-3 w-3" />
                            Dashboard
                        </Link>
                        <span className="text-slate-600">/</span>
                        <Link href="/dashboard/products" className="text-slate-400 hover:text-slate-200 transition-colors">
                            Productos
                        </Link>
                        <span className="text-slate-600">/</span>
                        <Typography className="text-white font-medium truncate max-w-64">
                            {product.name}
                        </Typography>
                    </div>
                </div>
                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    {/* Información principal del header - EDITABLE */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-4 mb-2">
                            <div className="flex items-center gap-2">
                                <Typography className="text-sm font-medium text-slate-400 uppercase tracking-wider">
                                    Detalles del producto
                                </Typography>
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge variant={product.active ? "success" : "destructive"} className="shadow-lg text-slate-700">
                                    {product.active ? "Activo" : "Inactivo"}
                                </Badge>
                                <Switch
                                    checked={product.active}
                                    onCheckedChange={() => handleToggle("active", product.active)}
                                    disabled={isSaving}
                                    className="data-[state=checked]:bg-green-600"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            {/* Nombre editable */}
                            <div className="group">
                                {editingField === "name" ? (
                                    <div className="flex items-center gap-2">
                                        <Input
                                            value={editValue}
                                            onChange={(e) => setEditValue(e.target.value)}
                                            className="text-4xl lg:text-5xl font-black bg-slate-800/50 border-blue-500/50 text-white"
                                            disabled={isSaving}
                                        />
                                        <Button
                                            size="sm"
                                            onClick={() => handleSave("name", editValue)}
                                            disabled={isSaving}
                                            className="bg-green-600 hover:bg-green-700"
                                        >
                                            <Save className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={handleCancel}
                                            disabled={isSaving}
                                            className="border-slate-600"
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                ) : (
                                    <div
                                        className="flex items-center gap-3 cursor-pointer rounded-lg p-2 -m-2 hover:bg-slate-800/30 transition-colors"
                                        onClick={() => handleEditStart("name", product.name)}
                                    >
                                        <Typography variant="h1" className="text-4xl lg:text-5xl font-black bg-linear-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
                                            {product.name}
                                        </Typography>
                                        <Edit3 className="h-5 w-5 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center gap-4 flex-wrap">
                                <div className="w-1 h-1 bg-slate-600 rounded-full" />
                                <Typography className="text-lg text-slate-300">
                                    {product.categories?.name || "Sin categoría"}
                                </Typography>
                                {product.brands?.name && (
                                    <>
                                        <div className="w-1 h-1 bg-slate-600 rounded-full" />
                                        <Typography className="text-lg text-slate-300">
                                            {product.brands.name}
                                        </Typography>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Métricas rápidas del header */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm min-w-24">
                            <Typography className="text-3xl font-bold bg-linear-to-b from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                {totalStock}
                            </Typography>
                            <Typography className="text-xs text-slate-400 text-center">Stock Total</Typography>
                        </div>

                        {totalVariants > 0 && (
                            <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm min-w-24">
                                <Typography className="text-3xl font-bold bg-linear-to-b from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                    {totalVariants}
                                </Typography>
                                <Typography className="text-xs text-slate-400 text-center">Variantes</Typography>
                            </div>
                        )}

                        {product.in_offer && (
                            <div className="flex flex-col items-center p-4 rounded-2xl bg-linear-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 backdrop-blur-sm min-w-24">
                                <Typography className="text-3xl font-bold bg-linear-to-b from-orange-400 to-red-500 bg-clip-text text-transparent">
                                    {product.offer_discount ? Number(product.offer_discount) : 0}%
                                </Typography>
                                <Typography className="text-xs text-orange-300 text-center font-medium">En Oferta</Typography>
                            </div>
                        )}
                    </div>
                </div>

            </div>

            {/* Columna principal - Información del producto EDITABLE */}
            <div className="xl:col-span-2 space-y-6">
                {/* Card de información principal */}
                <div className="p-6 rounded-2xl bg-linear-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 backdrop-blur-sm shadow-xl">
                    <div className="grid grid-cols-[1.5fr_2fr] gap-6">
                        {/* Imagen principal */}
                        <div className="shrink-0 w-full ">
                            <div
                                className="relative aspect-square rounded-xl overflow-hidden bg-slate-900/50 border border-slate-700/50 shadow-lg group cursor-pointer"
                                onClick={() => openGallery(0)}
                            >
                                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <Image
                                    src={primaryImage}
                                    alt={product.name}
                                    fill
                                    priority
                                    className="object-cover"
                                />
                                {product.in_offer && (
                                    <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-linear-to-r from-orange-500 to-red-500 shadow-lg">
                                        <span className="text-xs font-bold text-white">
                                            {product.offer_discount ? Number(product.offer_discount) : 0}% OFF
                                        </span>
                                    </div>
                                )}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                    <div className="flex items-center gap-2 text-white">
                                        <ZoomIn className="h-6 w-6" />
                                        <span className="text-sm font-medium">Ver imagen</span>
                                    </div>
                                </div>
                            </div>

                            {/* Galería de imágenes */}
                            {allImages.length > 1 && (
                                <div className="grid grid-cols-5 gap-3 mt-2">
                                    {allImages.slice(0, 4).map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="relative aspect-square rounded-lg overflow-hidden bg-slate-900/50 border border-slate-700/50 cursor-pointer hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105 group"
                                            onClick={() => openGallery(idx)}
                                        >
                                            <Image
                                                src={img.image_url}
                                                alt={`${product.name} - ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <Eye className="h-4 w-4 text-white" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {allImages.length > 4 && (
                                <Button
                                    variant="outline"
                                    className="w-full mt-2 text-xs border-slate-700 hover:bg-slate-800"
                                    onClick={() => openGallery(0)}
                                >
                                    Ver todas las imágenes ({allImages.length})
                                </Button>
                            )}
                        </div>

                        {/* Información principal EDITABLE */}
                        <div className="flex-1 space-y-4">
                            <div>
                                {/* Nombre editable */}
                                <div className="group">
                                    {editingField === "name_detail" ? (
                                        <div className="flex items-center gap-2 mb-3">
                                            <Input
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="text-3xl font-bold bg-slate-800/50 border-blue-500/50 text-white"
                                                disabled={isSaving}
                                            />
                                            <Button
                                                size="sm"
                                                onClick={() => handleSave("name", editValue)}
                                                disabled={isSaving}
                                                className="bg-green-600 hover:bg-green-700"
                                            >
                                                <Save className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleCancel}
                                                disabled={isSaving}
                                                className="border-slate-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            className="flex items-center gap-3 cursor-pointer rounded-lg p-2 -m-2 hover:bg-slate-800/30 transition-colors mb-3 group/title"
                                            onClick={() => handleEditStart("name_detail", product.name)}
                                        >
                                            <Typography variant="h1" className="text-3xl font-bold bg-linear-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                                {product.name}
                                            </Typography>
                                            <Edit3 className="h-4 w-4 text-slate-500 opacity-0 group-hover/title:opacity-100 transition-opacity" />
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-3 mb-4">
                                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                                        {product.categories?.name || "Sin categoría"}
                                    </Badge>
                                </div>

                                <div className="group/price">
                                    {editingField === "price" ? (
                                        <div className="flex items-center gap-2 p-4 rounded-xl bg-linear-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/50">
                                            <span className="text-slate-400 text-sm">$</span>
                                            <Input
                                                type="number"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="text-4xl font-black bg-transparent border-none text-blue-400 p-0"
                                                disabled={isSaving}
                                            />
                                            <span className="text-slate-400 text-sm">COP</span>
                                            <Button
                                                size="sm"
                                                onClick={() => handleSave("price", editValue, handlePriceUpdate)}
                                                disabled={isSaving}
                                                className="ml-2 bg-green-600 hover:bg-green-700"
                                            >
                                                <Save className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={handleCancel}
                                                disabled={isSaving}
                                                className="border-slate-600"
                                            >
                                                <X className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    ) : (
                                        <div
                                            className="group/price p-4 rounded-xl bg-linear-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 inline-flex items-baseline gap-2 cursor-pointer hover:border-blue-500/40 transition-colors relative"
                                            onClick={() => handleEditStart("price", product.price)}
                                        >
                                            <Typography className="text-5xl font-black bg-linear-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                                ${product.price.toLocaleString()}
                                            </Typography>
                                            <span className="text-slate-400 text-sm">COP</span>
                                            <Edit3 className="absolute -top-2 -right-2 h-6 w-6 p-1 text-slate-500 opacity-0 group-hover/price:opacity-100 transition-opacity bg-slate-800 rounded" />
                                        </div>
                                    )}
                                </div>
                            </div>


                            {/* Descripción editable */}
                            <div className="group/desc">
                                {editingField === "description" ? (
                                    <div className="space-y-2">
                                        <Typography className="text-xs text-slate-400 mb-1">Descripción</Typography>
                                        <div className="flex items-start gap-2">
                                            <Textarea
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                className="bg-slate-800/50 border-blue-500/50 text-slate-300 resize-none min-h-[80px]"
                                                disabled={isSaving}
                                            />
                                            <div className="flex flex-col gap-1">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSave("description", editValue)}
                                                    disabled={isSaving}
                                                    className="bg-green-600 hover:bg-green-700"
                                                >
                                                    <Save className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={handleCancel}
                                                    disabled={isSaving}
                                                    className="border-slate-600"
                                                >
                                                    <X className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div
                                        className="cursor-pointer rounded-lg p-2 -m-2 hover:bg-slate-800/30 transition-colors relative"
                                        onClick={() => handleEditStart("description", product.description)}
                                    >
                                        <Typography className="text-md text-slate-300 leading-relaxed">
                                            {product.description}
                                        </Typography>
                                        <Edit3 className="absolute top-2 right-2 h-4 w-4 text-slate-500 opacity-0 group-hover/desc:opacity-100 transition-opacity" />
                                    </div>
                                )}
                            </div>

                            {/* Info grid EDITABLE */}
                            <div className="grid grid-cols-2 gap-4 pt-3 px-3">
                                {/* Stock Total (calculado solo de variantes) */}
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-linear-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30">
                                    <div className="size-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
                                    <div>
                                        <Typography className="text-xs text-green-300 block">Stock</Typography>
                                        <Typography className="text-sm font-semibold text-green-400">{totalStock} {totalStock === 1 ? "unidad" : "unidades"}</Typography>
                                    </div>
                                </div>

                                {/* Marca */}
                                <div className="flex items-center gap-3 p-3 rounded-lg bg-linear-to-br from-blue-500/10 to-indigo-500/10 border border-blue-500/30">
                                    <div className="size-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />
                                    <div>
                                        <Typography className="text-xs text-blue-300 block">Marca</Typography>
                                        <Typography className="text-sm font-semibold text-blue-400">{product.brands?.name || "Sin marca"}</Typography>
                                    </div>
                                </div>

                                {/* Peso editable */}
                                <div className="group/weight">
                                    {editingField === "weight_grams" ? (
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-cyan-500/50">
                                            <div className="size-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
                                            <div className="flex-1">
                                                <Typography className="text-xs text-slate-400">Peso</Typography>
                                                <Input
                                                    type="number"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="text-sm font-semibold bg-transparent border-none p-0"
                                                    disabled={isSaving}
                                                />
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSave("weight_grams", editValue)}
                                                    disabled={isSaving}
                                                    className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700"
                                                >
                                                    <Save className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={handleCancel}
                                                    disabled={isSaving}
                                                    className="h-6 w-6 p-0 border-slate-600"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:border-cyan-500/50 transition-colors relative"
                                            onClick={() => handleEditStart("weight_grams", product.weight_grams)}
                                        >
                                            <div className="size-2 rounded-full bg-cyan-400 shadow-lg shadow-cyan-400/50" />
                                            <div>
                                                <Typography className="text-xs text-slate-400 block">Peso</Typography>
                                                <Typography className="text-sm font-semibold">{product.weight_grams}g</Typography>
                                            </div>
                                            <Edit3 className="absolute top-2 right-2 h-3 w-3 text-slate-500 opacity-0 group-hover/weight:opacity-100 transition-opacity" />
                                        </div>
                                    )}
                                </div>

                                {/* Tallas editable */}
                                <div className="group/sizes">
                                    {editingField === "sizes" ? (
                                        <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-yellow-500/50">
                                            <div className="size-2 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50" />
                                            <div className="flex-1">
                                                <Typography className="text-xs text-slate-400">Tallas</Typography>
                                                <Input
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="text-sm font-semibold bg-transparent border-none p-0"
                                                    disabled={isSaving}
                                                />
                                            </div>
                                            <div className="flex gap-1">
                                                <Button
                                                    size="sm"
                                                    onClick={() => handleSave("sizes", editValue)}
                                                    disabled={isSaving}
                                                    className="h-6 w-6 p-0 bg-green-600 hover:bg-green-700"
                                                >
                                                    <Save className="h-3 w-3" />
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="outline"
                                                    onClick={handleCancel}
                                                    disabled={isSaving}
                                                    className="h-6 w-6 p-0 border-slate-600"
                                                >
                                                    <X className="h-3 w-3" />
                                                </Button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:border-yellow-500/50 transition-colors relative"
                                            onClick={() => handleEditStart("sizes", product.sizes)}
                                        >
                                            <div className="size-2 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50" />
                                            <div>
                                                <Typography className="text-xs text-slate-400 block">Tallas</Typography>
                                                <Typography className="text-sm font-semibold">{product.sizes.normalize()}</Typography>
                                            </div>
                                            <Edit3 className="absolute top-2 right-2 h-3 w-3 text-slate-500 opacity-0 group-hover/sizes:opacity-100 transition-opacity" />
                                        </div>
                                    )}
                                </div>

                            </div>
                            {/* Control de oferta integrado */}
                            <div className="pt-6 mt-6 border-t border-slate-700/30">
                                <div className="flex items-center justify-between mb-3">
                                    <Typography className="text-sm font-semibold text-slate-300">Configuración de Oferta</Typography>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={product.in_offer}
                                            onCheckedChange={() => handleToggle("in_offer", product.in_offer)}
                                            disabled={isSaving}
                                            className="data-[state=checked]:bg-orange-600"
                                        />
                                        <Typography className="text-sm text-slate-400">
                                            {product.in_offer ? "En Oferta" : "Sin Oferta"}
                                        </Typography>
                                    </div>
                                </div>

                                {product.in_offer && (
                                    <div className="p-4 rounded-xl bg-linear-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30">
                                        <div className="group/discount">
                                            {editingField === "offer_discount" ? (
                                                <div className="flex items-center gap-2">
                                                    <Typography className="text-sm text-orange-300">Descuento:</Typography>
                                                    <Input
                                                        type="number"
                                                        value={editValue}
                                                        onChange={(e) => setEditValue(e.target.value)}
                                                        className="w-20 bg-slate-800/50 border-orange-500/50"
                                                        disabled={isSaving}
                                                    />
                                                    <span className="text-orange-300">%</span>
                                                    <Button
                                                        size="sm"
                                                        onClick={() => handleSave("offer_discount", editValue)}
                                                        disabled={isSaving}
                                                        className="bg-green-600 hover:bg-green-700"
                                                    >
                                                        <Save className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        size="sm"
                                                        variant="outline"
                                                        onClick={handleCancel}
                                                        disabled={isSaving}
                                                        className="border-slate-600"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div
                                                    className="flex items-center gap-2 cursor-pointer hover:bg-orange-500/10 rounded p-1 -m-1 transition-colors"
                                                    onClick={() => handleEditStart("offer_discount", product.offer_discount || 0)}
                                                >
                                                    <Typography className="text-sm text-orange-300">Descuento:</Typography>
                                                    <Typography className="text-lg font-bold text-orange-400">
                                                        {product.offer_discount || 0}%
                                                    </Typography>
                                                    <Edit3 className="h-3 w-3 text-orange-500 opacity-0 group-hover/discount:opacity-100 transition-opacity" />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* Sección de variantes - Integrada en el diseño principal */}
                    {totalVariants > 0 && (
                        <div className="p-6 space-y-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30">
                                        <Package className="h-5 w-5 text-purple-400" />
                                    </div>
                                    <div>
                                        <Typography variant="h3" className="text-lg font-bold">Variantes del Producto</Typography>
                                    </div>
                                </div>
                                <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/40 px-4 py-1.5 text-sm font-semibold">
                                    {totalVariants} {totalVariants === 1 ? 'variante' : 'variantes'}
                                </Badge>
                            </div>

                            {/* Colores y tallas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {uniqueColors.length > 0 && (
                                    <div className="space-y-2">
                                        <Typography className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Colores disponibles</Typography>
                                        <div className="flex flex-wrap gap-2">
                                            {uniqueColors.map((color) => {
                                                const variant = variants.find(v => v.color === color);
                                                const colorStock = variants.filter(v => v.color === color).reduce((sum, v) => sum + v.stock, 0);
                                                return (
                                                    <div
                                                        key={color}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all text-sm group cursor-pointer hover:scale-105"
                                                    >
                                                        <div
                                                            className="size-4 rounded-full border-2 border-slate-600 shadow-lg"
                                                            style={{ backgroundColor: variant?.color_code }}
                                                        />
                                                        <span className="font-medium">{color}</span>
                                                        <Badge className="text-[10px] bg-slate-700/50 ml-1">
                                                            {colorStock}
                                                        </Badge>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}

                                {uniqueSizes.length > 0 && (
                                    <div className="space-y-2">
                                        <Typography className="text-xs font-semibold text-slate-300 uppercase tracking-wide">Tallas disponibles</Typography>
                                        <div className="flex flex-wrap gap-2">
                                            {uniqueSizes.map((size) => {
                                                const sizeStock = variants.filter(v => v.size === size).reduce((sum, v) => sum + v.stock, 0);
                                                return (
                                                    <div
                                                        key={size}
                                                        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all text-sm font-medium cursor-pointer hover:scale-105"
                                                    >
                                                        {size}
                                                        <Badge className="text-[10px] bg-slate-700/50">
                                                            {sizeStock}
                                                        </Badge>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Tabla de variantes EDITABLE */}
                            <div className="overflow-hidden rounded-xl border border-slate-700/50 shadow-lg">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-800/70">
                                            <tr>
                                                <th className="px-6 py-4 text-left font-semibold text-slate-300">Color</th>
                                                <th className="px-6 py-4 text-left font-semibold text-slate-300">Talla</th>
                                                <th className="px-6 py-4 text-right font-semibold text-slate-300">
                                                    <div className="flex items-center justify-end gap-2">
                                                        Stock
                                                        <Package className="h-3 w-3 text-slate-400" />
                                                    </div>
                                                </th>
                                                <th className="px-6 py-4 text-right font-semibold text-slate-300">
                                                    <div className="flex items-center justify-end gap-2">
                                                        Precio
                                                        <Tag className="h-3 w-3 text-slate-400" />
                                                    </div>
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/30">
                                            {variants.map((variant) => (
                                                <tr key={variant.id} className="hover:bg-slate-800/40 transition-colors group/row">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-3">
                                                            <div
                                                                className="size-5 rounded-full border-2 border-slate-600 shadow-md"
                                                                style={{ backgroundColor: variant.color_code }}
                                                            />
                                                            <span className="font-medium">{variant.color}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium">{variant.size}</td>

                                                    {/* Stock editable por variante */}
                                                    <td className="px-6 py-4 text-right">
                                                        {editingVariant === variant.id && variantEditValues.stock !== undefined ? (
                                                            <div className="flex items-center justify-end gap-2">
                                                                <Input
                                                                    type="number"
                                                                    value={variantEditValues.stock}
                                                                    onChange={(e) => setVariantEditValues(prev => ({ ...prev, stock: e.target.value }))}
                                                                    className="w-20 h-7 text-right text-xs bg-slate-800 border-green-500/50"
                                                                    disabled={isSaving}
                                                                />
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleVariantSave(variant.id, 'stock')}
                                                                    disabled={isSaving}
                                                                    className="h-7 w-7 p-0 bg-green-600 hover:bg-green-700"
                                                                >
                                                                    <Save className="h-3 w-3" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={handleVariantCancel}
                                                                    disabled={isSaving}
                                                                    className="h-7 w-7 p-0"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="inline-flex items-center gap-2 cursor-pointer group/edit"
                                                                onClick={() => handleVariantEditStart(variant.id, 'stock', variant.stock)}
                                                            >
                                                                <Badge
                                                                    variant={variant.stock > 0 ? "success" : "destructive"}
                                                                    className="text-xs px-3 py-1 font-semibold"
                                                                >
                                                                    {variant.stock}
                                                                </Badge>
                                                                <Edit3 className="h-3 w-3 text-slate-500 opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                                                            </div>
                                                        )}
                                                    </td>

                                                    {/* Precio editable por variante */}
                                                    <td className="px-6 py-4 text-right">
                                                        {editingVariant === variant.id && variantEditValues.price !== undefined ? (
                                                            <div className="flex items-center justify-end gap-2">
                                                                <span className="text-xs text-slate-400">$</span>
                                                                <Input
                                                                    type="number"
                                                                    value={variantEditValues.price}
                                                                    onChange={(e) => setVariantEditValues(prev => ({ ...prev, price: e.target.value }))}
                                                                    className="w-24 h-7 text-right text-xs bg-slate-800 border-blue-500/50"
                                                                    disabled={isSaving}
                                                                />
                                                                <Button
                                                                    size="sm"
                                                                    onClick={() => handleVariantSave(variant.id, 'price')}
                                                                    disabled={isSaving}
                                                                    className="h-7 w-7 p-0 bg-green-600 hover:bg-green-700"
                                                                >
                                                                    <Save className="h-3 w-3" />
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    onClick={handleVariantCancel}
                                                                    disabled={isSaving}
                                                                    className="h-7 w-7 p-0"
                                                                >
                                                                    <X className="h-3 w-3" />
                                                                </Button>
                                                            </div>
                                                        ) : (
                                                            <div
                                                                className="inline-flex items-center gap-2 cursor-pointer group/edit font-bold text-blue-400"
                                                                onClick={() => handleVariantEditStart(variant.id, 'price', variant.price || 0)}
                                                            >
                                                                {variant.price ? `$${variant.price.toLocaleString()}` : "-"}
                                                                <Edit3 className="h-3 w-3 text-slate-500 opacity-0 group-hover/edit:opacity-100 transition-opacity" />
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>


                        </div>
                    )}
                </div>
            </div>



            {/* Modal de galería de imágenes */}
            <AlertDialog open={isGalleryOpen} onOpenChange={setIsGalleryOpen}>
                <AlertDialogContent className="max-w-3xl p-0 rounded-2xl bg-slate-900 border-slate-700 overflow-hidden">
                    <div className="relative">
                        {/* Botón cerrar */}
                        <Button
                            variant="outline"
                            size="icon"
                            className="absolute top-4 right-4 z-50 bg-slate-900/80 border-slate-700 hover:bg-slate-800 rounded-full"
                            onClick={() => setIsGalleryOpen(false)}
                        >
                            <X className="h-4 w-4" />
                        </Button>

                        <AlertDialogHeader className="p-6 pb-4">
                            <AlertDialogTitle className="text-white text-xl">
                                {product.name}
                            </AlertDialogTitle>
                        </AlertDialogHeader>

                        <div className="px-6 pb-6 space-y-4">
                            {/* Imagen principal del modal */}
                            <div className="relative w-full h-[500px] rounded-lg overflow-hidden bg-slate-800">
                                <Image
                                    src={allImages[selectedImageIndex]?.image_url || primaryImage}
                                    alt={`${product.name} - ${selectedImageIndex + 1}`}
                                    fill
                                    className="object-contain"
                                    priority
                                />

                                {/* Controles de navegación */}
                                {allImages.length > 1 && (
                                    <>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="absolute left-4 top-1/2 -translate-y-1/2 bg-slate-900/90 border-slate-700 hover:bg-slate-800 rounded-full"
                                            onClick={handlePreviousImage}
                                        >
                                            <ChevronLeft className="h-5 w-5" />
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="icon"
                                            className="absolute right-4 top-1/2 -translate-y-1/2 bg-slate-900/90 border-slate-700 hover:bg-slate-800 rounded-full"
                                            onClick={handleNextImage}
                                        >
                                            <ChevronRight className="h-5 w-5" />
                                        </Button>

                                        {/* Indicador de posición */}
                                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-full bg-slate-900/90 border border-slate-700 backdrop-blur-sm">
                                            <Typography className="text-sm text-slate-300 font-medium">
                                                {selectedImageIndex + 1} / {allImages.length}
                                            </Typography>
                                        </div>
                                    </>
                                )}
                            </div>

                            {/* Thumbnails */}
                            {allImages.length > 1 && (
                                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-slate-900">
                                    {allImages.map((img, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedImageIndex(idx)}
                                            className={`relative shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${selectedImageIndex === idx
                                                ? 'border-blue-500 shadow-lg shadow-blue-500/50 scale-110'
                                                : 'border-slate-700 hover:border-slate-600'
                                                }`}
                                        >
                                            <Image
                                                src={img.image_url}
                                                alt={`Thumbnail ${idx + 1}`}
                                                fill
                                                className="object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Información de la imagen */}
                            <div className="flex items-center gap-2 pt-2 border-t border-slate-700">
                                {allImages[selectedImageIndex]?.color && (
                                    <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                                        Color: {allImages[selectedImageIndex].color}
                                    </Badge>
                                )}
                                {allImages[selectedImageIndex]?.is_primary && (
                                    <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                                        Imagen Principal
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </div>
                </AlertDialogContent>
            </AlertDialog>

            {/* Sección de Reseñas */}
            <ProductReviews productId={product.id} />
        </section>
    );
}