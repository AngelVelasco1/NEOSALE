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
      <div className="flex flex-col items-center justify-center py-16">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-800/50 mb-4">
          <MessageSquare className="h-10 w-10 text-slate-500" />
        </div>
        <p className="text-slate-400 text-lg">No se encontraron reseñas</p>
      </div>
    );
  }

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-slate-700/50">
        <Table>
          <TableHeader>
            <TableRow className="border-slate-700/50 hover:bg-slate-800/50 bg-slate-800/30">
              <TableHead className="text-slate-300 font-semibold">Usuario</TableHead>
              <TableHead className="text-slate-300 font-semibold">Producto</TableHead>
              <TableHead className="text-slate-300 font-semibold">Rating</TableHead>
              <TableHead className="text-slate-300 font-semibold">Comentario</TableHead>
              <TableHead className="text-slate-300 font-semibold">Estado</TableHead>
              <TableHead className="text-slate-300 font-semibold">Fecha</TableHead>
              <TableHead className="text-right text-slate-300 font-semibold">
                Acciones
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow
                key={review.id}
                className="border-slate-700/50 hover:bg-slate-800/50 transition-colors"
              >
                <TableCell>
                  <div className="flex items-center gap-3">
                    {review.user.image ? (
                      <Image
                        src={review.user.image}
                        alt={review.user.name || "Usuario"}
                        width={35}
                        height={35}
                        className="rounded-full ring-2 ring-slate-700"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
                        <User className="h-5 w-5 text-white" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-100">
                        {review.user.name || "Usuario"}
                      </p>
                      <p className="text-xs text-slate-400">
                        {review.user.email}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {review.product.image_url ? (
                      <Image
                        src={review.product.image_url}
                        alt={review.product.name}
                        width={35}
                        height={35}
                        className="rounded-lg object-cover ring-2 h-fit w-full max-h-12 max-w-12 ring-slate-700"
                      />
                    ) : (
                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-800 border border-slate-700">
                        <Package className="h-5 w-5 text-slate-500" />
                      </div>
                    )}
                    <p className="max-w-[200px] truncate text-slate-100 font-medium">
                      {review.product.name}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 transition-colors ${
                          i < review.rating
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-700"
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-semibold text-slate-300">
                      ({review.rating})
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="max-w-[300px] truncate text-sm text-slate-300">
                    {review.comment || "Sin comentario"}
                  </p>
                </TableCell>
                <TableCell>
                  <Badge
                    className={
                      review.active
                        ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 border border-emerald-500/30 font-medium"
                        : "bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/30 font-medium"
                    }
                  >
                    {review.active ? "Aprobada" : "Pendiente"}
                  </Badge>
                </TableCell>
                <TableCell className="text-sm text-slate-400 font-medium">
                  {new Date(review.created_at).toLocaleDateString("es-ES")}
                </TableCell>
                <TableCell>
                  <div className="flex justify-end gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedReview(review)}
                      className="text-blue-400 hover:bg-blue-500/20 hover:text-blue-300 transition-all"
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
                          ? "text-amber-400 hover:bg-amber-500/20 hover:text-amber-300 transition-all"
                          : "text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 transition-all"
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
                      className="text-rose-400 hover:bg-rose-500/20 hover:text-rose-300 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
