// TODO: Migrado a Prisma - Usa API routes
// import { SupabaseClient } from "@supabase/supabase-js";
// import { Database } from "@/types/supabase";
// import { queryPaginatedTable } from "@/helpers/queryPaginatedTable";
import {
  Order,
  FetchOrdersParams,
  FetchOrdersResponse,
  OrderDetails,
} from "./types";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

// Migrado a Prisma - Usa API routes
export async function fetchOrders(
  params: FetchOrdersParams,
  _client?: any // No se usa más, mantenido por compatibilidad
): Promise<FetchOrdersResponse> {
  const {
    page = 1,
    limit = 10,
    search,
    status,
    method,
    startDate,
    endDate,
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(status && { status }),
    ...(method && { method }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
  });

  const response = await fetch(
    `${BACKEND_URL}/api/orders?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  return response.json();

  /* CÓDIGO ORIGINAL CON SUPABASE - ARCHIVADO
  const selectQuery = `
    *,
    customers!inner (
      name
    )
  `;

  let query = client.from("orders").select(selectQuery, { count: "exact" });

  if (search) {
    query = query.ilike("customers.name", `%${search}%`);
  }

  if (status) {
    query = query.eq("status", status);
  }

  if (method) {
    query = query.eq("payment_method", method);
  }

  if (startDate) {
    query = query.gte("created_at", startDate);
  }

  if (endDate) {
    const endDay = new Date(endDate);
    const nextDay = new Date(endDay);
    nextDay.setDate(endDay.getDate() + 1);

    query = query.lt("created_at", nextDay.toISOString());
  }

  query = query.order("created_at", { ascending: false });

  const paginatedOrders = await queryPaginatedTable<Order, "orders">({
    name: "orders",
    page,
    limit,
    query,
  });

  return paginatedOrders;
}

export async function fetchOrderDetails(
  client: SupabaseClient<Database>,
  { id }: { id: string }
) {
  const selectQuery = `
    id,
    invoice_no,
    order_time,
    total_amount,
    shipping_cost,
    payment_method,
    status,
    customers(name, email, phone, address),
    order_items(quantity, unit_price, products(name)),
    coupons(discount_type, discount_value)
  `;

  const { data, error } = await client
    .from("orders")
    .select(selectQuery)
    .eq("id", id)
    .single();

  if (error) {
    console.error(error.message);
    throw new Error(`Failed to fetch order details: ${error.message}`);
  }

  if (!data) {
    console.error("Failed to fetch order details");
    throw new Error("Failed to fetch order details");
  }

  return {
    order: data as OrderDetails,
  };
  */
}

// Stub temporal para fetchOrderDetails
export async function fetchOrderDetails(
  params: { id: string },
  _client?: any
): Promise<{ order: OrderDetails | null }> {
  // TODO: Implementar con Prisma
  return { order: null };
}
