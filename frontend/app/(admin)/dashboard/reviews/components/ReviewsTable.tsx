"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Trash2,
  Star,
  Eye,
  User,
  Package,
  MessageSquare,
} from "lucide-react";
import { toggleReviewStatus } from "../../../actions/reviews/toggleReviewStatus";
import { deleteReview } from "../../../actions/reviews/deleteReview";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import ReviewDetailModal from "./ReviewDetailModal";

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

interface ReviewsTableProps {
  reviews: Review[];
}

export default function ReviewsTable({ reviews }: ReviewsTableProps) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);

  const handleToggleStatus = async (reviewId: number) => {
    setLoadingId(reviewId);
    const result = await toggleReviewStatus(reviewId);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setLoadingId(null);
  };

  const handleDelete = async (reviewId: number) => {
    if (!confirm("¿Estás seguro de que deseas eliminar esta reseña?")) {
      return;
    }

    setLoadingId(reviewId);
    const result = await deleteReview(reviewId);

    if (result.success) {
      toast.success(result.message);
      router.refresh();
    } else {
      toast.error(result.error);
    }
    setLoadingId(null);
  };

  if (reviews.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 rounded-3xl border border-slate-200/70 dark:border-slate-800/60 bg-white/95 dark:bg-slate-950/85 backdrop-blur-xl">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-100 to-amber-100/80 text-orange-400 shadow-sm dark:from-slate-800 dark:to-slate-700/80 dark:text-orange-200 mb-4">
          <MessageSquare className="h-10 w-10" />
        </div>
        <p className="text-slate-600 dark:text-slate-400 font-semibold text-base">No se encontraron reseñas</p>
        <p className="text-xs text-slate-500 dark:text-slate-500 mt-1">Intenta ajustar tus filtros o criterios de búsqueda</p>
      </div>
    );
  }

  return (
    <>
      <div className="group/table relative overflow-hidden rounded-3xl border border-slate-200/70 dark:border-slate-800/60 bg-white/95 dark:bg-slate-950/85 backdrop-blur-xl shadow-lg shadow-orange-100/40 dark:shadow-orange-950/40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -right-10 h-48 w-48 rounded-full bg-orange-500/15 blur-3xl" />
          <div className="absolute -bottom-20 -left-12 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="absolute inset-0 opacity-[0.07] bg-[linear-gradient(120deg,rgba(15,23,42,0.2)_1px,transparent_1px)] bg-size-[160px_160px]" />
        </div>

        <div className="relative flex flex-col gap-4 border-b border-slate-200/60 px-6 py-5 dark:border-slate-800/70 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-500/10 text-orange-600 dark:text-orange-200">
              <MessageSquare className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-700 dark:text-slate-300">
                Reseñas de productos
              </p>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">
                {reviews.length} reseña{reviews.length === 1 ? "" : "s"} en la vista actual
              </p>
            </div>
          </div>
        </div>

        <div className="relative overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-white via-slate-50/60 to-white dark:from-slate-900/80 dark:via-orange-950/20 dark:to-slate-900/80 border-b border-slate-200/80 dark:border-slate-800/60">
                <TableHead className="uppercase whitespace-nowrap font-semibold text-slate-500 dark:text-slate-300 text-[11px] tracking-[0.25em] leading-none py-4 px-4 first:pl-6">Usuario</TableHead>
                <TableHead className="uppercase whitespace-nowrap font-semibold text-slate-500 dark:text-slate-300 text-[11px] tracking-[0.25em] leading-none py-4 px-4">Producto</TableHead>
                <TableHead className="uppercase whitespace-nowrap font-semibold text-slate-500 dark:text-slate-300 text-[11px] tracking-[0.25em] leading-none py-4 px-4">Rating</TableHead>
                <TableHead className="uppercase whitespace-nowrap font-semibold text-slate-500 dark:text-slate-300 text-[11px] tracking-[0.25em] leading-none py-4 px-4">Comentario</TableHead>
                <TableHead className="uppercase whitespace-nowrap font-semibold text-slate-500 dark:text-slate-300 text-[11px] tracking-[0.25em] leading-none py-4 px-4">Estado</TableHead>
                <TableHead className="uppercase whitespace-nowrap font-semibold text-slate-500 dark:text-slate-300 text-[11px] tracking-[0.25em] leading-none py-4 px-4">Fecha</TableHead>
                <TableHead className="text-right uppercase whitespace-nowrap font-semibold text-slate-500 dark:text-slate-300 text-[11px] tracking-[0.25em] leading-none py-4 px-4 last:pr-6">
                  Acciones
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
            {reviews.map((review, index) => (
              <TableRow
                key={review.id}
                className="group/row border-b border-slate-100/60 dark:border-slate-900/40 transition-all duration-300 odd:bg-white even:bg-slate-50/70 dark:odd:bg-transparent dark:even:bg-slate-950/20 hover:bg-gradient-to-r hover:from-white hover:via-orange-50/40 hover:to-white dark:hover:from-slate-900/60 dark:hover:via-orange-950/20 dark:hover:to-slate-900/60"
                style={{ animationDelay: `${index * 20}ms` }}
              >
                <TableCell className="py-3.5 px-4 first:pl-6">
                  <div className="flex items-center gap-3">
                    {review.user.image ? (
                      <Image
                        src={review.user.image}
                        alt={review.user.name || "Usuario"}
                        width={40}
                        height={40}
                        className="rounded-full ring-2 ring-slate-200 dark:ring-slate-700"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-100">
                        {review.user.name || "Usuario"}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {review.user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  <div className="flex items-center gap-3">
                    {review.product.image_url ? (
                      <Image
                        src={review.product.image_url}
                        alt={review.product.name}
                        width={40}
                        height={40}
                        className="rounded-lg object-cover ring-2 h-10 w-10 ring-slate-200 dark:ring-slate-700"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100 border border-slate-200 dark:bg-slate-800 dark:border-slate-700">
                        <Package className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                      </div>
                    )}
                    <p className="max-w-[200px] truncate text-slate-700 dark:text-slate-100 font-medium">
                      {review.product.name}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  <div className="flex items-center gap-1.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 transition-colors ${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-300 dark:text-slate-700"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
                      ({review.rating})
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  <p className="max-w-[300px] truncate text-sm text-slate-600 dark:text-slate-300">
                    {review.comment || "Sin comentario"}
                  </p>
                </TableCell>
                <TableCell className="py-3.5 px-4">
                  <Badge
                    className={
                      review.active
                        ? "bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 border border-emerald-500/30 font-medium dark:bg-emerald-500/20 dark:text-emerald-400 dark:border-emerald-500/30"
                        : "bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 border border-amber-500/30 font-medium dark:bg-amber-500/20 dark:text-amber-400 dark:border-amber-500/30"
                    }
                  >
                    {review.active ? "Aprobada" : "Pendiente"}
                  </Badge>
                </TableCell>
                <TableCell className="py-3.5 px-4 text-sm text-slate-600 dark:text-slate-400 font-medium">
                  {new Date(review.created_at).toLocaleDateString("es-ES")}
                </TableCell>
                <TableCell className="py-3.5 px-4 last:pr-6">
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedReview(review)}
                      className="h-8 w-8 p-0 text-blue-600 hover:bg-blue-500/10 hover:text-blue-700 transition-all dark:text-blue-400 dark:hover:bg-blue-500/20 dark:hover:text-blue-300"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleToggleStatus(review.id)}
                      disabled={loadingId === review.id}
                      className={
                        review.active
                          ? "h-8 w-8 p-0 text-amber-600 hover:bg-amber-500/10 hover:text-amber-700 transition-all dark:text-amber-400 dark:hover:bg-amber-500/20 dark:hover:text-amber-300"
                          : "h-8 w-8 p-0 text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 transition-all dark:text-emerald-400 dark:hover:bg-emerald-500/20 dark:hover:text-emerald-300"
                      }
                    >
                      {review.active ? (
                        <XCircle className="h-4 w-4" />
                      ) : (
                        <CheckCircle className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(review.id)}
                      disabled={loadingId === review.id}
                      className="h-8 w-8 p-0 text-rose-600 hover:bg-rose-500/10 hover:text-rose-700 transition-all dark:text-rose-400 dark:hover:bg-rose-500/20 dark:hover:text-rose-300"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table></div>
      </div>

      {selectedReview && (
        <ReviewDetailModal
          review={selectedReview}
          onClose={() => setSelectedReview(null)}
          onToggleStatus={handleToggleStatus}
          onDelete={handleDelete}
          isLoading={loadingId === selectedReview.id}
        />
      )}
    </>
  );
}
