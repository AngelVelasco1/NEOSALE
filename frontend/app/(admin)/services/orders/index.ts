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
        current: result.pagination.page,
        limit: result.pagination.limit,
        items: result.pagination.total,
        pages: result.pagination.totalPages,
        next:
          result.pagination.page < result.pagination.totalPages
            ? result.pagination.page + 1
            : null,
        prev: result.pagination.page > 1 ? result.pagination.page - 1 : null,
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
