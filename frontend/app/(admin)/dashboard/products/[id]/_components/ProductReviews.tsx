"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Star, MessageSquare, ImageIcon, User, Calendar } from "lucide-react";
import { motion } from "framer-motion";

interface Review {
    id: number;
    rating: number;
    comment: string | null;
    created_at: string;
    user: {
        id: number;
        name: string;
        image: string | null;
    };
    product: {
        id: number;
        name: string;
    };
    images: Array<{
        id: number;
        image_url: string;
    }>;
}

interface ProductReviewsProps {
    productId: number;
}

export function ProductReviews({ productId }: ProductReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    useEffect(() => {
        fetchReviews();
    }, [productId]);

    const fetchReviews = async () => {
        try {
            setIsLoading(true);
            const backendUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
            const response = await fetch(
                `${backendUrl}/api/reviews/getReviews?productId=${productId}`,
                {
                    credentials: "include",
                }
            );

            if (!response.ok) {
                throw new Error("Error al cargar reseñas");
            }

            const data = await response.json();
            setReviews(data);
        } catch (error) {
            console.error("Error loading reviews:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-ES", {
            year: "numeric",
            month: "long",
            day: "numeric",
        });
    };

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-0.5">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 ${star <= rating
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-slate-600"
                            }`}
                    />
                ))}
            </div>
        );
    };

    const calculateAverageRating = () => {
        if (reviews.length === 0) return 0;
        const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
        return (sum / reviews.length).toFixed(1);
    };

    const getRatingDistribution = () => {
        const distribution = [0, 0, 0, 0, 0];
        reviews.forEach((review) => {
            distribution[review.rating - 1]++;
        });
        return distribution.reverse();
    };

    if (isLoading) {
        return (
            <section className="rounded-3xl bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 p-8">
                <div className="animate-pulse space-y-4">
                    <div className="h-8 bg-slate-700/50 rounded-lg w-48"></div>
                    <div className="space-y-3">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="h-32 bg-slate-700/30 rounded-xl"></div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    const avgRating = calculateAverageRating();
    const distribution = getRatingDistribution();

    return (
        <>
            <section className="rounded-3xl bg-linear-to-br from-slate-900/90 to-slate-800/90 backdrop-blur-xl border border-slate-700/50 p-8 shadow-2xl">
                <div className="flex items-center gap-3 mb-8">
                    <div className="p-3 rounded-xl bg-linear-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
                        <MessageSquare className="w-6 h-6 text-purple-400" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-bold text-slate-100">
                            Reseñas de Clientes
                        </h2>
                        <p className="text-slate-400 text-sm">
                            {reviews.length} {reviews.length === 1 ? "reseña" : "reseñas"}
                        </p>
                    </div>
                </div>

                {reviews.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-slate-800/50 border border-slate-700 mb-4">
                            <MessageSquare className="w-10 h-10 text-slate-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-300 mb-2">
                            Aún no hay reseñas
                        </h3>
                        <p className="text-slate-500">
                            Sé el primero en compartir tu opinión sobre este producto
                        </p>
                    </div>
                ) : (
                    <>
                        {/* Resumen de calificaciones */}
                        <div className="grid md:grid-cols-2 gap-6 mb-8 p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50">
                            {/* Promedio */}
                            <div className="flex flex-col items-center justify-center space-y-2">
                                <div className="text-6xl font-bold text-transparent bg-clip-text bg-linear-to-r from-yellow-400 to-orange-400">
                                    {avgRating}
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            className={`w-6 h-6 ${star <= Math.round(Number(avgRating))
                                                ? "fill-yellow-400 text-yellow-400"
                                                : "text-slate-600"
                                                }`}
                                        />
                                    ))}
                                </div>
                                <p className="text-slate-400 text-sm">
                                    Basado en {reviews.length}{" "}
                                    {reviews.length === 1 ? "reseña" : "reseñas"}
                                </p>
                            </div>

                            {/* Distribución */}
                            <div className="space-y-2">
                                {[5, 4, 3, 2, 1].map((stars, idx) => {
                                    const count = distribution[idx];
                                    const percentage =
                                        reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                                    return (
                                        <div key={stars} className="flex items-center gap-2">
                                            <span className="text-sm text-slate-400 w-6">
                                                {stars}★
                                            </span>
                                            <div className="flex-1 h-2 bg-slate-700/50 rounded-full overflow-hidden">
                                                <div
                                                    className="h-full bg-linear-to-r from-yellow-400 to-orange-400 rounded-full transition-all duration-500"
                                                    style={{ width: `${percentage}%` }}
                                                />
                                            </div>
                                            <span className="text-sm text-slate-500 w-8 text-right">
                                                {count}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Lista de reseñas */}
                        <div className="space-y-4">
                            {reviews.map((review, index) => (
                                <motion.div
                                    key={review.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className="p-6 rounded-2xl bg-slate-800/50 border border-slate-700/50 hover:border-purple-500/30 transition-all duration-300"
                                >
                                    {/* Header de la reseña */}
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-12 h-12 rounded-full overflow-hidden bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                                                {review.user.image ? (
                                                    <Image
                                                        src={review.user.image}
                                                        alt={review.user.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <User className="w-6 h-6 text-white" />
                                                )}
                                            </div>
                                            <div>
                                                <h4 className="font-semibold text-slate-200">
                                                    {review.user.name}
                                                </h4>
                                                <div className="flex items-center gap-2 text-xs text-slate-500">
                                                    <Calendar className="w-3 h-3" />
                                                    {formatDate(review.created_at)}
                                                </div>
                                            </div>
                                        </div>
                                        {renderStars(review.rating)}
                                    </div>

                                    {/* Comentario */}
                                    {review.comment && (
                                        <p className="text-slate-300 mb-4 leading-relaxed">
                                            {review.comment}
                                        </p>
                                    )}

                                    {/* Imágenes de la reseña */}
                                    {review.images && review.images.length > 0 && (
                                        <div className="flex flex-wrap gap-2">
                                            {review.images.map((img) => (
                                                <button
                                                    key={img.id}
                                                    onClick={() => setSelectedImage(img.image_url)}
                                                    className="relative w-20 h-20 rounded-lg overflow-hidden border-2 border-slate-700 hover:border-purple-500 transition-all duration-300 group"
                                                >
                                                    <Image
                                                        src={img.image_url}
                                                        alt="Imagen de reseña"
                                                        fill
                                                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                                                    />
                                                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300 flex items-center justify-center">
                                                        <ImageIcon className="w-5 h-5 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                        </div>
                    </>
                )}
            </section>

            {/* Modal de imagen ampliada */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="relative max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Image
                            src={selectedImage}
                            alt="Imagen ampliada"
                            width={1200}
                            height={800}
                            className="object-contain"
                        />
                        <button
                            onClick={() => setSelectedImage(null)}
                            className="absolute top-4 right-4 p-2 rounded-full bg-slate-900/80 hover:bg-slate-800 transition-colors"
                        >
                            <span className="text-white text-2xl leading-none">×</span>
                        </button>
                    </motion.div>
                </div>
            )}
        </>
    );
}
