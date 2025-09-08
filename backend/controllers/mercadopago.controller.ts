import { Request, Response } from 'express';
import mercadopago from 'mercadopago';
import mercadoPagoService from '../services/mercadopago.service';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

class MercadoPagoController {
    /**
     * Crea una preferencia de pago para checkout
     * @route POST /api/payments/create-preference
     */
    async createPreference(req: Request, res: Response) {
        try {
            const { 
                items,
                user,
                shipping_address,
                back_urls,
                notification_url
            } = req.body;

            // Validar datos mínimos necesarios
            if (!items || !items.length || !user) {
                return res.status(400).json({ error: 'Datos incompletos para crear preferencia' });
            }

            // Obtener datos completos del usuario desde la BD
            const userData = await prisma.user.findUnique({
                where: { id: user.id }
            });

            if (!userData) {
                return res.status(404).json({ error: 'Usuario no encontrado' });
            }

            // Crear orden en base de datos
            const orderItems = items.map(item => ({
                product_id: parseInt(item.id),
                quantity: item.quantity,
                price: item.unit_price,
                subtotal: item.unit_price * item.quantity
            }));

            const subtotal = orderItems.reduce((sum, item) => sum + item.subtotal, 0);
            const shipping_cost = shipping_address ? 15000 : 0; // Costo de envío fijo o calculado
            const taxes = subtotal * 0.19; // IVA del 19%
            const total = subtotal + shipping_cost + taxes;

            // Crear la orden en la base de datos
            const newOrder = await prisma.orders.create({
                data: {
                    user_id: user.id,
                    status: 'pending',
                    subtotal: subtotal,
                    shipping_cost: shipping_cost,
                    taxes: taxes,
                    total: total,
                    payment_method: 'mercadopago',
                    payment_status: 'pending',
                    shipping_address_id: shipping_address ? shipping_address.id : null,
                    updated_by: user.id
                }
            });

            // Crear los items de la orden
            await Promise.all(orderItems.map(item => {
                return prisma.order_items.create({
                    data: {
                        order_id: newOrder.id,
                        product_id: item.product_id,
                        quantity: item.quantity,
                        price: item.price,
                        subtotal: item.subtotal
                    }
                });
            }));

            // Registrar log de creación de orden
            await prisma.order_logs.create({
                data: {
                    order_id: newOrder.id,
                    previous_status: 'pending',
                    new_status: 'pending',
                    note: 'Orden creada, pendiente de pago',
                    updated_by: user.id,
                    user_type: 'user'
                }
            });

            // Crear preferencia de pago
            const preference = await mercadoPagoService.createPreference({
                items: items.map(item => ({
                    id: item.id.toString(),
                    title: item.title,
                    description: item.description || 'Producto en NeoSale',
                    picture_url: item.picture_url,
                    category_id: item.category_id || 'others',
                    quantity: item.quantity,
                    currency_id: 'COP',
                    unit_price: item.unit_price
                })),
                payer: {
                    name: userData.name.split(' ')[0] || userData.name,
                    surname: userData.name.split(' ').slice(1).join(' ') || '',
                    email: userData.email,
                    phone: userData.phone_number ? {
                        area_code: '57',
                        number: userData.phone_number.replace(/\D/g, '')
                    } : undefined,
                    address: shipping_address ? {
                        street_name: shipping_address.address,
                        street_number: 0, // No tenemos número de calle separado
                        zip_code: '000000' // Colombia no usa ZIP codes de manera estándar
                    } : undefined
                },
                back_urls: back_urls || {
                    success: `${process.env.FRONTEND_URL}/orders/success`,
                    failure: `${process.env.FRONTEND_URL}/orders/failure`,
                    pending: `${process.env.FRONTEND_URL}/orders/pending`
                },
                auto_return: 'approved',
                payment_methods: {
                    excluded_payment_methods: [],
                    excluded_payment_types: [],
                    installments: 12 // Número máximo de cuotas
                },
                notification_url: notification_url || `${process.env.BACKEND_URL}/api/payments/webhook`,
                statement_descriptor: 'NEOSALE',
                external_reference: newOrder.id.toString(),
                expires: true
            });

            return res.status(200).json({
                id: preference.id,
                init_point: preference.init_point,
                order_id: newOrder.id
            });
        } catch (error) {
            console.error('Error creating payment preference:', error);
            return res.status(500).json({ error: 'Error al crear preferencia de pago' });
        }
    }

    /**
     * Procesa un pago con tarjeta de crédito directamente
     * @route POST /api/payments/process-card
     */
    async processCardPayment(req: Request, res: Response) {
        try {
            const {
                transaction_amount,
                token,
                description,
                installments,
                payment_method_id,
                issuer_id,
                payer,
                order_id
            } = req.body;

            // Validar datos necesarios
            if (!token || !transaction_amount || !payment_method_id || !payer) {
                return res.status(400).json({ error: 'Faltan datos requeridos para el pago' });
            }

            const payment = await mercadoPagoService.processCardPayment({
                transaction_amount,
                token,
                description,
                installments,
                payment_method_id,
                issuer_id,
                payer: {
                    email: payer.email,
                    identification: {
                        type: payer.identification.type,
                        number: payer.identification.number
                    }
                }
            });

            // Si hay un order_id, actualizar su estado
            if (order_id) {
                await prisma.orders.update({
                    where: { id: parseInt(order_id) },
                    data: {
                        status: payment.status === 'approved' ? 'paid' : 'pending',
                        payment_status: payment.status,
                        transaction_id: payment.id.toString(),
                        paid_at: payment.status === 'approved' ? new Date() : null
                    }
                });

                await prisma.order_logs.create({
                    data: {
                        order_id: parseInt(order_id),
                        previous_status: 'pending',
                        new_status: payment.status === 'approved' ? 'paid' : 'pending',
                        note: `Pago procesado con estado: ${payment.status}`,
                        updated_by: req.body.user_id || 1,
                        user_type: 'user'
                    }
                });
            }

            return res.status(200).json(payment);
        } catch (error) {
            console.error('Error processing card payment:', error);
            return res.status(500).json({ error: 'Error al procesar el pago con tarjeta' });
        }
    }

    /**
     * Recibe notificaciones de MercadoPago (Webhook)
     * @route POST /api/payments/webhook
     */
    async webhook(req: Request, res: Response) {
        try {
            const { type, data } = req.body;

            // MercadoPago envía notificaciones de diferentes tipos
            if (type === 'payment') {
                const paymentId = data.id;
                const result = await mercadoPagoService.handleWebhookNotification('payment', paymentId);
                return res.status(200).json(result);
            }

            // Para otros tipos de notificaciones
            return res.status(200).json({ received: true });
        } catch (error) {
            console.error('Error processing webhook:', error);
            return res.status(500).json({ error: 'Error al procesar la notificación' });
        }
    }

    /**
     * Obtiene el estado de un pago
     * @route GET /api/payments/:id
     */
    async getPayment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const payment = await mercadoPagoService.getPaymentStatus(id);
            return res.status(200).json(payment);
        } catch (error) {
            console.error(`Error getting payment ${req.params.id}:`, error);
            return res.status(500).json({ error: 'Error al obtener información del pago' });
        }
    }

    /**
     * Reembolsa un pago
     * @route POST /api/payments/:id/refund
     */
    async refundPayment(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const refund = await mercadoPagoService.refundPayment(id);
            return res.status(200).json(refund);
        } catch (error) {
            console.error(`Error refunding payment ${req.params.id}:`, error);
            return res.status(500).json({ error: 'Error al procesar el reembolso' });
        }
    }

    /**
     * Obtiene los métodos de pago disponibles
     * @route GET /api/payments/payment-methods
     */
    async getPaymentMethods(req: Request, res: Response) {
        try {
            const paymentMethods = await mercadopago.payment_methods.listAll();
            return res.status(200).json(paymentMethods.body);
        } catch (error) {
            console.error('Error getting payment methods:', error);
            return res.status(500).json({ error: 'Error al obtener métodos de pago' });
        }
    }
}

export default new MercadoPagoController();
