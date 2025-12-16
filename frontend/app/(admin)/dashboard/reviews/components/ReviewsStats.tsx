"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Clock, Star, MessageSquare } from "lucide-react";

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
      color: "from-blue-500 to-indigo-600",
      bgGlow: "bg-blue-500/10",
      borderGlow: "border-blue-500/20",
    },
    {
      title: "Pendientes",
      value: stats.pending,
      icon: Clock,
      color: "from-amber-500 to-orange-600",
      bgGlow: "bg-amber-500/10",
      borderGlow: "border-amber-500/20",
    },
    {
      title: "Aprobadas",
      value: stats.approved,
      icon: CheckCircle,
      color: "from-emerald-500 to-teal-600",
      bgGlow: "bg-emerald-500/10",
      borderGlow: "border-emerald-500/20",
    },
    {
      title: "Rating Promedio",
      value: stats.averageRating.toFixed(1),
      icon: Star,
      color: "from-violet-500 to-purple-600",
      bgGlow: "bg-violet-500/10",
      borderGlow: "border-violet-500/20",
    },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card
            key={index}
            className={`group relative overflow-hidden border-slate-700/50 bg-slate-900/80 backdrop-blur-xl transition-all duration-300 hover:border-slate-600/50 hover:shadow-xl hover:shadow-${stat.color.split('-')[1]}-500/10`}
          >
            <div className={`absolute inset-0 ${stat.bgGlow} opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />
            <CardHeader className="relative flex flex-row items-center justify-between pb-3">
              <CardTitle className="text-sm font-medium text-slate-400 group-hover:text-slate-300 transition-colors">
                {stat.title}
              </CardTitle>
              <div
                className={`bg-gradient-to-br ${stat.color} rounded-xl p-2.5 shadow-lg shadow-${stat.color.split('-')[1]}-500/20`}
              >
                <Icon className="h-5 w-5 text-white" />
              </div>
            </CardHeader>
            <CardContent className="relative">
              <div className="flex items-baseline gap-3">
                <div className="text-4xl font-bold text-slate-100">
                  {stat.value}
                </div>
                {stat.title === "Rating Promedio" && (
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 transition-colors ${
                          i < Math.floor(stats.averageRating)
                            ? "fill-amber-400 text-amber-400"
                            : "text-slate-700"
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
