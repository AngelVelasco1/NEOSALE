"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Edit3, Save, X, Package, Tag, Weight, Ruler, Eye, TrendingUp, ShoppingCart } from "lucide-react";
import { Button } from "@/app/(admin)/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/app/(admin)/components/ui/badge";
import { Switch } from "@/app/(admin)/components/ui/switch";
import Typography from "@/app/(admin)/components/ui/typography";
import { toast } from "sonner";
import {
    updateProductField,
    toggleProductStatus,
    toggleProductOffer,
    updateProductStock,
    updateProductPrice
} from "./ProductActions";

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
    offer_end_date: Date | null;
    created_at: string;
    updated_at: string | null;
    categories: { name: string } | null;
    brands: { name: string } | null;
    images: Array<{
        image_url: string;
        is_primary: boolean;
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
        is_primary: boolean;
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

    return (
        <section className="space-y-6">
            {/* Header mejorado con información del producto */}
            <div className="relative p-8 rounded-3xl bg-gradient-to-br from-slate-900/70 to-slate-800/50 border border-slate-700/40 backdrop-blur-xl shadow-2xl overflow-hidden">
                {/* Efectos de fondo */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/10 to-cyan-500/5" />
                <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-3xl" />

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
                                        <Typography variant="h1" className="text-4xl lg:text-5xl font-black bg-gradient-to-r from-white via-blue-100 to-purple-100 bg-clip-text text-transparent leading-tight">
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
                            <Typography className="text-3xl font-bold bg-gradient-to-b from-green-400 to-emerald-500 bg-clip-text text-transparent">
                                {totalStock}
                            </Typography>
                            <Typography className="text-xs text-slate-400 text-center">Stock Total</Typography>
                        </div>

                        {totalVariants > 0 && (
                            <div className="flex flex-col items-center p-4 rounded-2xl bg-slate-800/50 border border-slate-700/50 backdrop-blur-sm min-w-24">
                                <Typography className="text-3xl font-bold bg-gradient-to-b from-purple-400 to-pink-500 bg-clip-text text-transparent">
                                    {totalVariants}
                                </Typography>
                                <Typography className="text-xs text-slate-400 text-center">Variantes</Typography>
                            </div>
                        )}

                        {product.in_offer && (
                            <div className="flex flex-col items-center p-4 rounded-2xl bg-gradient-to-br from-orange-500/20 to-red-500/20 border border-orange-500/30 backdrop-blur-sm min-w-24">
                                <Typography className="text-3xl font-bold bg-gradient-to-b from-orange-400 to-red-500 bg-clip-text text-transparent">
                                    {product.offer_discount ? Number(product.offer_discount) : 0}%
                                </Typography>
                                <Typography className="text-xs text-orange-300 text-center font-medium">En Oferta</Typography>
                            </div>
                        )}
                    </div>
                </div>

                {/* Breadcrumb mejorado */}
                <div className="relative mt-6 pt-4 border-t border-slate-700/30">
                    <div className="flex items-center gap-2 text-sm">
                        <Typography className="text-slate-500">Dashboard</Typography>
                        <span className="text-slate-600">/</span>
                        <Typography className="text-slate-400">Productos</Typography>
                        <span className="text-slate-600">/</span>
                        <Typography className="text-blue-400 font-medium">#{product.id}</Typography>
                        <span className="text-slate-600">-</span>
                        <Typography className="text-white font-medium truncate max-w-64">
                            {product.name}
                        </Typography>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                {/* Columna principal - Información del producto EDITABLE */}
                <div className="xl:col-span-2 space-y-6">
                    {/* Card de información principal */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 backdrop-blur-sm shadow-xl">
                        <div className="flex flex-col md:flex-row gap-6">
                            {/* Imagen principal */}
                            <div className="shrink-0 w-full md:w-64">
                                <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900/50 border border-slate-700/50 shadow-lg group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <Image
                                        src={primaryImage}
                                        alt={product.name}
                                        fill
                                        priority
                                        className="object-cover"
                                    />
                                    {product.in_offer && (
                                        <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 shadow-lg">
                                            <span className="text-xs font-bold text-white">
                                                {product.offer_discount ? Number(product.offer_discount) : 0}% OFF
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Galería de imágenes */}
                                {allImages.length > 1 && (
                                    <div className="grid grid-cols-4 gap-2 mt-3">
                                        {allImages.slice(0, 4).map((img, idx) => (
                                            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden bg-slate-900/50 border border-slate-700/50 cursor-pointer hover:border-blue-500 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 hover:scale-105">
                                                <Image
                                                    src={img.image_url}
                                                    alt={`${product.name} - ${idx + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
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
                                                <Typography variant="h1" className="text-3xl font-bold bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                                                    {product.name}
                                                </Typography>
                                                <Edit3 className="h-4 w-4 text-slate-500 opacity-0 group-hover/title:opacity-100 transition-opacity" />
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3 mb-4">
                                        <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/30">
                                            {product.brands?.name || "N/A"}
                                        </Badge>
                                        <Badge className="bg-purple-500/10 text-purple-400 border-purple-500/30">
                                            {product.categories?.name || "N/A"}
                                        </Badge>
                                    </div>

                                    {/* Precio editable */}
                                    <div className="group/price">
                                        {editingField === "price" ? (
                                            <div className="flex items-center gap-2 p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/50">
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
                                                className="group/price p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20 inline-flex items-baseline gap-2 cursor-pointer hover:border-blue-500/40 transition-colors relative"
                                                onClick={() => handleEditStart("price", product.price)}
                                            >
                                                <Typography className="text-4xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                                    ${product.price.toLocaleString()}
                                                </Typography>
                                                <span className="text-slate-400 text-sm">COP</span>
                                                <Edit3 className="absolute -top-2 -right-2 h-4 w-4 text-slate-500 opacity-0 group-hover/price:opacity-100 transition-opacity bg-slate-800 rounded p-1 w-6 h-6" />
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
                                            <Typography className="text-sm text-slate-300 leading-relaxed">
                                                {product.description}
                                            </Typography>
                                            <Edit3 className="absolute top-2 right-2 h-4 w-4 text-slate-500 opacity-0 group-hover/desc:opacity-100 transition-opacity" />
                                        </div>
                                    )}
                                </div>

                                {/* Info grid EDITABLE */}
                                <div className="grid grid-cols-2 gap-3 pt-3">
                                    {/* Stock editable */}
                                    <div className="group/stock">
                                        {editingField === "stock" ? (
                                            <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-green-500/50">
                                                <div className="size-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
                                                <div className="flex-1">
                                                    <Typography className="text-xs text-slate-400 block">Stock Base</Typography>
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
                                                        onClick={() => handleSave("stock", editValue, handleStockUpdate)}
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
                                                className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 cursor-pointer hover:border-green-500/50 transition-colors relative"
                                                onClick={() => handleEditStart("stock", product.stock)}
                                            >
                                                <div className="size-2 rounded-full bg-green-400 shadow-lg shadow-green-400/50" />
                                                <div>
                                                    <Typography className="text-xs text-slate-400 block">Stock Base</Typography>
                                                    <Typography className="text-sm font-semibold">{product.stock} unidades</Typography>
                                                </div>
                                                <Edit3 className="absolute top-2 right-2 h-3 w-3 text-slate-500 opacity-0 group-hover/stock:opacity-100 transition-opacity" />
                                            </div>
                                        )}
                                    </div>

                                    {/* Stock Total (no editable) */}
                                    <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                                        <div className="size-2 rounded-full bg-blue-400 shadow-lg shadow-blue-400/50" />
                                        <div>
                                            <Typography className="text-xs text-slate-400 block">Stock Total</Typography>
                                            <Typography className="text-sm font-semibold">{totalStock} unidades</Typography>
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
                                                    <Typography className="text-sm font-semibold">{product.sizes}</Typography>
                                                </div>
                                                <Edit3 className="absolute top-2 right-2 h-3 w-3 text-slate-500 opacity-0 group-hover/sizes:opacity-100 transition-opacity" />
                                            </div>
                                        )}
                                    </div>
                                </div>
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
                                <div className="p-4 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/30">
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

                        {/* Sección de variantes */}
                        {totalVariants > 0 && (
                            <div className="pt-6 mt-6 border-t border-slate-700/30 space-y-4">
                                <Typography variant="h3" className="text-lg font-bold">Variantes del Producto</Typography>

                                {/* Colores y tallas */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {uniqueColors.length > 0 && (
                                        <div className="space-y-3">
                                            <Typography className="text-sm font-semibold text-slate-400">Colores disponibles</Typography>
                                            <div className="flex flex-wrap gap-2">
                                                {uniqueColors.map((color) => {
                                                    const variant = variants.find(v => v.color === color);
                                                    return (
                                                        <div
                                                            key={color}
                                                            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all text-sm cursor-pointer hover:scale-105"
                                                        >
                                                            <div
                                                                className="size-4 rounded-full border-2 border-slate-600 shadow-lg"
                                                                style={{ backgroundColor: variant?.color_code }}
                                                            />
                                                            <span className="font-medium">{color}</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    )}

                                    {uniqueSizes.length > 0 && (
                                        <div className="space-y-3">
                                            <Typography className="text-sm font-semibold text-slate-400">Tallas disponibles</Typography>
                                            <div className="flex flex-wrap gap-2">
                                                {uniqueSizes.map((size) => (
                                                    <div
                                                        key={size}
                                                        className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all text-sm font-medium cursor-pointer hover:scale-105"
                                                    >
                                                        {size}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Tabla de variantes */}
                                <div className="overflow-hidden rounded-xl border border-slate-700/50 shadow-lg">
                                    <table className="w-full text-sm">
                                        <thead className="bg-slate-800/70">
                                            <tr>
                                                <th className="px-6 py-4 text-left font-semibold text-slate-300">Color</th>
                                                <th className="px-6 py-4 text-left font-semibold text-slate-300">Talla</th>
                                                <th className="px-6 py-4 text-right font-semibold text-slate-300">Stock</th>
                                                <th className="px-6 py-4 text-right font-semibold text-slate-300">Precio</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-700/30">
                                            {variants.map((variant) => (
                                                <tr key={variant.id} className="hover:bg-slate-800/40 transition-colors">
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
                                                    <td className="px-6 py-4 text-right">
                                                        <Badge
                                                            variant={variant.stock > 0 ? "success" : "destructive"}
                                                            className="text-xs px-3 py-1 font-semibold"
                                                        >
                                                            {variant.stock}
                                                        </Badge>
                                                    </td>
                                                    <td className="px-6 py-4 text-right font-bold text-blue-400">
                                                        {variant.price ? `$${variant.price.toLocaleString()}` : "-"}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar derecho simplificado - solo estadísticas y galería */}
                <div className="space-y-6">
                    {/* Estadísticas rápidas */}
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/50 border border-slate-700/50 backdrop-blur-sm shadow-xl">
                        <Typography variant="h3" className="text-lg font-bold mb-4">
                            Estadísticas Rápidas
                        </Typography>
                        <div className="grid grid-cols-1 gap-3">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                                <Package className="h-5 w-5 text-blue-400" />
                                <div>
                                    <Typography className="text-xs text-blue-300">Stock Total</Typography>
                                    <Typography className="text-xl font-bold text-blue-400">{totalStock}</Typography>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-purple-500/10 border border-purple-500/20">
                                <Tag className="h-5 w-5 text-purple-400" />
                                <div>
                                    <Typography className="text-xs text-purple-300">Variantes</Typography>
                                    <Typography className="text-xl font-bold text-purple-400">{totalVariants}</Typography>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                                <Ruler className="h-5 w-5 text-green-400" />
                                <div>
                                    <Typography className="text-xs text-green-300">Colores</Typography>
                                    <Typography className="text-xl font-bold text-green-400">{uniqueColors.length}</Typography>
                                </div>
                            </div>

                            <div className="flex items-center gap-3 p-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                                <Weight className="h-5 w-5 text-yellow-400" />
                                <div>
                                    <Typography className="text-xs text-yellow-300">Tallas</Typography>
                                    <Typography className="text-xl font-bold text-yellow-400">{uniqueSizes.length}</Typography>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tip de edición */}
                    <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/30">
                        <div className="flex items-start gap-3">
                            <div className="shrink-0 w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                                <Edit3 className="h-4 w-4 text-blue-400" />
                            </div>
                            <div>
                                <Typography className="text-sm font-semibold text-blue-300 mb-1">
                                    Edición Rápida
                                </Typography>
                                <Typography className="text-xs text-slate-400 leading-relaxed">
                                    Haz clic en cualquier campo de información del producto para editarlo directamente. Los cambios se guardan automáticamente.
                                </Typography>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}