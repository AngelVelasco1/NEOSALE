import { prisma } from "../lib/prisma.js";
import { AppError, ValidationError } from "../errors/errorsClass.js";

interface ChartDataParams {
  from?: Date;
  to?: Date;
}

interface DashboardStatsParams {
  from?: Date;
  to?: Date;
}

// GET - Dashboard Chart Data (daily sales)
export const getChartDataService = async (params: ChartDataParams) => {
  try {
    const fromDate = params.from ? new Date(params.from) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const toDate = params.to ? new Date(params.to) : new Date();

    // Query daily sales data
    const dailyData = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('day', o.created_at) as date,
        COUNT(*) as order_count,
        COALESCE(SUM(o.total), 0) as daily_revenue
      FROM orders o
      WHERE o.created_at >= ${fromDate} AND o.created_at <= ${toDate}
      AND o.status IN ('paid', 'processing', 'shipped', 'delivered')
      GROUP BY DATE_TRUNC('day', o.created_at)
      ORDER BY date ASC
    `;

    // Format and fill gaps
    const formattedData = formatChartData(dailyData as any[], fromDate, toDate);

    return {
      success: true,
      data: formattedData,
      period: { from: fromDate, to: toDate },
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Failed to fetch chart data: ${error}`, 500);
  }
};

// GET - Dashboard Stats with period comparison
export const getDashboardStatsService = async (params: DashboardStatsParams) => {
  try {
    const toDate = params.to ? new Date(params.to) : new Date();
    const fromDate = params.from
      ? new Date(params.from)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    // Current period stats
    const [currentStats, previousStats, totalStats] = await Promise.all([
      // Current period
      prisma.$queryRaw`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total), 0) as revenue,
          COUNT(DISTINCT user_id) as customers
        FROM orders
        WHERE created_at >= ${fromDate} AND created_at <= ${toDate}
        AND status IN ('paid', 'processing', 'shipped', 'delivered')
      `,
      // Previous period (same length as current)
      prisma.$queryRaw`
        SELECT 
          COUNT(*) as total_orders,
          COALESCE(SUM(total), 0) as revenue,
          COUNT(DISTINCT user_id) as customers
        FROM orders
        WHERE created_at >= ${new Date(fromDate.getTime() - (toDate.getTime() - fromDate.getTime()))}
        AND created_at < ${fromDate}
        AND status IN ('paid', 'processing', 'shipped', 'delivered')
      `,
      // All time stats
      prisma.$queryRaw`
        SELECT 
          COUNT(DISTINCT id) as total_products,
          COUNT(DISTINCT CASE WHEN active = true THEN id END) as active_products,
          COUNT(DISTINCT user_id) as total_customers
        FROM products
        WHERE active = true
      `,
    ]);

    const current = Array.isArray(currentStats) ? currentStats[0] : currentStats;
    const previous = Array.isArray(previousStats) ? previousStats[0] : previousStats;
    const totals = Array.isArray(totalStats) ? totalStats[0] : totalStats;

    // Calculate changes
    const calculateChange = (current: number, previous: number) => {
      if (previous === 0) return current > 0 ? 100 : 0;
      return Math.round(((current - previous) / previous) * 100);
    };

    const revenueChange = calculateChange(
      Number(current?.revenue || 0),
      Number(previous?.revenue || 0)
    );
    const ordersChange = calculateChange(
      Number(current?.total_orders || 0),
      Number(previous?.total_orders || 0)
    );
    const customersChange = calculateChange(
      Number(current?.customers || 0),
      Number(previous?.customers || 0)
    );

    return {
      success: true,
      data: {
        revenue: {
          current: Number(current?.revenue || 0),
          previous: Number(previous?.revenue || 0),
          change: revenueChange,
        },
        orders: {
          current: Number(current?.total_orders || 0),
          previous: Number(previous?.total_orders || 0),
          change: ordersChange,
        },
        customers: {
          current: Number(current?.customers || 0),
          previous: Number(previous?.customers || 0),
          change: customersChange,
        },
        products: {
          total: Number(totals?.total_products || 0),
          active: Number(totals?.active_products || 0),
        },
      },
      period: { from: fromDate, to: toDate },
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Failed to fetch dashboard stats: ${error}`, 500);
  }
};

// Helper function to format chart data and fill gaps
function formatChartData(data: any[], fromDate: Date, toDate: Date) {
  const formatted: Record<string, any> = {};

  // Create date map
  for (const item of data) {
    const dateStr = new Date(item.date).toISOString().split("T")[0];
    formatted[dateStr] = {
      date: dateStr,
      orders: Number(item.order_count),
      revenue: Number(item.daily_revenue),
    };
  }

  // Fill gaps
  const result = [];
  const currentDate = new Date(fromDate);

  while (currentDate <= toDate) {
    const dateStr = currentDate.toISOString().split("T")[0];
    result.push(
      formatted[dateStr] || {
        date: dateStr,
        orders: 0,
        revenue: 0,
      }
    );
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return result;
}
