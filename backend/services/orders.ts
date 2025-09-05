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
  productId,
  quantity,
  colorCode,
  size,
  shippingAddressId
}: CreateOrderRequest): Promise<CreateOrderResponse> => {
  try {
    // 1. Obtener el producto con sus relaciones
    const product = await prisma.products.findUnique({
      where: { id: productId },
      include: {
        brands: true,
        categories: true,
        product_variants: {
          where: {
            color_code: colorCode || undefined,
            size: size || undefined,
            active: true
          }
        }
      }
    });

    if (!product) {
      throw new Error('Producto no encontrado');
    }

    if (!product.active) {
      throw new Error('Producto no disponible');
    }

    // 2. Verificar variante específica si se proporcionó color/size
    let variant = null;
    let unitPrice = product.price;
    let availableStock = product.stock;

    if (colorCode && size) {
      variant = product.product_variants.find(
        v => v.color_code === colorCode && v.size === size
      );

      if (!variant) {
        throw new Error(`Variante no disponible: ${colorCode} - ${size}`);
      }

      if (!variant.active) {
        throw new Error('Variante no disponible');
      }

      // Usar precio de la variante si existe, sino el del producto
      unitPrice = variant.price || product.price;
      availableStock = variant.stock;
    }

    // 3. Verificar stock disponible
    if (availableStock < quantity) {
      throw new Error(`Stock insuficiente. Disponible: ${availableStock}`);
    }

    // 4. Calcular precio con ofertas
    if (product.in_offer && product.offer_discount && product.offer_end_date && new Date() < product.offer_end_date) {
      const discountAmount = unitPrice * (Number(product.offer_discount) / 100);
      unitPrice = Math.round(unitPrice - discountAmount);
    }

    // 5. Obtener información del usuario
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      throw new Error('Usuario no encontrado');
    }

    // 6. Verificar que la dirección de envío pertenece al usuario
    const address = await prisma.addresses.findFirst({
      where: { 
        id: shippingAddressId,
        user_id: userId 
      }
    });

    if (!address) {
      throw new Error('Dirección de envío no válida');
    }

    // 7. Calcular totales
    const subtotal = unitPrice * quantity;
    const shippingCost = subtotal >= 100000 ? 0 : 15000; // Envío gratis para compras mayores a $100,000
    const taxes = Math.round(subtotal * 0.19); // IVA 19%
    const total = subtotal + shippingCost + taxes;

    // 8. Crear la orden en la base de datos
    const order = await prisma.orders.create({
      data: {
        user_id: userId,
        subtotal: subtotal,
        shipping_cost: shippingCost,
        taxes: taxes,
        total: total,
        status: 'pending',
        payment_status: 'pending',
        shipping_address_id: shippingAddressId,
        updated_by: userId,
        order_items: {
          create: {
            product_id: productId,
            quantity: quantity,
            price: unitPrice,
            subtotal: subtotal,
            color_code: colorCode,
            size: size
          }
        }
      }
    });

    // 9. Crear preferencia en MercadoPago
    const mercadopago = new MercadoPagoConfig({
      accessToken: BACK_CONFIG.mercado_pago_access_token
    });

    const preference = new Preference(mercadopago);

    const preferenceData = {
      items: [
        {
          id: product.id.toString(),
          title: product.name,
          description: `${product.description}${colorCode ? ` - Color: ${colorCode}` : ''}${size ? `, Talla: ${size}` : ''}`,
          unit_price: Number(unitPrice),
          quantity: quantity,
          currency_id: 'COP'
        }
      ],
      payer: {
        name: user.name,
        email: user.email
      },
      back_urls: {
        success: `${BACK_CONFIG.frontend_url}/payment/success`,
        failure: `${BACK_CONFIG.frontend_url}/payment/failure`,
        pending: `${BACK_CONFIG.frontend_url}/payment/pending`
      },
      auto_return: 'approved',
      external_reference: order.id.toString(),
      notification_url: `${BACK_CONFIG.backend_url}/api/orders/webhook/mercadopago`,
      shipments: {
        cost: shippingCost,
        mode: 'not_specified'
      }
    };

    const response = await preference.create({ body: preferenceData });
    
    if (!response.id || !response.init_point) {
      throw new Error('Error al crear la preferencia de pago en MercadoPago');
    }

    // 10. Actualizar la orden con el preference_id
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

export const getUserCartService = async (userId: number) => {
  try {
    const cart = await prisma.cart.findFirst({
      where: { user_id: userId },
      include: {
        cart_items: {
          include: {
            products: {
              include: {
                brands: true,
                categories: true,
                product_variants: {
                  where: { active: true }
                }
              }
            }
          }
        },
        users: {
          select: { id: true, name: true, email: true }
        }
      }
    });

    if (!cart) {
      return {
        id: null,
        user_id: userId,
        subtotal: 0,
        items: [],
        itemCount: 0
      };
    }

    // Calcular información adicional del carrito
    const items = cart.cart_items.map(item => {
      const product = item.products;
      const variant = product.product_variants.find(
        v => v.color_code === item.color_code && v.size === item.size
      );

      return {
        id: item.id,
        productId: product.id,
        productName: product.name,
        quantity: item.quantity,
        unitPrice: item.unit_price,
        subtotal: item.quantity * item.unit_price,
        colorCode: item.color_code,
        size: item.size,
        brand: product.brands.name,
        category: product.categories.name,
        availableStock: variant?.stock || 0,
        isAvailable: variant ? variant.stock >= item.quantity : false
      };
    });

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const calculatedSubtotal = items.reduce((sum, item) => sum + item.subtotal, 0);

    return {
      id: cart.id,
      user_id: cart.user_id,
      subtotal: calculatedSubtotal,
      items: items,
      itemCount: totalItems,
      created_at: cart.created_at,
      expires_at: cart.expires_at
    };

  } catch (error) {
    console.error('Error in getUserCartService:', error);
    throw new Error(error instanceof Error ? error.message : 'Error al obtener el carrito');
  }
};

export const addToCartService = async (
  userId: number,
  productId: number,
  quantity: number,
  colorCode?: string,
  size?: string
) => {
  try {
    // 1. Verificar que el producto y variante existen
    const availability = await checkVariantAvailabilityService(productId, colorCode || '', size || '');
    
    if (!availability.available) {
      throw new Error(availability.message);
    }

    if (availability.stock < quantity) {
      throw new Error(`Stock insuficiente. Disponible: ${availability.stock}`);
    }

    // 2. Buscar o crear carrito del usuario
    let cart = await prisma.cart.findFirst({
      where: { user_id: userId }
    });

    if (!cart) {
      cart = await prisma.cart.create({
        data: {
          user_id: userId,
          subtotal: 0,
          expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 días
        }
      });
    }

    // 3. Verificar si el item ya existe en el carrito
    const existingItem = await prisma.cart_items.findFirst({
      where: {
        cart_id: cart.id,
        product_id: productId,
        color_code: colorCode,
        size: size
      }
    });

    let cartItem;
    
    if (existingItem) {
      // Actualizar cantidad del item existente
      const newQuantity = existingItem.quantity + quantity;
      
      if (availability.stock < newQuantity) {
        throw new Error(`Stock insuficiente para la cantidad total. Disponible: ${availability.stock}, En carrito: ${existingItem.quantity}`);
      }

      cartItem = await prisma.cart_items.update({
        where: { id: existingItem.id },
        data: { quantity: newQuantity }
      });
    } else {
      // Crear nuevo item en el carrito
      cartItem = await prisma.cart_items.create({
        data: {
          cart_id: cart.id,
          product_id: productId,
          quantity: quantity,
          unit_price: availability.price || 0,
          color_code: colorCode,
          size: size
        }
      });
    }

    // 4. Recalcular subtotal del carrito
    const cartItems = await prisma.cart_items.findMany({
      where: { cart_id: cart.id }
    });

    const newSubtotal = cartItems.reduce((sum, item) => sum + (item.quantity * item.unit_price), 0);

    await prisma.cart.update({
      where: { id: cart.id },
      data: { subtotal: newSubtotal }
    });

    return {
      cartId: cart.id,
      itemId: cartItem.id,
      message: existingItem ? 'Cantidad actualizada en el carrito' : 'Producto agregado al carrito',
      productId,
      quantity: cartItem.quantity,
      unitPrice: availability.price,
      subtotal: (availability.price || 0) * cartItem.quantity,
      cartSubtotal: newSubtotal
    };

  } catch (error) {
    console.error('Error in addToCartService:', error);
    throw new Error(error instanceof Error ? error.message : 'Error al agregar al carrito');
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
