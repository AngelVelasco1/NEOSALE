"use server";

import { prisma } from "@/lib/prisma";

export interface DashboardStats {
  totalRevenue: number;
  revenueChange: number;
  totalOrders: number;
  ordersChange: number;
  productsSold: number;
  productsSoldChange: number;
  newCustomers: number;
  customersChange: number;
  avgOrderValue: number;
  conversionRate: number;
  pendingOrders: number;
  activeUsers: number;
}

export interface OrderStatusStats {
  pending: number;
  processing: number;
  shipped: number;
  delivered: number;
  total: number;
}

export interface DateRangeParams {
  from?: Date | string;
  to?: Date | string;
}

/**
 * Obtiene las estadísticas del dashboard con comparación del período anterior
 * Optimizado con queries en paralelo usando Promise.all
 */
export async function getDashboardStats(
  params?: DateRangeParams
): Promise<DashboardStats> {
  const now = new Date();

  // Parse dates from params or use default (current month)
  let currentPeriodStart: Date;
  let currentPeriodEnd: Date;

  if (params?.from && params?.to) {
    currentPeriodStart =
      typeof params.from === "string" ? new Date(params.from) : params.from;
    currentPeriodEnd =
      typeof params.to === "string" ? new Date(params.to) : params.to;
  } else {
    // Default: current month
    currentPeriodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    currentPeriodEnd = now;
  }

  // Calculate comparison period (same duration, shifted back)
  const periodDuration =
    currentPeriodEnd.getTime() - currentPeriodStart.getTime();
  const comparisonPeriodEnd = new Date(currentPeriodStart.getTime() - 1); // Day before current period
  const comparisonPeriodStart = new Date(
    comparisonPeriodEnd.getTime() - periodDuration
  );

  try {
    // Ejecutar todas las queries en paralelo para máxima eficiencia
    const [
      // Revenue stats
      currentPeriodRevenue,
      comparisonPeriodRevenue,

      // Orders stats
      currentPeriodOrders,
      comparisonPeriodOrders,

      // Products sold stats
      currentPeriodProductsSold,
      comparisonPeriodProductsSold,

      // Customers stats
      currentPeriodCustomers,
      comparisonPeriodCustomers,

      // Additional metrics
      pendingOrdersCount,
      activeUsersCount,
      totalOrdersForConversion,
      totalVisitsForConversion,
    ] = await Promise.all([
      // Current period revenue
      prisma.orders.aggregate({
        where: {
          created_at: { gte: currentPeriodStart, lte: currentPeriodEnd },
          status: { in: ["paid", "processing", "shipped", "delivered"] },
        },
        _sum: { total: true },
      }),

      // Comparison period revenue
      prisma.orders.aggregate({
        where: {
          created_at: { gte: comparisonPeriodStart, lte: comparisonPeriodEnd },
          status: { in: ["paid", "processing", "shipped", "delivered"] },
        },
        _sum: { total: true },
      }),

      // Current period orders count
      prisma.orders.count({
        where: {
          created_at: { gte: currentPeriodStart, lte: currentPeriodEnd },
        },
      }),

      // Comparison period orders count
      prisma.orders.count({
        where: {
          created_at: { gte: comparisonPeriodStart, lte: comparisonPeriodEnd },
        },
      }),

      // Current period products sold
      prisma.order_items.aggregate({
        where: {
          orders: {
            created_at: { gte: currentPeriodStart, lte: currentPeriodEnd },
            status: { in: ["paid", "processing", "shipped", "delivered"] },
          },
        },
        _sum: { quantity: true },
      }),

      // Comparison period products sold
      prisma.order_items.aggregate({
        where: {
          orders: {
            created_at: {
              gte: comparisonPeriodStart,
              lte: comparisonPeriodEnd,
            },
            status: { in: ["paid", "processing", "shipped", "delivered"] },
          },
        },
        _sum: { quantity: true },
      }),

      // Current period new customers
      prisma.user.count({
        where: {
          createdAt: { gte: currentPeriodStart, lte: currentPeriodEnd },
          role: "user",
        },
      }),

      // Comparison period new customers
      prisma.user.count({
        where: {
          createdAt: { gte: comparisonPeriodStart, lte: comparisonPeriodEnd },
          role: "user",
        },
      }),

      // Pending orders
      prisma.orders.count({
        where: {
          status: { in: ["pending", "paid"] },
        },
      }),

      // Active users (users who placed an order in current period)
      prisma.user.count({
        where: {
          role: "user",
          active: true,
        },
      }),

      // Total orders for conversion rate (current period)
      prisma.orders.count({
        where: {
          created_at: { gte: currentPeriodStart, lte: currentPeriodEnd },
        },
      }),

      // Total active sessions/visits (using cart as proxy)
      prisma.cart.count({
        where: {
          created_at: { gte: currentPeriodStart, lte: currentPeriodEnd },
        },
      }),
    ]);

    // Calculate values
    const totalRevenue = currentPeriodRevenue._sum.total || 0;
    const comparisonRevenue = comparisonPeriodRevenue._sum.total || 0;
    const revenueChange =
      comparisonRevenue > 0
        ? ((totalRevenue - comparisonRevenue) / comparisonRevenue) * 100
        : 0;

    const totalOrders = currentPeriodOrders;
    const ordersChange =
      comparisonPeriodOrders > 0
        ? ((totalOrders - comparisonPeriodOrders) / comparisonPeriodOrders) *
          100
        : 0;

    const productsSold = currentPeriodProductsSold._sum.quantity || 0;
    const comparisonProductsSold =
      comparisonPeriodProductsSold._sum.quantity || 0;
    const productsSoldChange =
      comparisonProductsSold > 0
        ? ((productsSold - comparisonProductsSold) / comparisonProductsSold) *
          100
        : 0;

    const newCustomers = currentPeriodCustomers;
    const comparisonCustomers = comparisonPeriodCustomers;
    const customersChange =
      comparisonCustomers > 0
        ? ((newCustomers - comparisonCustomers) / comparisonCustomers) * 100
        : 0;

    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const conversionRate =
      totalVisitsForConversion > 0
        ? (totalOrdersForConversion / totalVisitsForConversion) * 100
        : 0;

    return {
      totalRevenue,
      revenueChange,
      totalOrders,
      ordersChange,
      productsSold,
      productsSoldChange,
      newCustomers,
      customersChange,
      avgOrderValue,
      conversionRate,
      pendingOrders: pendingOrdersCount,
      activeUsers: activeUsersCount,
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw new Error("Failed to fetch dashboard statistics");
  }
}

/**
 * Obtiene las estadísticas de estados de órdenes
 * Query única optimizada con groupBy
 */
export async function getOrderStatusStats(
  params?: DateRangeParams
): Promise<OrderStatusStats> {
  try {
    let dateFilter = {};

    // Apply date filter if params provided
    if (params?.from && params?.to) {
      const from =
        typeof params.from === "string" ? new Date(params.from) : params.from;
      const to =
        typeof params.to === "string" ? new Date(params.to) : params.to;
      dateFilter = {
        created_at: { gte: from, lte: to },
      };
    }

    // Una sola query agrupada por status
    const statusCounts = await prisma.orders.groupBy({
      by: ["status"],
      _count: {
        id: true,
      },
      where: {
        ...dateFilter,
        status: {
          in: ["pending", "paid", "processing", "shipped", "delivered"],
        },
      },
    });

    // Mapear resultados
    const stats = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      total: 0,
    };

    statusCounts.forEach((item) => {
      const count = item._count.id;
      stats.total += count;

      switch (item.status) {
        case "pending":
        case "paid":
          stats.pending += count;
          break;
        case "processing":
          stats.processing += count;
          break;
        case "shipped":
          stats.shipped += count;
          break;
        case "delivered":
          stats.delivered += count;
          break;
      }
    });

    return stats;
  } catch (error) {
    console.error("Error fetching order status stats:", error);
    throw new Error("Failed to fetch order status statistics");
  }
}
