"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, Send, X, Upload, ImageIcon } from "lucide-react";
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
            console.error("Error loading reviewable products:", error);
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
            formData.append('upload_preset', 'neosale_reviews'); // Necesitas crear este preset en Cloudinary
            formData.append('folder', 'neosale/reviews');

            try {
                const response = await fetch(
                    `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
                    {
                        method: 'POST',
                        body: formData,
                    }
                );

                if (!response.ok) {
                    throw new Error('Error al subir imagen');
                }

                const data = await response.json();
                return data.secure_url;
            } catch (error) {
                console.error('Error uploading image:', error);
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
                    console.error('Error uploading images:', error);
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
                <div className="flex items-center gap-3 mb-6">
                    <MessageSquare className="w-6 h-6 text-indigo-400" />
                    <h2 className="text-2xl font-bold text-slate-100">
                        Productos para Reseñar
                    </h2>
                    <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-sm font-medium">
                        {products.length}
                    </span>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {products.map((product) => (
                        <motion.div
                            key={`${product.product_id}-${product.order_id}`}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="group relative rounded-xl bg-slate-900/60 border border-slate-700/50 hover:border-indigo-500/50 transition-all duration-300 overflow-hidden"
                        >
                            <div className="p-4">
                                <div className="flex gap-4">
                                    {product.product_image && (
                                        <div className="relative w-20 h-20 shrink-0 rounded-lg overflow-hidden bg-slate-800">
                                            <Image
                                                src={product.product_image}
                                                alt={product.product_name}
                                                fill
                                                className="object-cover"
                                            />
                                        </div>
                                    )}

                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-semibold text-slate-100 mb-1 truncate">
                                            {product.product_name}
                                        </h3>
                                        <p className="text-sm text-slate-400 mb-2">
                                            {product.color_code} | {product.size}
                                        </p>
                                        <p className="text-xs text-slate-500">
                                            Orden #{product.order_id}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => setSelectedProduct(product)}
                                    className="mt-4 w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Star className="w-4 h-4" />
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
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-9999 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="bg-slate-900 rounded-2xl border border-slate-700 max-w-lg w-full p-6 shadow-2xl relative z-10000"
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-slate-100">Dejar Reseña</h3>
                                <button
                                    onClick={() => {
                                        setSelectedProduct(null);
                                        setRating(0);
                                        setComment("");
                                        setSelectedImages([]);
                                        setImagePreviews([]);
                                    }}
                                    className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
                                >
                                    <X className="w-5 h-5 text-slate-400" />
                                </button>
                            </div>

                            <div className="flex gap-4 mb-6">
                                {selectedProduct.product_image && (
                                    <div className="relative w-24 h-24 shrink-0 rounded-lg overflow-hidden bg-slate-800">
                                        <Image
                                            src={selectedProduct.product_image}
                                            alt={selectedProduct.product_name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                                <div>
                                    <h4 className="font-semibold text-slate-100 mb-1">
                                        {selectedProduct.product_name}
                                    </h4>
                                    <p className="text-sm text-slate-400">
                                        {selectedProduct.color_code} | {selectedProduct.size}
                                    </p>
                                </div>
                            </div>

                            {/* Rating */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-300 mb-3">
                                    Calificación *
                                </label>
                                <div className="flex gap-2">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <button
                                            key={star}
                                            type="button"
                                            onClick={() => setRating(star)}
                                            onMouseEnter={() => setHoverRating(star)}
                                            onMouseLeave={() => setHoverRating(0)}
                                            className="transition-transform hover:scale-110"
                                        >
                                            <Star
                                                className={`w-8 h-8 ${star <= (hoverRating || rating)
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "text-slate-600"
                                                    }`}
                                            />
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Comment */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-300 mb-2">
                                    Comentario (opcional)
                                </label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Cuéntanos tu experiencia con este producto..."
                                    rows={4}
                                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors resize-none"
                                    maxLength={500}
                                />
                                <p className="text-xs text-slate-500 mt-1">
                                    {comment.length}/500 caracteres
                                </p>
                            </div>

                            {/* Imágenes */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-slate-300 mb-3">
                                    Imágenes (opcional - máx. 5)
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
                                
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={selectedImages.length >= 5}
                                    className="w-full py-3 px-4 border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-lg transition-colors flex items-center justify-center gap-2 text-slate-400 hover:text-indigo-400 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-slate-700 disabled:hover:text-slate-400"
                                >
                                    <Upload className="w-5 h-5" />
                                    <span className="text-sm font-medium">
                                        {selectedImages.length >= 5 ? 'Límite alcanzado' : 'Seleccionar imágenes'}
                                    </span>
                                </button>
                                
                                <p className="text-xs text-slate-500 mt-2">
                                    Formatos: JPG, PNG, WebP (máx. 5MB cada una)
                                </p>

                                {/* Preview de imágenes */}
                                {imagePreviews.length > 0 && (
                                    <div className="mt-4 grid grid-cols-3 gap-3">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group aspect-square rounded-lg overflow-hidden bg-slate-800">
                                                <Image
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <button
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-1 right-1 p-1.5 bg-red-500/90 hover:bg-red-600 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                                                >
                                                    <X className="w-3 h-3 text-white" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setSelectedProduct(null);
                                        setRating(0);
                                        setComment("");
                                        setSelectedImages([]);
                                        setImagePreviews([]);
                                    }}
                                    className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg font-medium transition-colors"
                                    disabled={isSubmitting}
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleSubmitReview}
                                    disabled={rating === 0 || isSubmitting || isUploadingImages}
                                    className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting || isUploadingImages ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            {isUploadingImages && <span className="text-sm">Subiendo imágenes...</span>}
                                        </>
                                    ) : (
                                        <>
                                            <Send className="w-4 h-4" />
                                            Enviar Reseña
                                        </>
                                    )}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </AnimatePresence>,
                document.body
            )}
        </>
    );
}
