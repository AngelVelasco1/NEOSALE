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
  searchParams: Promise<{
    status?: string;
    rating?: string;
    search?: string;
  }>;
}) {
  const resolvedParams = await searchParams;

  return (
    <div className="min-h-screen p-3">
      <div className="mx-auto max-w-7xl space-y-8">
  

        {/* Estadísticas */}
    

        {/* Filtros y Tabla */}
        <Card className=" backdrop-blur-xl">
          <CardHeader >
            <ReviewsFilters />
          </CardHeader>
          <CardContent>
                <Suspense fallback={<StatsLoading />}>
          <StatsSection />
        </Suspense>
            <Suspense fallback={<TableLoading />}>
              <ReviewsTableSection searchParams={resolvedParams} />
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
  searchParams: Promise<{ status?: string; rating?: string; search?: string }>;
}) {
  const resolvedParams = await searchParams;
  const filters = {
    status: resolvedParams.status as "pending" | "approved" | "all" | undefined,
    rating: resolvedParams.rating ? parseInt(resolvedParams.rating) : undefined,
    search: resolvedParams.search,
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
    <div className="grid gap-6  md:grid-cols-2 lg:grid-cols-4">
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
