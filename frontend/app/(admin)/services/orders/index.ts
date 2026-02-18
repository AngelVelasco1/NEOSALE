import type {
  FetchOrdersParams,
  FetchOrdersResponse,
  OrderDetails,
} from "./types";

// Usa la ruta proxy de Next.js /api/backend/* 
// que redirige a http://localhost:8000/api/*
// Esto evita completamente problemas de CORS
const API_URL = "/api/backend";

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
    minAmount,
    maxAmount,
    sortBy,
    sortOrder,
  } = params;

  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(status && { status }),
    ...(method && { method }),
    ...(startDate && { startDate }),
    ...(endDate && { endDate }),
    ...(minAmount && { minAmount }),
    ...(maxAmount && { maxAmount }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
  });

  const response = await fetch(
    `${API_URL}/orders?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch orders");
  }

  const result = await response.json();

  // Mapear la estructura de paginación si viene del servidor externo
  if (result.pagination && typeof result.pagination.page !== "undefined") {
    const mappedResult: FetchOrdersResponse = {
      data: result.data,
      pagination: {
        page: result.pagination.page,
        limit: result.pagination.limit,
        total: result.pagination.total,
        totalPages: result.pagination.totalPages,
      },
    };
    return mappedResult;
  }

  return result;
}

export async function fetchOrderDetails(params: {
  id: string;
}): Promise<{ order: OrderDetails }> {
  const { id } = params;

  const response = await fetch(`${API_URL}/orders/${id}`, {
    cache: "no-cache",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch order details: ${response.statusText}`);
  }

  const result = await response.json();
  const data = result.data;

  if (!data) {
    throw new Error("Order data is empty");
  }

  // Mapear exactamente a la estructura que la página de impresión espera
  const order: any = {
    id: data.id,
    invoice_no: `INV-${String(data.id).padStart(6, "0")}`,
    created_at: data.created_at,
    status: data.status,
    total: data.total ?? data.total_amount ?? 0,
    shipping_cost: data.shipping_cost ?? 0,
    User: {
      name: data.users?.name || "Cliente",
      email: data.users?.email || "",
      phoneNumber: data.users?.phone_number || null,
    },
    addresses: data.addresses
      ? {
          street: data.addresses.address || "",
          city: data.addresses.city || "",
          state: data.addresses.department || "",
          zip_code: data.addresses.postal_code || "",
        }
      : null,
    order_items: Array.isArray(data.order_items)
      ? data.order_items.map((item: any) => ({
          id: item.id,
          quantity: item.quantity || 1,
          price: item.price ?? item.unit_price ?? 0,
          products: {
            name: item.products?.name || item.product?.name || "Sin nombre",
            description: item.products?.description || item.product?.description || "",
          },
        }))
      : [],
    coupons: data.coupons
      ? {
          code: data.coupons.code,
          discount_type: data.coupons.discount_type,
          discount_value: Number(data.coupons.discount_value),
        }
      : null,
    payments: {
      payment_method: data.payments?.payment_method ?? "CARD",
    },
  };

  return { order };
}
