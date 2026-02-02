"use client";

import { CheckCircle, Clock, Star, MessageSquare, TrendingUp } from "lucide-react";

interface ReviewsStatsProps {
  stats: {
    total: number;
    pending: number;
    approved: number;
    averageRating: number;
    ratingDistribution: { rating: number; count: number }[];
  };
}

export default function ReviewsStats({ stats }: ReviewsStatsProps) {
  const statCards = [
    {
      title: "Total Reseñas",
      value: stats.total,
      icon: MessageSquare,
      gradient: "from-blue-500/30 via-indigo-500/30 to-blue-500/30",
      cardBg: "bg-linear-to-br from-blue-50 via-indigo-50 to-blue-50 dark:from-blue-950/40 dark:via-indigo-950/40 dark:to-blue-950/40",
      borderColor: "border-blue-200/60 dark:border-blue-800/60",
      iconBg: "bg-linear-to-br from-blue-500 to-indigo-600",
      iconColor: "text-white",
      glowColor: "bg-blue-400/40",
      shadowColor: "shadow-blue-500/25",
      description: "Reseñas totales registradas",
    },
    {
      title: "Pendientes",
      value: stats.pending,
      icon: Clock,
      gradient: "from-amber-500/30 via-orange-500/30 to-amber-500/30",
      cardBg: "bg-linear-to-br from-amber-50 via-orange-50 to-amber-50 dark:from-amber-950/40 dark:via-orange-950/40 dark:to-amber-950/40",
      borderColor: "border-amber-200/60 dark:border-amber-800/60",
      iconBg: "bg-linear-to-br from-amber-500 to-orange-600",
      iconColor: "text-white",
      glowColor: "bg-amber-400/40",
      shadowColor: "shadow-amber-500/25",
      description: "Esperando moderación",
    },
    {
      title: "Aprobadas",
      value: stats.approved,
      icon: CheckCircle,
      gradient: "from-emerald-500/30 via-teal-500/30 to-emerald-500/30",
      cardBg: "bg-linear-to-br from-emerald-50 via-teal-50 to-emerald-50 dark:from-emerald-950/40 dark:via-teal-950/40 dark:to-emerald-950/40",
      borderColor: "border-emerald-200/60 dark:border-emerald-800/60",
      iconBg: "bg-linear-to-br from-emerald-500 to-teal-600",
      iconColor: "text-white",
      glowColor: "bg-emerald-400/40",
      shadowColor: "shadow-emerald-500/25",
      description: "Publicadas en el sitio",
    },
    {
      title: "Rating Promedio",
      value: stats.averageRating.toFixed(1),
      icon: Star,
      gradient: "from-purple-500/30 via-violet-500/30 to-purple-500/30",
      cardBg: "bg-linear-to-br from-purple-50 via-violet-50 to-purple-50 dark:from-purple-950/40 dark:via-violet-950/40 dark:to-purple-950/40",
      borderColor: "border-purple-200/60 dark:border-purple-800/60",
      iconBg: "bg-linear-to-br from-purple-500 to-violet-600",
      iconColor: "text-white",
      glowColor: "bg-purple-400/40",
      shadowColor: "shadow-purple-500/25",
      description: "Calificación general",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4 py-6">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <div
            key={index}
            className={`group relative overflow-hidden rounded-3xl border ${stat.borderColor} ${stat.cardBg} p-6 shadow-lg ${stat.shadowColor} transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] hover:-translate-y-1`}
          >
            {/* Decorative glow */}
            <div 
              className={`pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full ${stat.glowColor} blur-3xl opacity-60 transition-opacity duration-300 group-hover:opacity-100`}
              aria-hidden="true"
            />
            
            {/* Background gradient */}
            <div 
              className={`pointer-events-none absolute inset-0 bg-linear-to-br ${stat.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              aria-hidden="true"
            />

            <div className="relative space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-slate-600 dark:text-slate-300">
                    {stat.title}
                  </p>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {stat.description}
                  </p>
                </div>
                <div className={`${stat.iconBg} rounded-2xl p-2.5 shadow-lg transition-all duration-300 group-hover:scale-110 group-hover:shadow-xl`}>
                  <Icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </div>

              {/* Value */}
              <div className="space-y-2">
                <div className="flex items-baseline gap-3">
                  <span className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
                    {stat.value}
                  </span>
                  {stat.title === "Rating Promedio" && (
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4 text-purple-500 dark:text-purple-400" />
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                        de 5.0
                      </span>
                    </div>
                  )}
                </div>

                {/* Rating stars visualization */}
                {stat.title === "Rating Promedio" && (
                  <div className="flex gap-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 transition-all duration-300 ${
                          i < Math.floor(stats.averageRating)
                            ? "fill-amber-400 text-amber-400 scale-100"
                            : "text-slate-300 dark:text-slate-700 scale-90"
                        }`}
                      />
                    ))}
                  </div>
                )}

                {/* Progress bar for percentage */}
                {stat.title !== "Rating Promedio" && stats.total > 0 && (
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                      <div
                        className={`h-full rounded-full bg-linear-to-r ${stat.gradient.replace('/20', '')} transition-all duration-500`}
                        style={{
                          width: `${((stat.value as number) / stats.total) * 100}%`,
                        }}
                      />
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      {(((stat.value as number) / stats.total) * 100).toFixed(1)}% del total
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
