// TODO: Migrado a Prisma - Usa API routes
// import { SupabaseClient } from "@supabase/supabase-js";
// import { Database } from "@/types/supabase";
// import { queryPaginatedTable } from "@/helpers/queryPaginatedTable";
import type {
  FetchOrdersParams,
  FetchOrdersResponse,
  OrderDetails,
} from "./types";

const BACKEND_URL = "http://localhost:8000";

// Migrado a Prisma - Usa API routes
export async function fetchOrders(
  params: FetchOrdersParams
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

// Implementación con Prisma
export async function fetchOrderDetails(params: {
  id: string;
}): Promise<{ order: OrderDetails }> {
  const { id } = params;

  const response = await fetch(`${BACKEND_URL}/api/orders/${id}`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch order details: ${response.statusText}`);
  }

  const result = await response.json();
  const data = result.data;

  // Transformar la respuesta del backend al formato esperado por el frontend
  const order: OrderDetails = {
    id: data.id,
    invoice_no: `INV-${String(data.id).padStart(6, "0")}`,
    order_time: data.created_at,
    total_amount: data.total, // Ya está en unidad base (pesos)
    shipping_cost: data.shipping_cost, // Ya está en unidad base (pesos)
    payment_method: "CARD", // Por defecto, se puede obtener del payment si es necesario
    status: data.status,
    customers: {
      name: data.users.name,
      email: data.users.email,
      phone: data.users.phone_number || null,
      address: data.addresses?.address || null,
    },
    order_items: data.order_items.map(
      (item: {
        quantity: number;
        price: number;
        products: { name: string };
      }) => ({
        quantity: item.quantity,
        unit_price: item.price, // Ya está en unidad base (pesos)
        products: {
          name: item.products.name,
        },
      })
    ),
    coupons: data.coupons
      ? {
          discount_type: data.coupons.discount_type,
          discount_value: Number(data.coupons.discount_value),
        }
      : null,
  };

  return { order };
}
