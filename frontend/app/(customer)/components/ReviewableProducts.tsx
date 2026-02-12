"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Send, X, Upload } from "lucide-react";
import Image from "next/image";
import { createPortal } from "react-dom";
import { useUserSafe } from "@/app/(auth)/hooks/useUserSafe";
import { getReviewableProducts, createReview, type ReviewableProduct } from "../services/reviewApi";
import { ErrorsHandler } from "@/app/errors/errorsHandler";

export default function ReviewableProducts() {
    const { userProfile } = useUserSafe();
    const [products, setProducts] = useState<ReviewableProduct[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedProduct, setSelectedProduct] = useState<ReviewableProduct | null>(null);
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [mounted, setMounted] = useState(false);
    const [selectedImages, setSelectedImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isUploadingImages, setIsUploadingImages] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (userProfile) {
            loadReviewableProducts();
        }
    }, [userProfile]);

    const loadReviewableProducts = async () => {
        if (!userProfile) return;

        try {
            setIsLoading(true);
            const data = await getReviewableProducts(userProfile.id);
            setProducts(data);
        } catch (error: unknown) {
            
            ErrorsHandler.showError("Error", "No se pudieron cargar los productos para reseñar");
        } finally {
            setIsLoading(false);
        }
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        
        // Validar cantidad máxima de imágenes (5)
        if (selectedImages.length + files.length > 5) {
            ErrorsHandler.showError("Error", "Máximo 5 imágenes por reseña");
            return;
        }

        // Validar tipo de archivo
        const validFiles = files.filter(file => {
            if (!file.type.startsWith('image/')) {
                ErrorsHandler.showError("Error", `${file.name} no es una imagen válida`);
                return false;
            }
            // Validar tamaño (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                ErrorsHandler.showError("Error", `${file.name} es muy grande (máx. 5MB)`);
                return false;
            }
            return true;
        });

        if (validFiles.length === 0) return;

        // Crear previews
        const newPreviews: string[] = [];
        validFiles.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result as string);
                if (newPreviews.length === validFiles.length) {
                    setImagePreviews([...imagePreviews, ...newPreviews]);
                }
            };
            reader.readAsDataURL(file);
        });

        setSelectedImages([...selectedImages, ...validFiles]);
    };

    const removeImage = (index: number) => {
        setSelectedImages(selectedImages.filter((_, i) => i !== index));
        setImagePreviews(imagePreviews.filter((_, i) => i !== index));
    };

    const uploadImagesToCloudinary = async (files: File[]): Promise<string[]> => {
        const uploadPromises = files.map(async (file) => {
            const formData = new FormData();
            formData.append('file', file);

            try {
                const response = await fetch('/api/upload-review-image', {
                    method: 'POST',
                    body: formData,
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || 'Error al subir imagen');
                }

                const data = await response.json();
                return data.secure_url;
            } catch (error) {
                
                throw error;
            }
        });

        return Promise.all(uploadPromises);
    };

    const handleSubmitReview = async () => {
        if (!userProfile || !selectedProduct || rating === 0) return;

        try {
            setIsSubmitting(true);
            
            // Subir imágenes a Cloudinary si hay alguna
            let imageUrls: string[] = [];
            if (selectedImages.length > 0) {
                try {
                    setIsUploadingImages(true);
                    imageUrls = await uploadImagesToCloudinary(selectedImages);
                } catch (error) {
                    ErrorsHandler.showError("Error", "Error al subir las imágenes. La reseña se enviará sin imágenes.");
                    
                } finally {
                    setIsUploadingImages(false);
                }
            }

            await createReview({
                user_id: userProfile.id,
                product_id: selectedProduct.product_id,
                order_id: selectedProduct.order_id,
                rating,
                comment: comment.trim() || undefined,
                images: imageUrls.length > 0 ? imageUrls : undefined,
            });

            ErrorsHandler.showSuccess("¡Reseña enviada!", "Gracias por tu opinión");

            // Eliminar el producto de la lista
            setProducts(products.filter(p =>
                !(p.product_id === selectedProduct.product_id && p.order_id === selectedProduct.order_id)
            ));

            // Cerrar modal y limpiar estados
            setSelectedProduct(null);
            setRating(0);
            setComment("");
            setSelectedImages([]);
            setImagePreviews([]);
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "No se pudo enviar la reseña";
            ErrorsHandler.showError("Error", message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!userProfile) return null;

    if (isLoading) {
        return (
            <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto"></div>
                <p className="text-slate-400 mt-4">Cargando productos...</p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <div className="p-12 text-center rounded-2xl bg-slate-900/50 border border-slate-700/50">
                <Star className="w-16 h-16 text-slate-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">
                    No hay productos para reseñar
                </h3>
                <p className="text-slate-400">
                    Una vez que tus pedidos sean entregados, podrás dejar reseñas aquí
                </p>
            </div>
        );
    }

    return (
        <>
            <div className="space-y-4">
                <div className="relative">
                    {/* Fondo decorativo con gradiente */}
                    <div className="absolute inset-0 bg-linear-to-r from-yellow-500/5 via-amber-500/3 to-orange-500/5 rounded-2xl blur-2xl" />
                    
                    <div className="relative flex items-center justify-between p-6 rounded-2xl border border-slate-700/40 bg-linear-to-r from-slate-900/60 via-slate-800/40 to-slate-900/60 backdrop-blur-sm">
                        <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-linear-to-br from-yellow-500/20 to-amber-600/15 border border-yellow-500/30">
                                <MessageSquare className="w-6 h-6 text-yellow-400" />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold bg-linear-to-r from-yellow-200 via-amber-200 to-orange-200 bg-clip-text text-transparent">
                                    Productos para Reseñar
                                </h2>
                                <p className="text-xs text-slate-400 mt-1">Comparte tu experiencia con nuestros productos</p>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-linear-to-r from-yellow-500/30 to-amber-600/25 border border-yellow-500/40 rounded-full">
                            <p className="text-lg font-bold text-yellow-300">{products.length}</p>
                        </div>
                    </div>
                </div>

                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product, idx) => (
                        <motion.div
                            key={`${product.product_id}-${product.order_id}`}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            className="group relative rounded-xl overflow-hidden"
                        >
                            {/* Efectos de fondo */}
                            <div className="absolute inset-0 bg-linear-to-br from-yellow-500/10 via-amber-500/5 to-orange-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            <div className="absolute -inset-1 bg-linear-to-r from-yellow-500/20 to-orange-500/20 rounded-xl blur opacity-0 group-hover:opacity-75 transition-opacity duration-300 -z-10" />
                            
                            <div className="relative p-5 rounded-xl border border-slate-700/50 group-hover:border-yellow-500/50 bg-linear-to-br from-slate-900/80 via-slate-800/50 to-slate-900/60 backdrop-blur-sm transition-all duration-300 h-full flex flex-col">
                                {/* Border top gradient */}
                                <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-yellow-400/40 to-transparent" />
                                
                                <div className="flex gap-4 flex-1 flex-col">
                                    {product.product_image && (
                                        <div className="relative w-full h-32 shrink-0 rounded-lg overflow-hidden bg-slate-800 border border-slate-700/50">
                                            <Image
                                                src={product.product_image}
                                                alt={product.product_name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
                                        </div>
                                    )}

                                    <div className="flex-1">
                                        <h3 className="font-semibold text-slate-100 mb-2 line-clamp-2 group-hover:text-yellow-200 transition-colors">
                                            {product.product_name}
                                        </h3>
                                        <div className="space-y-1">
                                            <p className="text-xs text-slate-400 font-medium">
                                                <span className="text-yellow-400/70">Color:</span> {product.color_code}
                                            </p>
                                            <p className="text-xs text-slate-400 font-medium">
                                                <span className="text-yellow-400/70">Talla:</span> {product.size}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-2">
                                                Orden <span className="text-amber-400/80 font-semibold">#{product.order_id}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedProduct(product)}
                                    className="mt-4 w-full py-3 px-4 bg-linear-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-yellow-500/20 group-hover:shadow-xl hover:scale-105 active:scale-95"
                                >
                                    <Star className="w-4 h-4 fill-current" />
                                    Dejar Reseña
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>

            {/* Modal de reseña */}
            {mounted && selectedProduct && createPortal(
                <AnimatePresence>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-slate-950/50 backdrop-blur-sm z-9999 flex items-center justify-center p-4"
                        onClick={() => {
                            setSelectedProduct(null);
                            setRating(0);
                            setComment("");
                            setSelectedImages([]);
                            setImagePreviews([]);
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 rounded-2xl border border-yellow-500/30 max-w-lg w-full p-6 shadow-2xl relative z-10000 overflow-y-auto max-h-[90vh]"
                        >
                            {/* Efectos de fondo */}
                            <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-yellow-400/50 to-transparent" />
                            <div className="absolute top-0 right-0 w-96 h-96 bg-linear-to-br from-yellow-500/5 via-amber-500/5 to-transparent rounded-full blur-3xl" />
                            
                            <div className="relative">
                                <div className="flex items-center justify-between mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold bg-linear-to-r from-yellow-200 to-amber-200 bg-clip-text text-transparent">Dejar Reseña</h3>
                                        <p className="text-sm text-slate-400 mt-1">Cuéntanos tu experiencia</p>
                                    </div>
                                    <button
                                        onClick={() => {
                                            setSelectedProduct(null);
                                            setRating(0);
                                            setComment("");
                                            setSelectedImages([]);
                                            setImagePreviews([]);
                                        }}
                                        className="p-2 hover:bg-yellow-500/20 rounded-lg transition-all duration-300 text-yellow-400/80 hover:text-yellow-300"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                </div>

                                <div className="mb-7 p-4 rounded-xl bg-linear-to-r from-yellow-500/10 to-amber-600/10 border border-yellow-500/20">
                                    <div className="flex gap-4">
                                        {selectedProduct.product_image && (
                                            <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-800 border border-yellow-500/30">
                                                <Image
                                                    src={selectedProduct.product_image}
                                                    alt={selectedProduct.product_name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-yellow-100 mb-2 line-clamp-2">
                                                {selectedProduct.product_name}
                                            </h4>
                                            <div className="space-y-1">
                                                <p className="text-sm text-slate-400">
                                                    <span className="text-yellow-400/70 font-medium">Color:</span> {selectedProduct.color_code}
                                                </p>
                                                <p className="text-sm text-slate-400">
                                                    <span className="text-yellow-400/70 font-medium">Talla:</span> {selectedProduct.size}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Rating */}
                                <div className="mb-7">
                                    <label className="block text-sm font-semibold text-slate-200 mb-4 tracking-wide">
                                        Calificación <span className="text-yellow-400">*</span>
                                    </label>
                                    <div className="flex gap-3 p-4 bg-slate-800/50 rounded-lg border border-slate-700/50">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <motion.button
                                                key={star}
                                                whileHover={{ scale: 1.15 }}
                                                whileTap={{ scale: 0.95 }}
                                                type="button"
                                                onClick={() => setRating(star)}
                                                onMouseEnter={() => setHoverRating(star)}
                                                onMouseLeave={() => setHoverRating(0)}
                                                className="transition-all"
                                            >
                                                <Star
                                                    className={`w-10 h-10 transition-all ${
                                                        star <= (hoverRating || rating)
                                                            ? "fill-yellow-400 text-yellow-400 drop-shadow-lg drop-shadow-yellow-500/50"
                                                            : "text-slate-500 hover:text-slate-400"
                                                    }`}
                                                />
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>

                                {/* Comment */}
                                <div className="mb-7">
                                    <label className="block text-sm font-semibold text-slate-200 mb-3 tracking-wide">
                                        Comentario <span className="text-slate-400 font-normal">(opcional)</span>
                                    </label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder="Cuéntanos tu experiencia con este producto..."
                                        rows={4}
                                        className="w-full px-4 py-3 bg-slate-800/60 border border-slate-700/60 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-yellow-500/50 focus:bg-slate-800 transition-all duration-300 resize-none"
                                        maxLength={500}
                                    />
                                    <div className="flex justify-between items-center mt-2">
                                        <p className="text-xs text-slate-500">
                                            Sé específico y honesto
                                        </p>
                                        <p className="text-xs font-medium text-yellow-400/70">
                                            {comment.length}/500
                                        </p>
                                    </div>
                                </div>

                                {/* Imágenes */}
                                <div className="mb-7">
                                    <label className="block text-sm font-semibold text-slate-200 mb-3 tracking-wide">
                                        Imágenes <span className="text-slate-400 font-normal">(opcional - máx. 5)</span>
                                    </label>
                                    
                                    {/* Botón para seleccionar imágenes */}
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        onChange={handleImageSelect}
                                        className="hidden"
                                    />
                                    
                                    <motion.button
                                        whileHover={{ scale: selectedImages.length >= 5 ? 1 : 1.02 }}
                                        type="button"
                                        onClick={() => fileInputRef.current?.click()}
                                        disabled={selectedImages.length >= 5}
                                        className="w-full py-4 px-4 border-2 border-dashed border-yellow-500/40 hover:border-yellow-400 rounded-lg transition-all duration-300 flex items-center justify-center gap-3 text-slate-400 hover:text-yellow-300 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-yellow-500/40 disabled:hover:text-slate-400 bg-yellow-500/5"
                                    >
                                        <Upload className="w-5 h-5" />
                                        <span className="text-sm font-medium">
                                            {selectedImages.length >= 5 ? '✓ Límite alcanzado' : `Seleccionar imágenes (${selectedImages.length}/5)`}
                                        </span>
                                    </motion.button>
                                    
                                    <p className="text-xs text-slate-500 mt-2 text-center">
                                        JPG, PNG, WebP • Máx. 5MB cada una
                                    </p>

                                    {/* Preview de imágenes */}
                                    {imagePreviews.length > 0 && (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="mt-5 grid grid-cols-3 gap-3"
                                        >
                                            {imagePreviews.map((preview, index) => (
                                                <motion.div
                                                    key={index}
                                                    initial={{ opacity: 0, scale: 0.8 }}
                                                    animate={{ opacity: 1, scale: 1 }}
                                                    className="relative group aspect-square rounded-lg overflow-hidden bg-slate-800 border border-slate-700/50 ring-1 ring-yellow-500/20"
                                                >
                                                    <Image
                                                        src={preview}
                                                        alt={`Preview ${index + 1}`}
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <motion.button
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                        onClick={() => removeImage(index)}
                                                        className="absolute top-2 right-2 p-1.5 bg-red-500/80 hover:bg-red-600 rounded-full transition-all opacity-0 group-hover:opacity-100 shadow-lg"
                                                    >
                                                        <X className="w-3 h-3 text-white" />
                                                    </motion.button>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    )}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-3 pt-6 border-t border-slate-700/50">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={() => {
                                            setSelectedProduct(null);
                                            setRating(0);
                                            setComment("");
                                            setSelectedImages([]);
                                            setImagePreviews([]);
                                        }}
                                        className="flex-1 py-3 px-4 bg-slate-800/60 hover:bg-slate-700/80 text-slate-300 hover:text-slate-100 rounded-lg font-semibold transition-all duration-300 border border-slate-700/50"
                                        disabled={isSubmitting}
                                    >
                                        Cancelar
                                    </motion.button>
                                    <motion.button
                                        whileHover={{ scale: rating === 0 ? 1 : 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        onClick={handleSubmitReview}
                                        disabled={rating === 0 || isSubmitting || isUploadingImages}
                                        className="flex-1 py-3 px-4 bg-linear-to-r from-yellow-500 to-amber-600 hover:from-yellow-400 hover:to-amber-500 text-slate-950 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-yellow-500/30"
                                    >
                                        {isSubmitting || isUploadingImages ? (
                                            <>
                                                <motion.div
                                                    animate={{ rotate: 360 }}
                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                    className="rounded-full h-5 w-5 border-2 border-slate-950 border-t-transparent"
                                                />
                                                {isUploadingImages && <span className="text-sm">Subiendo...</span>}
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-4 h-4" />
                                                Enviar Reseña
                                            </>
                                        )}
                                    </motion.button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
