import { prisma } from "../lib/prisma";

interface CreateOrderFromPaymentRequest {
  paymentId: number;
  shippingAddressId: number;
  couponId?: number;
  userNote?: string;
}

interface GetOrdersParams {
  page: number;
  limit: number;
  search?: string;
  status?: string;
  method?: string;
  startDate?: string;
  endDate?: string;
}

interface CreateOrderFromPaymentResponse {
  order_id: number;
  payment_id: number;
  total: number;
  success: boolean;
  message: string;
}

interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  colorCode?: string;
  size?: string;
  subtotal: number;
}

interface ProcessOrderResult {
  orderId?: number;
  success: boolean;
  message: string;
  total?: number;
}

interface PaymentInfo {
  id: number;
  transaction_id: string;
  payment_status: string;
  payment_method: string;
  amount_in_cents: number;
  currency: string;
  customer_email: string;
  created_at: Date;
  approved_at?: Date;
}

interface PaymentWithOrder {
  id: number;
  transaction_id: string;
  payment_status: string;
  amount_in_cents: bigint;
  user_id: number;
  order_id?: number;
}

export const createOrderService = async ({
  paymentId,
  shippingAddressId,
  couponId,
}: CreateOrderFromPaymentRequest): Promise<CreateOrderFromPaymentResponse> => {
  try {
    const result = (await prisma.$queryRaw`
      SELECT * FROM fn_create_order(
        ${paymentId}::INTEGER,
        ${shippingAddressId}::INTEGER,
        ${couponId || null}::INTEGER
      )
    `) as CreateOrderFromPaymentResponse[];

    if (!result || result.length === 0) {
      throw new Error("No se recibió respuesta de fn_create_order");
    }

    const orderResult = result[0];

    if (!orderResult.success) {
      throw new Error(orderResult.message || "Error creando orden");
    }

    return {
      order_id: orderResult.order_id,
      payment_id: orderResult.payment_id,
      total: orderResult.total,
      success: orderResult.success,
      message: orderResult.message,
    };
  } catch (error) {
    console.error("Error en createOrderFromPaymentService:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error creando orden desde payment"
    );
  }
};

export const createOrderItemsService = async (
  orderId: number,
  cartData: object
) => {
  try {
    const result = (await prisma.$queryRaw`
      SELECT * FROM fn_create_order_items(
        ${orderId}::INTEGER,
        ${JSON.stringify(cartData)}::JSONB
      )
    `) as { items_created: number; success: boolean; message: string }[];

    if (!result || result.length === 0) {
      throw new Error("No se recibió respuesta de fn_create_order_items");
    }

    const itemsResult = result[0];

    return {
      itemsCreated: itemsResult.items_created,
      success: itemsResult.success,
      message: itemsResult.message,
    };
  } catch (error) {
    console.error("❌ Error en createOrderItemsService:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error creando order items"
    );
  }
};

export const getOrderWithPaymentService = async (orderId: number) => {
  try {
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        order_items: {
          include: {
            products: {
              include: {
                brands: true,
                categories: true,
              },
            },
          },
        },
        users: {
          select: { id: true, name: true, email: true },
        },
        coupons: true,
      },
    });

    if (!order) {
      throw new Error("Orden no encontrada");
    }

    // Obtener la dirección completa usando shipping_address_id
    let address = null;
    if (order.shipping_address_id) {
      address = await prisma.addresses.findUnique({
        where: { id: order.shipping_address_id },
        select: {
          id: true,
          address: true,
          country: true,
          city: true,
          department: true,
          is_default: true,
          created_at: true,
        },
      });
    }

    let payment: PaymentInfo | null = null;
    const paymentResult = await prisma.$queryRaw<PaymentInfo[]>`
      SELECT
        id, transaction_id, payment_status, payment_method,
        (amount_in_cents / 100)::INTEGER as amount_in_cents, currency, checkout_url, customer_email,
        created_at, approved_at
      FROM payments
      WHERE id = (SELECT payment_id FROM orders WHERE id = ${orderId}::INTEGER)
    `;

    if (paymentResult && paymentResult.length > 0) {
      payment = paymentResult[0];
    }

    return {
      ...order,
      payment,
    };
  } catch (error) {
    console.error("Error en getOrderWithPaymentService:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al obtener la orden"
    );
  }
};

export const getUserOrdersWithPaymentsService = async (userId: number) => {
  try {
    const orders = await prisma.orders.findMany({
      where: { user_id: userId },
      include: {
        order_items: {
          include: {
            products: {
              include: {
                brands: true,
                categories: true,
              },
            },
          },
        },

        coupons: true,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    const ordersWithPayments = await Promise.all(
      orders.map(async (order) => {
        let payment: PaymentInfo | null = null;
        const paymentResult = await prisma.$queryRaw<PaymentInfo[]>`
          SELECT
            id, transaction_id, payment_status, payment_method,
            (amount_in_cents / 100)::INTEGER as amount_in_cents, currency, customer_email,
            created_at, approved_at
          FROM payments
          WHERE id = (SELECT payment_id FROM orders WHERE id = ${order.id}::INTEGER)
        `;

        if (paymentResult && paymentResult.length > 0) {
          payment = paymentResult[0];
        }

        // Obtener la dirección completa usando shipping_address_id
        let address = null;
        if (order.shipping_address_id) {
          address = await prisma.addresses.findUnique({
            where: { id: order.shipping_address_id },
            select: {
              id: true,
              address: true,
              country: true,
              city: true,
              department: true,
              is_default: true,
              created_at: true,
            },
          });
        }

        return {
          ...order,
          addresses: address,
          payment,
        };
      })
    );

    return ordersWithPayments;
  } catch (error) {
    console.error("Error en getUserOrdersWithPaymentsService:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al obtener las órdenes"
    );
  }
};

export const getProductWithVariantsService = async (productId: number) => {
  try {
    const product = await prisma.products.findUnique({
      where: { id: productId },
      include: {
        brands: true,
        categories: {
          include: {
            subcategory: true,
          },
        },
        product_variants: {
          where: { active: true },
          orderBy: [{ color_code: "asc" }, { size: "asc" }],
        },
      },
    });

    if (!product) {
      throw new Error("Producto no encontrado");
    }

    // Calcular precio final con ofertas
    let finalPrice = product.price;
    if (
      product.in_offer &&
      product.offer_discount &&
      product.offer_end_date &&
      new Date() < product.offer_end_date
    ) {
      const discountAmount =
        product.price * (Number(product.offer_discount) / 100);
      finalPrice = Math.round(product.price - discountAmount);
    }

    return {
      ...product,
      finalPrice,
      hasOffer:
        product.in_offer &&
        product.offer_end_date &&
        new Date() < product.offer_end_date,
      availableColors: [
        ...new Set(product.product_variants.map((v) => v.color_code)),
      ],
      availableSizes: [...new Set(product.product_variants.map((v) => v.size))],
      totalStock: product.product_variants.reduce(
        (sum, variant) => sum + variant.stock,
        0
      ),
    };
  } catch (error) {
    console.error("Error in getProductWithVariantsService:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al obtener el producto"
    );
  }
};

export const checkVariantAvailabilityService = async (
  productId: number,
  colorCode: string,
  size: string
) => {
  try {
    const variant = await prisma.product_variants.findFirst({
      where: {
        product_id: productId,
        color_code: colorCode,
        size: size,
        active: true,
      },
      include: {
        products: true,
      },
    });

    if (!variant) {
      return {
        available: false,
        stock: 0,
        price: null,
        message: "Variante no encontrada",
      };
    }

    const product = variant.products;
    let finalPrice = variant.price || product.price;

    // Aplicar ofertas si están activas
    if (
      product.in_offer &&
      product.offer_discount &&
      product.offer_end_date &&
      new Date() < product.offer_end_date
    ) {
      const discountAmount =
        finalPrice * (Number(product.offer_discount) / 100);
      finalPrice = Math.round(finalPrice - discountAmount);
    }

    return {
      available: variant.stock > 0,
      stock: variant.stock,
      price: finalPrice,
      originalPrice: variant.price || product.price,
      hasOffer:
        product.in_offer &&
        product.offer_end_date &&
        new Date() < product.offer_end_date,
      message: variant.stock > 0 ? "Disponible" : "Sin stock",
    };
  } catch (error) {
    console.error("Error in checkVariantAvailabilityService:", error);
    throw new Error(
      error instanceof Error
        ? error.message
        : "Error al verificar disponibilidad"
    );
  }
};

export const getOrderByIdService = async (orderId: number) => {
  try {
    const order = await prisma.orders.findUnique({
      where: { id: orderId },
      include: {
        order_items: {
          include: {
            products: {
              include: {
                brands: true,
                categories: true,
              },
            },
          },
        },
        users: {
          select: { id: true, name: true, email: true },
        },
        coupons: true,
      },
    });

    if (!order) {
      throw new Error("Orden no encontrada");
    }

    // Obtener la dirección completa usando shipping_address_id
    let address = null;
    if (order.shipping_address_id) {
      address = await prisma.addresses.findUnique({
        where: { id: order.shipping_address_id },
        select: {
          id: true,
          address: true,
          country: true,
          city: true,
          department: true,
          is_default: true,
          created_at: true,
        },
      });
    }

    return {
      ...order,
      addresses: address,
    };
  } catch (error) {
    console.error("Error in getOrderByIdService:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al obtener la orden"
    );
  }
};

export const updateOrderStatusService = async (
  orderId: number,
  status:
    | "pending"
    | "paid"
    | "confirmed"
    | "shipped"
    | "delivered"
    | "cancelled"
) => {
  try {
    const order = await prisma.orders.update({
      where: { id: orderId },
      data: {
        status: status as any, // Type assertion para evitar errores de TypeScript
        updated_at: new Date(),
      },
      include: {
        order_items: {
          include: {
            products: {
              include: {
                product_variants: true,
              },
            },
          },
        },
        users: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    console.log("Estado de orden actualizado:", {
      orderId: order.id,
      newStatus: order.status,
    });

    return order;
  } catch (error) {
    console.error("❌ Error en updateOrderStatusService:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al actualizar la orden"
    );
  }
};

export const getUserOrdersService = async (userId: number) => {
  try {
    return await getUserOrdersWithPaymentsService(userId);
  } catch (error) {
    console.error("Error en getUserOrdersService:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al obtener las órdenes"
    );
  }
};

export const getOrdersService = async ({
  page,
  limit,
  search,
  status,
  method,
  startDate,
  endDate,
}: GetOrdersParams) => {
  try {
    const skip = (page - 1) * limit;

    // Construir filtro base
    const where: any = {};

    // Filtro por búsqueda (nombre de usuario o email)
    if (search) {
      where.users = {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      };
    }

    // Filtro por estado
    if (status) {
      where.status = status;
    }

    // Filtro por rango de fechas
    if (startDate || endDate) {
      where.created_at = {};
      if (startDate) {
        where.created_at.gte = new Date(startDate);
      }
      if (endDate) {
        where.created_at.lte = new Date(endDate);
      }
    }

    // Obtener órdenes con paginación
    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        skip,
        take: limit,
        include: {
          users: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
          coupons: {
            select: {
              id: true,
              code: true,
              discount_value: true,
              discount_type: true,
            },
          },
          payments: {
            select: {
              payment_method: true,
              payment_status: true,
              transaction_id: true,
            },
          },
          order_items: {
            include: {
              products: {
                select: {
                  id: true,
                  name: true,
                  price: true,
                },
              },
            },
          },
        },
        orderBy: { created_at: "desc" },
      }),
      prisma.orders.count({ where }),
    ]);

    // Obtener información de payment para cada orden con filtro de método si aplica
    const ordersWithPayments = await Promise.all(
      orders.map(async (order) => {
        let paymentResult: PaymentInfo[];

        if (method) {
          paymentResult = await prisma.$queryRaw<PaymentInfo[]>`
            SELECT
              id, transaction_id, payment_status, payment_method,
              (amount_in_cents / 100)::INTEGER as amount_in_cents, currency, customer_email,
              created_at, approved_at
            FROM payments
            WHERE id = (SELECT payment_id FROM orders WHERE id = ${order.id}::INTEGER)
              AND payment_method = ${method}
          `;
        } else {
          // Sin filtro de método
          paymentResult = await prisma.$queryRaw<PaymentInfo[]>`
            SELECT
              id, transaction_id, payment_status, payment_method,
              (amount_in_cents / 100)::INTEGER as amount_in_cents, currency, customer_email,
              created_at, approved_at
            FROM payments
            WHERE id = (SELECT payment_id FROM orders WHERE id = ${order.id}::INTEGER)
          `;
        }

        let payment: PaymentInfo | null = null;
        if (paymentResult && paymentResult.length > 0) {
          payment = paymentResult[0];
        }

        // Si hay filtro de método y no hay payment, retornar null
        if (method && !payment) {
          return null;
        }

        return {
          ...order,
          payment,
        };
      })
    );

    // Filtrar órdenes que no cumplen con el filtro de método de pago
    const filteredOrders = ordersWithPayments.filter(
      (order): order is NonNullable<typeof order> => order !== null
    );

    return {
      data: filteredOrders,
      pagination: {
        total: method ? filteredOrders.length : total,
        page,
        limit,
        totalPages: Math.ceil((method ? filteredOrders.length : total) / limit),
      },
    };
  } catch (error) {
    console.error("Error en getOrdersService:", error);
    throw new Error(
      error instanceof Error ? error.message : "Error al obtener las órdenes"
    );
  }
};

export const processWompiOrderWebhook = async (
  transactionId: string,
  paymentStatus: "PENDING" | "APPROVED" | "DECLINED" | "VOIDED" | "ERROR"
): Promise<ProcessOrderResult> => {
  try {
    // 1. Buscar payment por transaction_id
    const paymentResult = await prisma.$queryRaw<PaymentWithOrder[]>`
      SELECT p.id, p.transaction_id, p.payment_status, p.amount_in_cents, p.user_id, o.id as order_id
      FROM payments p
      LEFT JOIN orders o ON o.payment_id = p.id
      WHERE p.transaction_id = ${transactionId}::VARCHAR(255)
    `;

    if (!paymentResult || paymentResult.length === 0) {
      return {
        success: false,
        message: `Payment no encontrado para transaction_id: ${transactionId}`,
      };
    }

    const payment = paymentResult[0];

    // 2. Si no hay orden y el pago fue aprobado, intentar crear la orden
    if (!payment.order_id && paymentStatus === "APPROVED") {
      try {
        // Crear dirección si no existe
        const addressId = await findOrCreateAddressFromPayment(payment.id);

        if (!addressId) {
          return {
            success: false,
            message: "No se pudo crear o encontrar dirección de envío",
          };
        }

        // Crear orden usando fn_create_order
        const orderResult = await createOrderService({
          paymentId: payment.id,
          shippingAddressId: addressId,
          couponId: undefined,
        });

        return {
          orderId: orderResult.order_id,
          success: orderResult.success,
          message: orderResult.message,
          total: orderResult.total,
        };
      } catch (orderError) {
        console.error("Error creando orden desde webhook:", orderError);
        return {
          success: false,
          message: `Error creando orden: ${
            orderError instanceof Error
              ? orderError.message
              : "Error desconocido"
          }`,
        };
      }
    }

    // 3. Si ya existe orden, actualizar su estado según el payment status
    if (payment.order_id) {
      let newOrderStatus: "pending" | "paid" | "confirmed" | "cancelled";

      switch (paymentStatus) {
        case "APPROVED":
          newOrderStatus = "paid";
          break;
        case "DECLINED":
        case "ERROR":
        case "VOIDED":
          newOrderStatus = "cancelled";
          break;
        default:
          newOrderStatus = "pending";
      }

      await updateOrderStatusService(payment.order_id, newOrderStatus);

      return {
        orderId: payment.order_id,
        success: true,
        message: `Orden ${payment.order_id} actualizada a ${newOrderStatus}`,
        total: Number(payment.amount_in_cents),
      };
    }

    return {
      success: true,
      message: `Webhook procesado. Payment status: ${paymentStatus}, no se requieren acciones adicionales`,
    };
  } catch (error) {
    console.error("Error procesando webhook de Wompi:", error);
    return {
      success: false,
      message: `Error procesando webhook: ${
        error instanceof Error ? error.message : "Error desconocido"
      }`,
    };
  }
};

/**
 * Buscar o crear dirección desde payment usando fn_create_address_from_payment
 */
const findOrCreateAddressFromPayment = async (
  paymentId: number
): Promise<number | null> => {
  try {
    const result = await prisma.$queryRaw<
      { address_id: number; success: boolean; message: string }[]
    >`
      SELECT * FROM fn_create_address_from_payment(${paymentId}::INTEGER)
    `;

    if (!result || result.length === 0) {
      return null;
    }

    const addressResult = result[0];
    return addressResult.success ? addressResult.address_id : null;
  } catch (error) {
    console.error("Error creando dirección desde payment:", error);
    return null;
  }
};

// Exportar tipos
export type {
  CreateOrderFromPaymentRequest,
  CreateOrderFromPaymentResponse,
  OrderItem,
  ProcessOrderResult,
  PaymentInfo,
  PaymentWithOrder,
};
