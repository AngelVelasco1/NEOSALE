"use client";

import React, { useState } from "react";
import { Button } from "@/app/(admin)/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/app/(admin)/components/ui/badge";
import { Switch } from "@/app/(admin)/components/ui/switch";
import {
    Edit3,
    Save,
    X,
    TrendingUp,
    TrendingDown,
    Package
} from "lucide-react";
import Typography from "@/app/(admin)/components/ui/typography";
import { toast } from "sonner";

interface EditableFieldProps {
    label: string;
    value: string | number;
    type?: "text" | "number" | "textarea";
    onSave: (newValue: string | number) => Promise<boolean>;
    icon?: React.ReactNode;
    suffix?: string;
}

export function EditableField({ label, value, type = "text", onSave, icon, suffix }: EditableFieldProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editValue, setEditValue] = useState(value.toString());
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        const success = await onSave(type === "number" ? Number(editValue) : editValue);

        if (success) {
            setIsEditing(false);
            toast.success(`${label} actualizado correctamente`);
        } else {
            toast.error(`Error al actualizar ${label}`);
        }
        setIsSaving(false);
    };

    const handleCancel = () => {
        setEditValue(value.toString());
        setIsEditing(false);
    };

    if (isEditing) {
        return (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-blue-500/50 shadow-lg">
                <div className="flex items-center gap-2 min-w-0 flex-1">
                    {icon && <div className="text-blue-400 shrink-0">{icon}</div>}
                    <div className="min-w-0 flex-1">
                        <Typography className="text-xs text-slate-400 mb-1">{label}</Typography>
                        {type === "textarea" ? (
                            <Textarea
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="min-h-[60px] bg-slate-900/50 border-slate-600 text-sm resize-none"
                                disabled={isSaving}
                            />
                        ) : (
                            <Input
                                type={type}
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                className="bg-slate-900/50 border-slate-600 text-sm"
                                disabled={isSaving}
                            />
                        )}
                    </div>
                </div>
                <div className="flex gap-1 shrink-0">
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="h-8 w-8 p-0 bg-green-600 hover:bg-green-700"
                    >
                        <Save className="h-3 w-3" />
                    </Button>
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCancel}
                        disabled={isSaving}
                        className="h-8 w-8 p-0 border-slate-600 hover:bg-slate-700"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div
            className="group flex items-center gap-2 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:border-slate-600 transition-all cursor-pointer"
            onClick={() => setIsEditing(true)}
        >
            <div className="flex items-center gap-2 min-w-0 flex-1">
                {icon && <div className="text-slate-400 shrink-0">{icon}</div>}
                <div className="min-w-0 flex-1">
                    <Typography className="text-xs text-slate-400">{label}</Typography>
                    <Typography className="text-sm font-semibold truncate">
                        {value}{suffix && <span className="text-slate-500 ml-1">{suffix}</span>}
                    </Typography>
                </div>
            </div>
            <Edit3 className="h-4 w-4 text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
        </div>
    );
}

interface ToggleFieldProps {
    label: string;
    value: boolean;
    onToggle: (newValue: boolean) => Promise<boolean>;
    icon?: React.ReactNode;
    trueLabel?: string;
    falseLabel?: string;
}

export function ToggleField({
    label,
    value,
    onToggle,
    icon,
    trueLabel = "Activo",
    falseLabel = "Inactivo"
}: ToggleFieldProps) {
    const [isToggling, setIsToggling] = useState(false);

    const handleToggle = async (checked: boolean) => {
        setIsToggling(true);
        const success = await onToggle(checked);

        if (success) {
            toast.success(`${label} ${checked ? "activado" : "desactivado"} correctamente`);
        } else {
            toast.error(`Error al cambiar ${label}`);
        }
        setIsToggling(false);
    };

    return (
        <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
            <div className="flex items-center gap-2">
                {icon && <div className="text-slate-400">{icon}</div>}
                <div>
                    <Typography className="text-xs text-slate-400">{label}</Typography>
                    <Badge variant={value ? "success" : "destructive"}>
                        {value ? trueLabel : falseLabel}
                    </Badge>
                </div>
            </div>
            <Switch
                checked={value}
                onCheckedChange={handleToggle}
                disabled={isToggling}
                className="data-[state=checked]:bg-green-600"
            />
        </div>
    );
}

interface QuickStatsProps {
    stats: Array<{
        label: string;
        value: string | number;
        icon: React.ReactNode;
        color: string;
        trend?: {
            value: number;
            isPositive: boolean;
        };
    }>;
}

export function QuickStats({ stats }: QuickStatsProps) {
    return (
        <div className="grid grid-cols-2 gap-3">
            {stats.map((stat, index) => (
                <div key={index} className="p-4 rounded-xl bg-linear-to-br from-slate-800/70 to-slate-900/50 border border-slate-700/50 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
                    <div className="flex items-center justify-between mb-3">
                        <div className={`p-2 rounded-lg ${stat.color}`}>
                            {stat.icon}
                        </div>
                        {stat.trend && (
                            <div className={`flex items-center gap-1 text-xs px-2 py-1 rounded-full ${stat.trend.isPositive
                                ? "bg-green-500/10 text-green-400"
                                : "bg-red-500/10 text-red-400"
                                }`}>
                                {stat.trend.isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                                {stat.trend.value}%
                            </div>
                        )}
                    </div>
                    <div>
                        <Typography className="text-2xl font-bold mb-1">{stat.value}</Typography>
                        <Typography className="text-xs text-slate-400">{stat.label}</Typography>
                    </div>
                </div>
            ))}
        </div>
    );
}

interface ImageGalleryProps {
    images: Array<{
        image_url: string;
        color?: string;
        is_primary?: boolean;
    }>;
    productName: string;
}

export function ImageGallery({ images, productName }: ImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    if (images.length === 0) {
        return (
            <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900/50 border border-slate-700/50 flex items-center justify-center">
                <Package className="h-16 w-16 text-slate-600" />
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Imagen principal */}
            <div className="relative aspect-square rounded-xl overflow-hidden bg-slate-900/50 border border-slate-700/50 shadow-lg group">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                <img
                    src={images[selectedImage]?.image_url || "/placeholder.svg"}
                    alt={`${productName} - ${selectedImage + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Indicador de imagen principal */}
                {images[selectedImage]?.is_primary && (
                    <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-linear-to-r from-blue-500 to-purple-500 shadow-lg z-20">
                        <span className="text-xs font-bold text-white">Principal</span>
                    </div>
                )}

                {/* Controles de navegación */}
                {images.length > 1 && (
                    <>
                        <Button
                            size="sm"
                            variant="outline"
                            className="absolute left-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-black/50 border-white/20 hover:bg-black/70 z-20"
                            onClick={() => setSelectedImage(selectedImage > 0 ? selectedImage - 1 : images.length - 1)}
                        >
                            ←
                        </Button>
                        <Button
                            size="sm"
                            variant="outline"
                            className="absolute right-3 top-1/2 -translate-y-1/2 h-8 w-8 p-0 bg-black/50 border-white/20 hover:bg-black/70 z-20"
                            onClick={() => setSelectedImage(selectedImage < images.length - 1 ? selectedImage + 1 : 0)}
                        >
                            →
                        </Button>
                    </>
                )}

                {/* Contador de imágenes */}
                <div className="absolute bottom-3 right-3 px-3 py-1 rounded-full bg-black/70 backdrop-blur-sm z-20">
                    <Typography className="text-xs text-white font-medium">
                        {selectedImage + 1} / {images.length}
                    </Typography>
                </div>
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2">
                    {images.map((img, idx) => (
                        <div
                            key={idx}
                            className={`relative aspect-square rounded-lg overflow-hidden cursor-pointer border-2 transition-all duration-300 hover:scale-105 ${idx === selectedImage
                                ? "border-blue-500 shadow-lg shadow-blue-500/30"
                                : "border-slate-700/50 hover:border-slate-600"
                                }`}
                            onClick={() => setSelectedImage(idx)}
                        >
                            <img
                                src={img.image_url}
                                alt={`${productName} - ${idx + 1}`}
                                className="w-full h-full object-cover"
                            />
                            {img.is_primary && (
                                <div className="absolute inset-0 bg-blue-500/20 flex items-center justify-center">
                                    <div className="w-2 h-2 rounded-full bg-blue-400 shadow-lg" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}