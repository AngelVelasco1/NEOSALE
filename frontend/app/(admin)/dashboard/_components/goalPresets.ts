export type MetricGoalKey = "revenue" | "orders" | "products" | "customers";

export const DEFAULT_METRIC_GOALS: Record<MetricGoalKey, { value: number; label: string }> = {
  revenue: {
    value: 450_000_000,
    label: "Ganancias",
  },
  orders: {
    value: 8_000,
    label: "Pedidos",
  },
  products: {
    value: 15_000,
    label: "Unidades Vendidas",
  },
  customers: {
    value: 2_000,
    label: "Clientes",
  },
};

export const GOAL_PARAM_MAP: Record<MetricGoalKey, string> = {
  revenue: "goalRevenue",
  orders: "goalOrders",
  products: "goalProducts",
  customers: "goalCustomers",
};
