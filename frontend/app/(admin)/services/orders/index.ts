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
    `${BACKEND_URL}/api/orders?${queryParams.toString()}`
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

  const response = await fetch(`${BACKEND_URL}/api/orders/${id}`, {
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

  // Transformar la respuesta del backend al formato esperado por el frontend
  const order: OrderDetails = {
    id: data.id,
    invoice_no: `INV-${String(data.id).padStart(6, "0")}`,
    created_at: data.created_at,
    total: data.total,
    shipping_cost: data.shipping_cost,
    status: data.status,
    User: {
      name: data.users?.name ?? null,
      email: data.users?.email ?? "",
      phoneNumber: data.users?.phone_number ?? null,
    },
    addresses: data.addresses
      ? {
          street: data.addresses.address ?? "",
          city: data.addresses.city ?? "",
          state: data.addresses.department ?? "",
          zip_code: "",
        }
      : null,
    order_items: data.order_items.map(
      (item: {
        quantity: number;
        price: number;
        products: { name: string };
      }) => ({
        quantity: item.quantity,
        price: item.price,
        products: {
          name: item.products.name,
        },
      })
    ),
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
