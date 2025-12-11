"use server";

import { prisma } from "@/lib/prisma";
import { startOfDay, format } from "date-fns";
import { es } from "date-fns/locale";

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

/* Datos de las pedidos y ventas  */
export async function getDailyChartData(
  params?: DateRangeParams
): Promise<DailyData[]> {
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

  try {
    const dailyData = await prisma.$queryRaw<
      Array<{
        date: Date;
        sales: number;
        orders: bigint;
      }>
    >`
      SELECT 
        DATE(created_at) as date,
        COALESCE(SUM(total), 0) as sales,
        COUNT(*) as orders
      FROM orders
      WHERE 
        created_at >= ${startDate}
        AND created_at <= ${endDate}
        AND status IN ('paid', 'processing', 'shipped', 'delivered')
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `;

    const formattedData = dailyData.map((item) => ({
      date: format(new Date(item.date), "dd MMM", { locale: es }),
      sales: Number(item.sales),
      orders: Number(item.orders),
    }));

    // Fill missing dates with zero values
    const allDates: DailyData[] = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      const dateStr = format(currentDate, "dd MMM", { locale: es });
      const existingData = formattedData.find((d) => d.date === dateStr);

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
    console.error("Error fetching daily chart data:", error);
    return [];
  }
}

/**
 * Obtiene ventas por categoría para gráficas de barras/pastel
 * Usa el rango de fechas proporcionado, o mes actual por defecto
 */
export async function getCategorySalesData(
  params?: DateRangeParams
): Promise<CategorySalesResponse> {
  const now = new Date();

  let startDate: Date;
  let endDate: Date;

  if (params?.from && params?.to) {
    startDate =
      typeof params.from === "string" ? new Date(params.from) : params.from;
    endDate = typeof params.to === "string" ? new Date(params.to) : params.to;
  } else {
    // Default: current month
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    endDate = now;
  }

  // Ensure we're using start of day for consistent results
  startDate = startOfDay(startDate);
  endDate = new Date(endDate);
  endDate.setHours(23, 59, 59, 999); // End of day

  try {
    const totalOrdersResult = await prisma.orders.count({
      where: {
        status: { in: ["paid", "processing", "shipped", "delivered"] },
        created_at: { gte: startDate, lte: endDate },
      },
    });

    // Get category sales data
    const categoryData = await prisma.$queryRaw<
      Array<{
        category: string;
        sales: number;
        orders: bigint;
      }>
    >`
      SELECT 
        c.name as category,
        SUM(oi.price * oi.quantity) as sales,
        COUNT(DISTINCT o.id) as orders
      FROM orders o
      INNER JOIN order_items oi ON oi.order_id = o.id
      INNER JOIN products p ON p.id = oi.product_id
      INNER JOIN categories c ON c.id = p.category_id
      WHERE o.status IN ('paid', 'processing', 'shipped', 'delivered')
        AND o.created_at >= ${startDate} 
        AND o.created_at <= ${endDate}
      GROUP BY c.id, c.name
      ORDER BY sales DESC
      LIMIT 10
    `;

    return {
      data: categoryData.map((item) => ({
        category: item.category,
        sales: Number(item.sales),
        orders: Number(item.orders),
      })),
      totalOrders: totalOrdersResult,
    };
  } catch (error) {
    console.error("Error fetching category sales data:", error);
    return { data: [], totalOrders: 0 };
  }
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
    console.error("Error fetching monthly sales data:", error);
    return [];
  }
}
