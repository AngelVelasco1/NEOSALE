import { Suspense } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { getAllReviews } from "../../actions/reviews/getAllReviews";
import { getReviewStats } from "../../actions/reviews/getReviewStats";
import ReviewsTable from "./components/ReviewsTable";
import ReviewsStats from "./components/ReviewsStats";
import ReviewsFilters from "./components/ReviewsFilters";
import { Skeleton } from "@/components/ui/skeleton";
import { MessageSquare } from "lucide-react";

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: { 
    status?: string; 
    rating?: string; 
    search?: string;
  };
}) {
  return (
    <div className="min-h-screen p-3">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/20">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-4xl font-bold text-transparent">
                Gestión de Reseñas
              </h1>
              <p className="mt-1 text-slate-400">
                Administra y modera las reseñas de tus productos
              </p>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <Suspense fallback={<StatsLoading />}>
          <StatsSection />
        </Suspense>

        {/* Filtros y Tabla */}
        <Card className="border-slate-700/50 bg-slate-900/90 backdrop-blur-xl shadow-2xl">
          <CardHeader className="border-b border-slate-700/50 pb-6">
            <ReviewsFilters />
          </CardHeader>
          <CardContent>
            <Suspense fallback={<TableLoading />}>
              <ReviewsTableSection searchParams={searchParams} />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

async function StatsSection() {
  const result = await getReviewStats();
  
  if (!result.success || !result.stats) {
    return null;
  }

  return <ReviewsStats stats={result.stats} />;
}

async function ReviewsTableSection({
  searchParams,
}: {
  searchParams: { status?: string; rating?: string; search?: string };
}) {
  const filters = {
    status: searchParams.status as "pending" | "approved" | "all" | undefined,
    rating: searchParams.rating ? parseInt(searchParams.rating) : undefined,
    search: searchParams.search,
  };

  const result = await getAllReviews(filters);

  if (!result.success || !result.reviews) {
    return (
      <div className="py-12 text-center">
        <p className="text-red-400">
          {result.error || "Error al cargar las reseñas"}
        </p>
      </div>
    );
  }

  return <ReviewsTable reviews={result.reviews} />;
}

function StatsLoading() {
  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i} className="border-slate-700/50 bg-slate-900/80">
          <CardHeader>
            <Skeleton className="h-4 w-24 bg-slate-700" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16 bg-gray-700" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function TableLoading() {
  return (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Skeleton key={i} className="h-20 w-full bg-gray-800" />
      ))}
    </div>
  );
}
