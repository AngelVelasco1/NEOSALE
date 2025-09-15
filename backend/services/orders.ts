import { BACK_CONFIG } from "../config/credentials";
import { prisma } from "../lib/prisma";
import MercadoPagoConfig, { Preference, Payment } from "mercadopago";

// Tipos específicos para órdenes
interface CreateOrderRequest {
  userId: number;
  productId: number;
  quantity: number;
  colorCode?: string;
  size?: string;
  shippingAddressId: number;
}

interface CreateOrderResponse {
  orderId: number;
  paymentLink: string;
  preferenceId: string;
  total: number;
}

export const createOrderService = async ({
  userId,
  items,
  shippingAddressId
}: CreateOrderRequest): Promise<CreateOrderResponse> => {
  try {
    // 1. Validar usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // 2. Validar dirección
    const address = await prisma.addresses.findFirst({
      where: { 
        id: shippingAddressId,
        user_id: userId 
      }
    });

    if (!address) {
      throw new Error('Dirección de envío no válida');
    }

    // 3. Procesar cada item y validar stock
    const processedItems = [];
    let subtotal = 0;

    for (const item of items) {
      const product = await prisma.products.findUnique({
        where: { id: item.productId },
        include: {
          brands: true,
          categories: true,
          product_variants: {
            where: {
              color_code: item.colorCode || undefined,
              size: item.size || undefined,
              active: true
            }
          }
        }
      });

      if (!product || !product.active) {
        throw new Error(`Producto ${item.productId} no disponible`);
      }

      // Determinar precio y stock
      let unitPrice = product.price;
      let availableStock = product.stock;

      if (item.colorCode && item.size) {
        const variant = product.product_variants.find(
          v => v.color_code === item.colorCode && v.size === item.size
        );

        if (!variant || !variant.active) {
          throw new Error(`Variante no disponible: ${item.colorCode} - ${item.size}`);
        }

        unitPrice = variant.price || product.price;
        availableStock = variant.stock;
      }

      // Verificar stock
      if (availableStock < item.quantity) {
        throw new Error(`Stock insuficiente para ${product.name}. Disponible: ${availableStock}`);
      }

      // Aplicar ofertas
      if (product.in_offer && product.offer_discount && product.offer_end_date && new Date() < product.offer_end_date) {
        const discountAmount = unitPrice * (Number(product.offer_discount) / 100);
        unitPrice = Math.round(unitPrice - discountAmount);
      }

      const itemSubtotal = unitPrice * item.quantity;
      subtotal += itemSubtotal;

      processedItems.push({
        productId: item.productId,
        product,
        quantity: item.quantity,
        unitPrice,
        subtotal: itemSubtotal,
        colorCode: item.colorCode,
        size: item.size
      });
    }

    // 4. Calcular totales
    const shippingCost = subtotal >= 100000 ? 0 : 15000;
    const taxes = Math.round(subtotal * 0.19);
    const total = subtotal + shippingCost + taxes;

    // 5. Crear orden
    const order = await prisma.orders.create({
      data: {
        user_id: userId,
        subtotal: subtotal,
        shipping_cost: shippingCost,
        taxes: taxes,
        total: total,
        status: 'pending',
        payment_status: 'pending',
        payment_method: 'mercadopago',
        shipping_address_id: shippingAddressId,
        updated_by: userId,
        order_items: {
          create: processedItems.map(item => ({
            product_id: item.productId,
            quantity: item.quantity,
            price: item.unitPrice,
            subtotal: item.subtotal,
            size: item.size,
            color_code: item.colorCode,
          }))
        }
      }
    });

    // 6. Crear preferencia en MercadoPago
    const mercadopago = new MercadoPagoConfig({
      accessToken: BACK_CONFIG.mercado_pago_access_token
    });

    const preference = new Preference(mercadopago);

    const preferenceData = {
      items: processedItems.map(item => ({
        id: item.product.id.toString(),
        title: item.product.name,
        description: `${item.product.description}${item.colorCode ? ` - Color: ${item.colorCode}` : ''}${item.size ? `, Talla: ${item.size}` : ''}`,
        unit_price: Number(item.unitPrice),
        quantity: item.quantity,
        currency_id: 'COP'
      })),
      payer: {
        name: user.name,
        email: user.email
      },
      back_urls: {
        success: `${BACK_CONFIG.frontend_url}/checkout/success?order_id=${order.id}`,
        failure: `${BACK_CONFIG.frontend_url}/checkout/failure?order_id=${order.id}`,
        pending: `${BACK_CONFIG.frontend_url}/checkout/pending?order_id=${order.id}`
      },
      auto_return: 'approved',
      external_reference: order.id.toString(),
      notification_url: `https://4de3ca4a2d02.ngrok-free.app/api/orders/webhook/mercadopago`,
      shipments: {
        cost: shippingCost,
        mode: 'not_specified'
      },
      // ✅ CONFIGURACIÓN PARA TESTING
      sandbox_init_point: process.env.NODE_ENV !== 'production'
    };

    const response = await preference.create({ body: preferenceData });
    
    if (!response.id || !response.init_point) {
      throw new Error('Error al crear la preferencia de pago en MercadoPago');
    }

    // 7. Actualizar orden con preference_id
    await prisma.orders.update({
      where: { id: order.id },
      data: { 
        preference_id: response.id,
        payment_method: 'mercadopago'
      }
    });

    return {
      orderId: order.id,
      paymentLink: response.init_point,
      preferenceId: response.id,
      total
    };

  } catch (error) {
    console.error('Error in createOrderService:', error);
    throw new Error(error instanceof Error ? error.message : 'Error al crear la orden');
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
            subcategory: true
          }
        },
        product_variants: {
          where: { active: true },
          orderBy: [
            { color_code: 'asc' },
            { size: 'asc' }
          ]
        }
      }
    });

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    // Calcular precio final con ofertas
    let finalPrice = product.price;
    if (product.in_offer && product.offer_discount && product.offer_end_date && new Date() < product.offer_end_date) {
      const discountAmount = product.price * (Number(product.offer_discount) / 100);
      finalPrice = Math.round(product.price - discountAmount);
    }

    return {
      ...product,
      finalPrice,
      hasOffer: product.in_offer && product.offer_end_date && new Date() < product.offer_end_date,
      availableColors: [...new Set(product.product_variants.map(v => v.color_code))],
      availableSizes: [...new Set(product.product_variants.map(v => v.size))],
      totalStock: product.product_variants.reduce((sum, variant) => sum + variant.stock, 0)
    };

  } catch (error) {
    console.error('Error in getProductWithVariantsService:', error);
    throw new Error(error instanceof Error ? error.message : 'Error al obtener el producto');
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
        active: true
      },
      include: {
        products: true
      }
    });

    if (!variant) {
      return {
        available: false,
        stock: 0,
        price: null,
        message: 'Variante no encontrada'
      };
    }

    const product = variant.products;
    let finalPrice = variant.price || product.price;

    // Aplicar ofertas si están activas
    if (product.in_offer && product.offer_discount && product.offer_end_date && new Date() < product.offer_end_date) {
      const discountAmount = finalPrice * (Number(product.offer_discount) / 100);
      finalPrice = Math.round(finalPrice - discountAmount);
    }

    return {
      available: variant.stock > 0,
      stock: variant.stock,
      price: finalPrice,
      originalPrice: variant.price || product.price,
      hasOffer: product.in_offer && product.offer_end_date && new Date() < product.offer_end_date,
      message: variant.stock > 0 ? 'Disponible' : 'Sin stock'
    };

  } catch (error) {
    console.error('Error in checkVariantAvailabilityService:', error);
    throw new Error(error instanceof Error ? error.message : 'Error al verificar disponibilidad');
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
                categories: true
              }
            }
          }
        },
        users: {
          select: { id: true, name: true, email: true }
        },
        coupons: true
      }
    });

    if (!order) {
      throw new Error('Orden no encontrada');
    }

    return order;

  } catch (error) {
    console.error('Error in getOrderByIdService:', error);
    throw new Error(error instanceof Error ? error.message : 'Error al obtener la orden');
  }
};

export const updateOrderStatusService = async (orderId: number, status: string) => {
  try {
    const order = await prisma.orders.update({
      where: { id: orderId },
      data: { 
        status: status as any, 
        updated_at: new Date()
      },
      include: {
        order_items: {
          include: {
            products: {
              include: {
                product_variants: true
              }
            }
          }
        },
        users: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    // Si el pago fue aprobado, reducir el stock del producto/variante
    if (status === 'paid') {
      for (const item of order.order_items) {
        if (item.color_code && item.size) {
          // Reducir stock de la variante específica
          await prisma.product_variants.updateMany({
            where: {
              product_id: item.product_id,
              color_code: item.color_code,
              size: item.size
            },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        } else {
          // Reducir stock del producto general
          await prisma.products.update({
            where: { id: item.product_id },
            data: {
              stock: {
                decrement: item.quantity
              }
            }
          });
        }
      }
    }

    return order;

  } catch (error) {
    console.error('Error in updateOrderStatusService:', error);
    throw new Error(error instanceof Error ? error.message : 'Error al actualizar la orden');
  }
};

export const getUserOrdersService = async (userId: number) => {
  try {
    const orders = await prisma.orders.findMany({
      where: { user_id: userId },
      include: {
        order_items: {
          include: {
            products: {
              include: {
                brands: true,
                categories: true
              }
            }
          }
        },
        coupons: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return orders;

  } catch (error) {
    console.error('Error in getUserOrdersService:', error);
    throw new Error(error instanceof Error ? error.message : 'Error al obtener las órdenes');
  }
};

// Procesar webhook de MercadoPago
export const processPaymentWebhook = async (paymentId: string): Promise<void> => {
  try {
    console.log('Processing MercadoPago webhook for payment ID:', paymentId);
    
    // Configurar MercadoPago
    const mercadopago = new MercadoPagoConfig({
      accessToken: BACK_CONFIG.mercado_pago_access_token
    });

    // Consultar el pago en MercadoPago
    const paymentResource = new Payment(mercadopago);
    const payment = await paymentResource.get({ id: paymentId });
    
    if (!payment.external_reference) {
      console.warn('Payment without external_reference:', paymentId);
      return;
    }

    const orderId = parseInt(payment.external_reference);

    // Buscar la orden en la base de datos
    const order = await prisma.orders.findUnique({
      where: { id: orderId }
    });

    if (!order) {
      console.warn('Order not found for external_reference:', orderId);
      return;
    }

    // Mapear estado de MercadoPago a nuestro sistema
    let orderStatus: string;
    let paymentStatus: string;

    switch (payment.status) {
      case 'approved':
        orderStatus = 'paid';
        paymentStatus = 'approved';
        break;
      case 'pending':
        orderStatus = 'pending';
        paymentStatus = 'pending';
        break;
      case 'rejected':
      case 'cancelled':
        orderStatus = 'pending';
        paymentStatus = 'rejected';
        break;
      default:
        orderStatus = order.status;
        paymentStatus = payment.status || '';
    }

    // Actualizar la orden
    await updateOrderStatusService(orderId, orderStatus);

    // Actualizar información de pago
    await prisma.orders.update({
      where: { id: orderId },
      data: {
        payment_status: paymentStatus,
        transaction_id: paymentId,
        paid_at: payment.status === 'approved' ? new Date() : null
      }
    });

    console.log(`Order ${orderId} updated with status: ${orderStatus}, payment: ${paymentStatus}`);
    
  } catch (error) {
    console.error('Error processing payment webhook:', error);
    throw error;
  }
};
