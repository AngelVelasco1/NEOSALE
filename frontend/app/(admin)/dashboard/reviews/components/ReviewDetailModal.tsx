"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { CheckCircle, XCircle, Trash2, Star, User, Package, Calendar, ShoppingBag } from "lucide-react";

interface Review {
  id: number;
  rating: number;
  comment: string | null;
  active: boolean;
  created_at: Date;
  updated_at: Date | null;
  user: {
    id: number;
    name: string | null;
    email: string;
    image: string | null;
  };
  product: {
    id: number;
    name: string;
    image_url: string | null;
  };
  order: {
    id: number;
    status: string;
    created_at: Date;
  } | null;
  images: Array<{
    id: number;
    image_url: string;
  }>;
}

interface ReviewDetailModalProps {
  review: Review;
  onClose: () => void;
  onToggleStatus: (id: number) => void;
  onDelete: (id: number) => void;
  isLoading: boolean;
}

export default function ReviewDetailModal({
  review,
  onClose,
  onToggleStatus,
  onDelete,
  isLoading,
}: ReviewDetailModalProps) {
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl border-slate-700/50 bg-slate-900 text-slate-100 shadow-2xl">
        <DialogHeader className="border-b border-slate-700/50 pb-4">
          <DialogTitle className="text-2xl font-bold bg-linear-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">Detalle de Reseña</DialogTitle>
        </DialogHeader>

        <div className="space-y-5 max-h-[70vh] overflow-y-auto pr-2">
          {/* Usuario */}
          <div className="flex items-center gap-4 rounded-xl bg-slate-800/50 p-4 border border-slate-700/50">
            {review.user.image ? (
              <Image
                src={review.user.image}
                alt={review.user.name || "Usuario"}
                width={60}
                height={60}
                className="rounded-full ring-2 ring-blue-500/30"
              />
            ) : (
              <div className="flex h-15 w-15 items-center justify-center rounded-full bg-linear-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                <User className="h-8 w-8 text-white" />
              </div>
            )}
            <div>
              <p className="text-lg font-semibold text-slate-100">{review.user.name || "Usuario"}</p>
              <p className="text-sm text-slate-400">{review.user.email}</p>
            </div>
          </div>

          {/* Producto */}
          <div className="flex items-center gap-4 rounded-xl bg-slate-800/50 p-4 border border-slate-700/50">
            {review.product.image_url ? (
              <Image
                src={review.product.image_url}
                alt={review.product.name}
                width={80}
                height={80}
                className="rounded-xl object-cover ring-2 ring-slate-700"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-slate-800 border border-slate-700">
                <Package className="h-10 w-10 text-slate-500" />
              </div>
            )}
            <div className="flex-1">
              <p className="text-lg font-semibold text-slate-100">{review.product.name}</p>
              {review.order && (
                <div className="mt-2 flex items-center gap-2 text-sm text-slate-400">
                  <ShoppingBag className="h-4 w-4" />
                  <span>Orden #{review.order.id}</span>
                  <Badge className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    {review.order.status}
                  </Badge>
                </div>
              )}
            </div>
          </div>

          {/* Rating y Estado */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl bg-slate-800/50 p-4 border border-slate-700/50">
              <p className="mb-3 text-sm font-medium text-slate-400">Calificación</p>
              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-6 w-6 transition-all ${
                      i < review.rating
                        ? "fill-amber-400 text-amber-400 drop-shadow-lg drop-shadow-amber-400/50"
                        : "text-slate-700"
                    }`}
                  />
                ))}
                <span className="ml-2 text-2xl font-bold text-slate-100">{review.rating}/5</span>
              </div>
            </div>

            <div className="rounded-xl bg-slate-800/50 p-4 border border-slate-700/50">
              <p className="mb-3 text-sm font-medium text-slate-400">Estado</p>
              <Badge
                className={`text-base font-semibold ${
                  review.active
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                }`}
              >
                {review.active ? "✓ Aprobada" : "⏱ Pendiente"}
              </Badge>
            </div>
          </div>

          {/* Comentario */}
          {review.comment && (
            <div className="rounded-xl bg-slate-800/50 p-4 border border-slate-700/50">
              <p className="mb-2 text-sm font-medium text-slate-400">Comentario</p>
              <p className="text-slate-100 leading-relaxed">{review.comment}</p>
            </div>
          )}

          {/* Imágenes */}
          {review.images.length > 0 && (
            <div className="rounded-xl bg-slate-800/50 p-4 border border-slate-700/50">
              <p className="mb-3 text-sm font-medium text-slate-400">
                Imágenes ({review.images.length})
              </p>
              <div className="grid grid-cols-4 gap-3">
                {review.images.map((img) => (
                  <Image
                    key={img.id}
                    src={img.image_url}
                    alt="Review"
                    width={150}
                    height={150}
                    className="rounded-lg object-cover ring-2 ring-slate-700 hover:ring-blue-500/50 transition-all cursor-pointer"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Fecha */}
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <Calendar className="h-4 w-4" />
            <span>
              Creada el {new Date(review.created_at).toLocaleString("es-ES")}
            </span>
          </div>

          {/* Acciones */}
          <div className="flex gap-3 pt-2">
            <Button
              onClick={() => {
                onToggleStatus(review.id);
                onClose();
              }}
              disabled={isLoading}
              className={
                review.active
                  ? "flex-1 bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 shadow-lg shadow-amber-500/10 transition-all"
                  : "flex-1 bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 shadow-lg shadow-emerald-500/10 transition-all"
              }
            >
              {review.active ? (
                <>
                  <XCircle className="mr-2 h-4 w-4" />
                  Desactivar
                </>
              ) : (
                <>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Aprobar
                </>
              )}
            </Button>
            <Button
              onClick={() => {
                onDelete(review.id);
                onClose();
              }}
              disabled={isLoading}
              variant="destructive"
              className="bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 shadow-lg shadow-rose-500/10 transition-all"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Eliminar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
