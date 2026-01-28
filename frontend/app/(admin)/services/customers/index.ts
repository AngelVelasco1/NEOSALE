import {
  FetchCustomersParams,
  FetchCustomersResponse,
  CustomerOrder,
} from "./types";
import { prisma } from "@/lib/prisma";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:8000";

export async function fetchCustomers({
  page = 1,
  limit = 10,
  search,
  status,
  minOrders,
  maxOrders,
  minSpent,
  maxSpent,
  sortBy,
  sortOrder,
}: FetchCustomersParams): Promise<FetchCustomersResponse> {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
    ...(search && { search }),
    ...(status && { status }),
    ...(minOrders && { minOrders }),
    ...(maxOrders && { maxOrders }),
    ...(minSpent && { minSpent }),
    ...(maxSpent && { maxSpent }),
    ...(sortBy && { sortBy }),
    ...(sortOrder && { sortOrder }),
  });

  const response = await fetch(
    `${BACKEND_URL}/api/users/getUsers?${queryParams.toString()}`
  );

  if (!response.ok) {
    throw new Error("Failed to fetch customers");
  }

  const result = await response.json();

  // Mapear la estructura de paginación si viene del servidor externo
  if (result.pagination && typeof result.pagination.page !== "undefined") {
    const mappedResult: FetchCustomersResponse = {
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

export async function fetchCustomerOrders({ id }: { id: string }): Promise<{
  customer: CustomerOrder["customer"];
  orders: CustomerOrder[];
}> {
  try {
    const userId = parseInt(id);

    if (isNaN(userId) || userId <= 0) {
      throw new Error("Invalid user ID");
    }

    // Verificar si el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        phoneNumber: true,
      },
    });

    if (!user) {
      throw new Error("Customer not found");
    }

    // Obtener las órdenes del usuario con información relacionada
    const orders = await prisma.orders.findMany({
      where: {
        user_id: userId,
      },
      select: {
        id: true,
        status: true,
        total: true,
        subtotal: true,
        shipping_cost: true,
        taxes: true,
        discount: true,
        coupon_discount: true,
        tracking_number: true,
        carrier: true,
        estimated_delivery_date: true,
        created_at: true,
        updated_at: true,
        shipped_at: true,
        delivered_at: true,
        cancelled_at: true,
        user_note: true,
        admin_notes: true,
        payments: {
          select: {
            payment_method: true,
            payment_status: true,
            reference: true,
            transaction_id: true,
          },
        },
        addresses: {
          select: {
            address: true,
            city: true,
            department: true,
            country: true,
          },
        },
        order_items: {
          select: {
            id: true,
            quantity: true,
            price: true,
            subtotal: true,
            color_code: true,
            size: true,
            products: {
              select: {
                id: true,
                name: true,
                description: true,
                images: {
                  where: {
                    is_primary: true,
                  },
                  select: {
                    image_url: true,
                  },
                  take: 1,
                },
              },
            },
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    });

    // Formatear los datos
    const formattedOrders: CustomerOrder[] = orders.map((order) => ({
      id: order.id,
      status: order.status,
      total: order.total,
      subtotal: order.subtotal,
      shipping_cost: order.shipping_cost,
      taxes: order.taxes,
      discount: order.discount || 0,
      coupon_discount: order.coupon_discount || 0,
      tracking_number: order.tracking_number,
      carrier: order.carrier,
      estimated_delivery_date: order.estimated_delivery_date,
      created_at: order.created_at,
      updated_at: order.updated_at,
      shipped_at: order.shipped_at,
      delivered_at: order.delivered_at,
      cancelled_at: order.cancelled_at,
      user_note: order.user_note,
      admin_notes: order.admin_notes,
      payment_method: order.payments.payment_method,
      payment_status: order.payments.payment_status,
      payment_reference: order.payments.reference,
      transaction_id: order.payments.transaction_id,
      shipping_address: {
        address: order.addresses.address,
        city: order.addresses.city,
        department: order.addresses.department,
        country: order.addresses.country,
      },
      customer: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone_number: user.phone_number,
      },
      items: order.order_items.map((item) => ({
        id: item.id,
        quantity: item.quantity,
        price: item.price,
        subtotal: item.subtotal,
        color_code: item.color_code,
        size: item.size,
        product: {
          id: item.products.id,
          name: item.products.name,
          description: item.products.description,
          image_url: item.products.images[0]?.image_url || null,
        },
      })),
    }));

    return {
      customer: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phone_number,
      },
      orders: formattedOrders,
    };
  } catch (error) {
    console.error("Error fetching customer orders:", error);
    throw error;
  }
}
