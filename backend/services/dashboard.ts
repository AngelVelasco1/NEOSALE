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
      data: {
        data: formattedData,
      },
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
      // All time stats: count distinct customers from orders, products from inventory
      prisma.$queryRaw`
        SELECT 
          (SELECT COUNT(DISTINCT id) FROM products WHERE active = true) as total_products,
          (SELECT COUNT(DISTINCT id) FROM products WHERE active = true) as active_products,
          (SELECT COUNT(DISTINCT user_id) FROM orders WHERE status IN ('paid', 'processing', 'shipped', 'delivered')) as total_customers
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

// GET - Order Status Stats
export const getOrderStatusStatsService = async (params: DashboardStatsParams) => {
  try {
    const toDate = params.to ? new Date(params.to) : new Date();
    const fromDate = params.from
      ? new Date(params.from)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const stats = await prisma.$queryRaw`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending,
        COUNT(CASE WHEN status = 'processing' THEN 1 END) as processing,
        COUNT(CASE WHEN status = 'shipped' THEN 1 END) as shipped,
        COUNT(CASE WHEN status = 'delivered' THEN 1 END) as delivered
      FROM orders
      WHERE created_at >= ${fromDate} AND created_at <= ${toDate}
    `;

    const result = Array.isArray(stats) ? stats[0] : stats;

    return {
      success: true,
      data: {
        data: {
          total: Number(result?.total || 0),
          pending: Number(result?.pending || 0),
          processing: Number(result?.processing || 0),
          shipped: Number(result?.shipped || 0),
          delivered: Number(result?.delivered || 0),
        },
      },
      period: { from: fromDate, to: toDate },
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Failed to fetch order status stats: ${error}`, 500);
  }
};

// GET - Category Sales Data
export const getCategorySalesDataService = async (params: DashboardStatsParams) => {
  try {
    const toDate = params.to ? new Date(params.to) : new Date();
    const fromDate = params.from
      ? new Date(params.from)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

    const categorySales = await prisma.$queryRaw`
      SELECT 
        c.name,
        COUNT(o.id) as orders,
        COALESCE(SUM(o.total), 0) as revenue
      FROM orders o
      JOIN order_items oi ON o.id = oi.order_id
      JOIN products p ON oi.product_id = p.id
      JOIN categories c ON p.category_id = c.id
      WHERE o.created_at >= ${fromDate} AND o.created_at <= ${toDate}
      AND o.status IN ('paid', 'processing', 'shipped', 'delivered')
      GROUP BY c.id, c.name
      ORDER BY revenue DESC
      LIMIT 5
    `;

    return {
      success: true,
      data: {
        data: Array.isArray(categorySales)
          ? categorySales.map((item: any) => ({
              name: item.name,
              orders: Number(item.orders),
              revenue: Number(item.revenue),
            }))
          : [],
      },
      period: { from: fromDate, to: toDate },
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Failed to fetch category sales data: ${error}`, 500);
  }
};

// GET - Monthly Sales Data
export const getMonthlySalesDataService = async (params: DashboardStatsParams) => {
  try {
    const toDate = params.to ? new Date(params.to) : new Date();
    const fromDate = params.from
      ? new Date(params.from)
      : new Date(Date.now() - 365 * 24 * 60 * 60 * 1000);

    const monthlySales = await prisma.$queryRaw`
      SELECT 
        DATE_TRUNC('month', o.created_at)::date as month,
        COUNT(*) as orders,
        COALESCE(SUM(o.total), 0) as revenue,
        COUNT(DISTINCT o.user_id) as customers
      FROM orders o
      WHERE o.created_at >= ${fromDate} AND o.created_at <= ${toDate}
      AND o.status IN ('paid', 'processing', 'shipped', 'delivered')
      GROUP BY DATE_TRUNC('month', o.created_at)
      ORDER BY month ASC
    `;

    return {
      success: true,
      data: {
        data: Array.isArray(monthlySales)
          ? monthlySales.map((item: any) => ({
              month: item.month,
              orders: Number(item.orders),
              revenue: Number(item.revenue),
              customers: Number(item.customers),
            }))
          : [],
      },
      period: { from: fromDate, to: toDate },
    };
  } catch (error) {
    if (error instanceof AppError) throw error;
    throw new AppError(`Failed to fetch monthly sales data: ${error}`, 500);
  }
};
