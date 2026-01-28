import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";

export async function GET() {
  try {

    const [totalCustomers, totalProducts, totalReviews, positiveReviews] = await Promise.all([
      prisma.user.count({ where: { role: "user", active: true } }),
      prisma.products.count({ where: { active: true, stock: {gt: 0} } } ),
      prisma.reviews.count({ where: { active: true } }),
      prisma.reviews.count({ where: { active: true, rating: { gte: 4 } } }),
    ]);

    const positiveReviewRate = totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0;

   

    return NextResponse.json({
      totalCustomers,
      totalProducts,
      positiveReviewRate,
    });
  } catch (error) {
    console.error("Trust metrics API error", error);
    return NextResponse.json({ error: "No se pudieron obtener las métricas" }, { status: 500 });
  }
}
