"use server";

import { prisma } from "@/lib/prisma";
import { startOfDay, format } from "date-fns";
import { es } from "date-fns/locale";
import { unstable_cache } from "next/cache";

export interface DailyData {
  date: string;
  sales: number;
  orders: number;
  aggregationType?: "daily" | "weekly" | "monthly";
}

export interface CategorySalesData {
  category: string;
  sales: number;
  orders: number;
}

export interface CategorySalesResponse {
  data: CategorySalesData[];
  totalOrders: number;
}

export interface DateRangeParams {
  from?: Date | string;
  to?: Date | string;
}

type NormalizedRange = {
  fromISO: string;
  toISO: string;
};

const normalizeDateRange = (params?: DateRangeParams): NormalizedRange => {
  const now = new Date();

  let startDate: Date;
  let endDate: Date;

  if (params?.from && params?.to) {
    startDate =
      typeof params.from === "string" ? new Date(params.from) : params.from;
    endDate = typeof params.to === "string" ? new Date(params.to) : params.to;
  } else {
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = now;
  }

  startDate = startOfDay(startDate);
  endDate = new Date(endDate);
  endDate.setHours(23, 59, 59, 999);

  return {
    fromISO: startDate.toISOString(),
    toISO: endDate.toISOString(),
  };
};

/* Datos de las pedidos y ventas  */
const dailyChartDataCache = unstable_cache(
  async (fromISO: string, toISO: string) => {
    const startDate = new Date(fromISO);
    const endDate = new Date(toISO);

    try {
      const dailyData = await prisma.$queryRaw<
        Array<{
          date: Date;
          sales: number;
          orders: bigint;
        }>
      >`
        SELECT 
          date_trunc('day', created_at) as date,
          COALESCE(SUM(total), 0) as sales,
          COUNT(*) as orders
        FROM orders
        WHERE 
          created_at >= ${startDate}
          AND created_at <= ${endDate}
          AND status IN ('paid', 'processing', 'shipped', 'delivered')
        GROUP BY date_trunc('day', created_at)
        ORDER BY date_trunc('day', created_at) ASC
      `;

      const formattedData = dailyData.map((item) => ({
        date: format(new Date(item.date), "dd MMM", { locale: es }),
        sales: Number(item.sales),
        orders: Number(item.orders),
      }));

      const formattedMap = new Map(
        formattedData.map((item) => [item.date, item])
      );

      const allDates: DailyData[] = [];
      let currentDate = new Date(startDate);

      while (currentDate <= endDate) {
        const dateStr = format(currentDate, "dd MMM", { locale: es });
        const existingData = formattedMap.get(dateStr);

        allDates.push(
          existingData || {
            date: dateStr,
            sales: 0,
            orders: 0,
          }
        );

        currentDate = new Date(currentDate);
        currentDate.setDate(currentDate.getDate() + 1);
      }

      return allDates;
    } catch (error) {
      
      return [];
    }
  },
  ["daily-chart-data"],
  { revalidate: 120, tags: ["dashboard-charts"] }
);

export async function getDailyChartData(
  params?: DateRangeParams
): Promise<DailyData[]> {
  const { fromISO, toISO } = normalizeDateRange(params);
  return dailyChartDataCache(fromISO, toISO);
}

/**
 * Obtiene ventas por categoría para gráficas de barras/pastel
 * Usa el rango de fechas proporcionado, o mes actual por defecto
 */
const categorySalesCache = unstable_cache(
  async (fromISO: string, toISO: string) => {
    const startDate = new Date(fromISO);
    const endDate = new Date(toISO);

    try {
      const dateFilters = {
        gte: startDate,
        lte: endDate,
      } as const;

      const totalOrdersResult = await prisma.orders.count({
        where: {
          status: { in: ["paid", "processing", "shipped", "delivered"] },
          created_at: dateFilters,
        },
      });

      const totalSalesAggregate = await prisma.orders.aggregate({
        _sum: { total: true },
        where: {
          status: { in: ["paid", "processing", "shipped", "delivered"] },
          created_at: dateFilters,
        },
      });

      const categoryData = await prisma.$queryRaw<
        Array<{
          category: string;
          sales: number;
          orders: bigint;
        }>
      >`
        SELECT 
          COALESCE(c.name, 'Sin categoría') AS category,
          SUM(oi.price * oi.quantity) AS sales,
          COUNT(DISTINCT o.id) AS orders
        FROM orders o
        INNER JOIN order_items oi ON oi.order_id = o.id
        INNER JOIN products p ON p.id = oi.product_id
        LEFT JOIN categories c ON c.id = p.category_id
        WHERE o.status IN ('paid', 'processing', 'shipped', 'delivered')
          AND o.created_at >= ${startDate} 
          AND o.created_at <= ${endDate}
        GROUP BY category
        ORDER BY sales DESC
        LIMIT 10
      `;

      let normalizedCategoryData = categoryData.map((item) => ({
        category: item.category,
        sales: Number(item.sales),
        orders: Number(item.orders),
      }));

      const totalSalesAmount = Number(totalSalesAggregate._sum.total ?? 0);

      if (!normalizedCategoryData.length && totalSalesAmount > 0) {
        normalizedCategoryData = [
          {
            category: "Sin categoría",
            sales: totalSalesAmount,
            orders: totalOrdersResult,
          },
        ];
      }

      const response: CategorySalesResponse = {
        data: normalizedCategoryData,
        totalOrders: totalOrdersResult,
      };

      return response;
    } catch (error) {
      
      const fallback: CategorySalesResponse = { data: [], totalOrders: 0 };
      return fallback;
    }
  },
  ["category-sales-data"],
  { revalidate: 120, tags: ["dashboard-charts"] }
);

export async function getCategorySalesData(
  params?: DateRangeParams
): Promise<CategorySalesResponse> {
  const { fromISO, toISO } = normalizeDateRange(params);
  return categorySalesCache(fromISO, toISO);
}

export async function getMonthlySalesData(): Promise<
  Array<{
    month: string;
    currentYear: number;
    previousYear: number;
  }>
> {
  const now = new Date();
  const currentYear = now.getFullYear();
  const previousYear = currentYear - 1;

  try {
    const monthlyData = await prisma.$queryRaw<
      Array<{
        month: number;
        year: number;
        sales: number;
      }>
    >`
      SELECT 
        EXTRACT(MONTH FROM created_at) as month,
        EXTRACT(YEAR FROM created_at) as year,
        COALESCE(SUM(total), 0) as sales
      FROM orders
      WHERE 
        EXTRACT(YEAR FROM created_at) IN (${currentYear}, ${previousYear})
        AND status IN ('paid', 'processing', 'shipped', 'delivered')
      GROUP BY EXTRACT(MONTH FROM created_at), EXTRACT(YEAR FROM created_at)
      ORDER BY month ASC
    `;

    // Format data with month names
    const monthNames = [
      "Ene",
      "Feb",
      "Mar",
      "Abr",
      "May",
      "Jun",
      "Jul",
      "Ago",
      "Sep",
      "Oct",
      "Nov",
      "Dic",
    ];

    const formattedData = monthNames.map((monthName, index) => {
      const monthNum = index + 1;
      const currentYearData = monthlyData.find(
        (d) => d.month === monthNum && d.year === currentYear
      );
      const previousYearData = monthlyData.find(
        (d) => d.month === monthNum && d.year === previousYear
      );

      return {
        month: monthName,
        currentYear: currentYearData ? Number(currentYearData.sales) : 0,
        previousYear: previousYearData ? Number(previousYearData.sales) : 0,
      };
    });

    return formattedData;
  } catch (error) {
    
    return [];
  }
}
