import { prisma } from "../lib/prisma.js";
import { notifyNewOrder, notifyOrderStatusChange, notifyLowStock } from "./notifications.js";
import { ValidationError, NotFoundError, ForbiddenError, handlePrismaError } from "../errors/errorsClass.js";

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
  minAmount?: number;
  maxAmount?: number;
  sortBy?: string;
  sortOrder?: string;
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
  // VALIDATION BEFORE TRY-CATCH
  if (!paymentId || paymentId <= 0) {
    throw new ValidationError("paymentId es requerido y debe ser mayor a 0");
  }
  if (!shippingAddressId || shippingAddressId <= 0) {
    throw new ValidationError("shippingAddressId es requerido y debe ser mayor a 0");
  }
  if (couponId !== undefined && couponId !== null && couponId <= 0) {
    throw new ValidationError("couponId debe ser mayor a 0 si se proporciona");
  }

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

    // 🔔 Notificar a todos los admins sobre el nuevo pedido
    try {
      const orderDetails = await prisma.orders.findUnique({
        where: { id: orderResult.order_id },
        include: {
          User: { select: { name: true, email: true } },
        },
      });

      if (orderDetails) {
        await notifyNewOrder(
          orderDetails.id,
          orderDetails.User?.name || orderDetails.User?.email || "Cliente",
          orderDetails.total / 100 // Convertir de centavos a unidades
        );

        // 🔔 Verificar stock bajo en productos de la orden
        const orderItems = await prisma.order_items.findMany({
          where: { order_id: orderDetails.id },
          include: { products: true },
        });

        for (const item of orderItems) {
          const product = item.products;
          if (product && product.stock <= 10) {
            await notifyLowStock(product.id, product.name, product.stock, 10);
          }
        }
      }
    } catch (notifyError) {
      console.error("[createOrderService] Error al crear notificación de nuevo pedido:", notifyError);
      // No lanzar error, la notificación es opcional
    }

    return {
      order_id: orderResult.order_id,
      payment_id: orderResult.payment_id,
      total: orderResult.total,
      success: orderResult.success,
      message: orderResult.message,
    };
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error("[createOrderService] Error creando orden con paymentId:", paymentId, error);
    throw handlePrismaError(error);
  }
};

export const createOrderItemsService = async (
  orderId: number,
  cartData: object
) => {
  // VALIDATION BEFORE TRY-CATCH
  if (!orderId || orderId <= 0) {
    throw new ValidationError("orderId es requerido y debe ser mayor a 0");
  }
  if (!cartData || typeof cartData !== "object") {
    throw new ValidationError("cartData es requerido y debe ser un objeto");
  }

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
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error("[createOrderItemsService] Error creando order items para orderId:", orderId, error);
    throw handlePrismaError(error);
  }
};

export const getOrderWithPaymentService = async (orderId: number) => {
  // VALIDATION BEFORE TRY-CATCH
  if (!orderId || orderId <= 0) {
    throw new ValidationError("orderId es requerido y debe ser mayor a 0");
  }

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
      throw new NotFoundError("Orden no encontrada");
    }

    // Obtener la dirección completa usando shipping_address_id
    if (order.shipping_address_id) {
      await prisma.addresses.findUnique({
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
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error("[getOrderWithPaymentService] Error obteniendo orden con orderId:", orderId, error);
    throw handlePrismaError(error);
  }
};

export const getUserOrdersWithPaymentsService = async (userId: number) => {
  // VALIDATION BEFORE TRY-CATCH
  if (!userId || userId <= 0) {
    throw new ValidationError("userId es requerido y debe ser mayor a 0");
  }

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
                images: {
                  where: {
                    is_primary: true,
                  },
                },
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
      orders.map(async (order: any) => {
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
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error("[getUserOrdersWithPaymentsService] Error obteniendo órdenes para userId:", userId, error);
    throw handlePrismaError(error);
  }
};

export const getProductWithVariantsService = async (productId: number) => {
  // VALIDATION BEFORE TRY-CATCH
  if (!productId || productId <= 0) {
    throw new ValidationError("productId es requerido y debe ser mayor a 0");
  }

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
      throw new NotFoundError("Producto no encontrado");
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
        ...new Set(product.product_variants.map((v: any) => v.color_code)),
      ],
      availableSizes: [...new Set(product.product_variants.map((v: any) => v.size))],
      totalStock: product.product_variants.reduce(
        (sum: any, variant: any) => sum + variant.stock,
        0
      ),
    };
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error("[getProductWithVariantsService] Error obteniendo producto con productId:", productId, error);
    throw handlePrismaError(error);
  }
};

export const checkVariantAvailabilityService = async (
  productId: number,
  colorCode: string,
  size: string
) => {
  // VALIDATION BEFORE TRY-CATCH
  if (!productId || productId <= 0) {
    throw new ValidationError("productId es requerido y debe ser mayor a 0");
  }
  if (!colorCode || colorCode.trim() === "") {
    throw new ValidationError("colorCode es requerido y no puede estar vacío");
  }
  if (!size || size.trim() === "") {
    throw new ValidationError("size es requerido y no puede estar vacío");
  }

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
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error("[checkVariantAvailabilityService] Error verificando disponibilidad de variante con productId:", productId, "colorCode:", colorCode, "size:", size, error);
    throw handlePrismaError(error);
  }
};

export const getOrderByIdService = async (orderId: number) => {
  // VALIDATION BEFORE TRY-CATCH
  if (!orderId || orderId <= 0) {
    throw new ValidationError("orderId es requerido y debe ser mayor a 0");
  }

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
      throw new NotFoundError("Orden no encontrada");
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
  } catch (error: any) {
    if (error instanceof NotFoundError) {
      throw error;
    }
    console.error("[getOrderByIdService] Error obteniendo orden con orderId:", orderId, error);
    throw handlePrismaError(error);
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
  // VALIDATION BEFORE TRY-CATCH
  if (!orderId || orderId <= 0) {
    throw new ValidationError("orderId es requerido y debe ser mayor a 0");
  }
  const validStatuses = ["pending", "paid", "confirmed", "shipped", "delivered", "cancelled"];
  if (!status || !validStatuses.includes(status)) {
    throw new ValidationError(`status debe ser uno de: ${validStatuses.join(", ")}`);
  }

  try {
    const order = await prisma.orders.update({
      where: { id: orderId },
      data: {
        status: status as any, // Cast to the correct enum type for Prisma
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

    // Notificar a todos los admins sobre el cambio de estado
    try {
      await notifyOrderStatusChange(order.id, status);
    } catch (notifyError) {
      console.error("[updateOrderStatusService] Advertencia: Error notificando cambio de estado:", notifyError);
    }

    return order;
  } catch (error: any) {
    if (error instanceof ValidationError) {
      throw error;
    }
    console.error("[updateOrderStatusService] Error actualizando orden con orderId:", orderId, "status:", status, error);
    throw handlePrismaError(error);
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
  minAmount,
  maxAmount,
  sortBy,
  sortOrder,
}: GetOrdersParams) => {
  try {
    const skip = (page - 1) * limit;

    const PAYMENT_METHOD_MAP: Record<string, string> = {
      PSE: "PSE",
      CARD: "CARD",
      NEQUI: "NEQUI",
      "TRANSFERENCIA BANCARIA": "PSE",
      TARJETA: "CARD",
      BANCOLOMBIA: "BANCOLOMBIA",
      BANCOLOMBIA_TRANSFER: "BANCOLOMBIA_TRANSFER",
    };

    const methodFilter = method
      ? PAYMENT_METHOD_MAP[method.toUpperCase()] || null
      : null;

    // Construir filtro base
    const where: Record<string, any> = {};

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

    // Filtro por rango de montos
    if (minAmount !== undefined || maxAmount !== undefined) {
      where.total = {};
      if (minAmount !== undefined) {
        where.total.gte = minAmount;
      }
      if (maxAmount !== undefined) {
        where.total.lte = maxAmount;
      }
    }

    // Construir orderBy dinámico
    let orderBy: Record<string, any> = { created_at: "desc" }; // default
    if (sortBy && sortOrder) {
      if (sortBy === "customer") {
        // Ordenar por nombre de usuario
        orderBy = { users: { name: sortOrder } };
      } else {
        // Ordenar por campos directos (created_at, total, status, id)
        orderBy = { [sortBy]: sortOrder };
      }
    }

    // Obtener órdenes con paginación
    const [orders, total] = await Promise.all([
      prisma.orders.findMany({
        where,
        skip,
        take: limit,
        include: {
          User: {
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
        orderBy,
      }),
      prisma.orders.count({ where }),
    ]);

    // Obtener información de payment para cada orden con filtro de método si aplica
    const ordersWithPayments = await Promise.all(
      orders.map(async (order: any) => {
        let paymentResult: PaymentInfo[];

        if (methodFilter) {
          paymentResult = await prisma.$queryRaw<PaymentInfo[]>`
            SELECT
              id, transaction_id, payment_status, payment_method,
              (amount_in_cents / 100)::INTEGER as amount_in_cents, currency, customer_email,
              created_at, approved_at
            FROM payments
            WHERE id = (SELECT payment_id FROM orders WHERE id = ${order.id}::INTEGER)
              AND payment_method = ${methodFilter}::payment_method_enum
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
      (order: any): order is NonNullable<typeof order> => order !== null
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

// ============================================
// ADMIN FUNCTIONS - Orders
// ============================================

// PUT - Change order status
export const changeOrderStatusService = async (
  orderId: number,
  newStatus: string
): Promise<void> => {
  // Validación ANTES del try-catch
  if (!orderId || orderId <= 0) {
    throw new ValidationError("ID de orden inválido");
  }
  if (!newStatus) {
    throw new ValidationError("Estado de orden requerido");
  }

  try {
    const existing = await prisma.orders.findUnique({
      where: { id: orderId },
    });

    if (!existing) {
      throw new NotFoundError("Orden no encontrada");
    }

    await prisma.orders.update({
      where: { id: orderId },
      data: {
        status: newStatus as any,
        updated_at: new Date(),
      },
    });
  } catch (error: any) {
    if (error instanceof ValidationError || error instanceof NotFoundError) throw error;
    console.error(`[changeOrderStatusService] Error al cambiar estado de orden ${orderId}:`, error);
    throw handlePrismaError(error);
  }
};

// GET - Export all orders for CSV/Excel
export const exportOrdersService = async (): Promise<any[]> => {
  try {
    const orders = await prisma.orders.findMany({
      select: {
        id: true,
        order_number: true,
        status: true,
        subtotal: true,
        tax: true,
        discount: true,
        total: true,
        created_at: true,
        updated_at: true,
      },
      orderBy: { created_at: "desc" },
    });

    // Format for export
    return orders.map((o: any) => ({
      id: o.id,
      orderNumber: o.order_number,
      status: o.status,
      subtotal: Number(o.subtotal),
      tax: Number(o.tax),
      discount: Number(o.discount),
      total: Number(o.total),
      createdAt: o.created_at,
      updatedAt: o.updated_at,
    }));
  } catch (error: any) {
    console.error("[exportOrdersService] Error al exportar órdenes:", error);
    throw handlePrismaError(error);
  }
};
