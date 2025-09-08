import mercadopago from 'mercadopago';
import { PrismaClient, orders_status_enum } from '@prisma/client';
import { BACK_CONFIG } from '../config/credentials';

const prisma = new PrismaClient();

// Configurar MercadoPago con las credenciales (versión correcta)
const mpClient = new mercadopago.MercadoPagoConfig({
    accessToken: BACK_CONFIG.mercado_pago_access_token
});

// Definición de interfaz para preferencia sin depender de la importación que falla
export interface CreatePreferencePayload {
    items: Array<{
        id: string;
        title: string;
        description?: string;
        picture_url?: string;
        category_id?: string;
        quantity: number;
        currency_id?: string;
        unit_price: number;
    }>;
    payer?: {
        name?: string;
        surname?: string;
        email?: string;
        phone?: {
            area_code?: string;
            number?: string;
        };
        address?: {
            street_name?: string;
            street_number?: number;
            zip_code?: string;
        };
    };
    back_urls?: {
        success?: string;
        failure?: string;
        pending?: string;
    };
    auto_return?: string;
    payment_methods?: {
        excluded_payment_methods?: Array<{ id: string }>;
        excluded_payment_types?: Array<{ id: string }>;
        installments?: number;
    };
    notification_url?: string;
    statement_descriptor?: string;
    external_reference?: string;
    expires?: boolean;
}

export interface CreatePreferenceInput {
    items: Array<{
        id: string;
        title: string;
        description: string;
        picture_url?: string;
        category_id?: string;
        quantity: number;
        currency_id: string;
        unit_price: number;
    }>;
    payer: {
        name: string;
        surname: string;
        email: string;
        phone?: {
            area_code: string;
            number: string;
        };
        address?: {
            street_name: string;
            street_number: number;
            zip_code: string;
        };
    };
    back_urls: {
        success: string;
        failure: string;
        pending: string;
    };
    auto_return?: string;
    payment_methods?: {
        excluded_payment_methods: Array<{ id: string }>;
        excluded_payment_types: Array<{ id: string }>;
        installments: number;
    };
    notification_url?: string;
    statement_descriptor?: string;
    external_reference?: string;
    expires?: boolean;
}

export interface CardPaymentInput {
    transaction_amount: number;
    token: string;
    description: string;
    installments: number;
    payment_method_id: string;
    issuer_id: string;
    payer: {
        email: string;
        identification: {
            type: string;
            number: string;
        }
    }
}

class MercadoPagoService {
    /**
     * Crea una preferencia de pago en MercadoPago
     * @param preferenceData Datos para crear la preferencia
     * @returns Preferencia creada con ID y URL de pago
     */
    async createPreference(preferenceData: CreatePreferenceInput) {
        try {
            const preference: CreatePreferencePayload = {
                items: preferenceData.items,
                payer: preferenceData.payer,
                back_urls: preferenceData.back_urls,
                auto_return: preferenceData.auto_return || 'approved',
                payment_methods: preferenceData.payment_methods,
                notification_url: preferenceData.notification_url,
                statement_descriptor: preferenceData.statement_descriptor,
                external_reference: preferenceData.external_reference,
                expires: preferenceData.expires
            };

            const response = await mpClient.preferences.create(preference);
            return response.body;
        } catch (error) {
            console.error('Error creating MercadoPago preference:', error);
            throw new Error('Error al crear preferencia de pago');
        }
    }

    /**
     * Procesa un pago con tarjeta directamente
     * @param paymentData Datos del pago con tarjeta
     * @returns Resultado del procesamiento del pago
     */
    async processCardPayment(paymentData: CardPaymentInput) {
        try {
            const payment = await mpClient.payment.create(paymentData);
            return payment.body;
        } catch (error) {
            console.error('Error processing card payment:', error);
            throw new Error('Error al procesar el pago con tarjeta');
        }
    }

    /**
     * Obtiene el estado de un pago específico
     * @param paymentId ID del pago a consultar
     * @returns Detalles del pago
     */
    async getPaymentStatus(paymentId: string) {
        try {
            const payment = await mpClient.payment.get(paymentId);
            return payment.body;
        } catch (error) {
            console.error(`Error getting payment status for ID ${paymentId}:`, error);
            throw new Error('Error al consultar estado del pago');
        }
    }

    /**
     * Genera una URL para crear un token de tarjeta
     * @param cardData Datos de la tarjeta
     * @returns Token de tarjeta
     */
    async createCardToken(cardData: any) {
        try {
            // MercadoPago.js se encarga de esto en el frontend
            // Este método es solo referencial ya que los tokens se generan
            // directamente en el frontend para mayor seguridad
            throw new Error('Este método debe ser llamado desde el frontend usando MercadoPago.js');
        } catch (error) {
            console.error('Error creating card token:', error);
            throw error;
        }
    }

    /**
     * Reembolsa un pago completo
     * @param paymentId ID del pago a reembolsar
     * @returns Resultado del reembolso
     */
    async refundPayment(paymentId: string) {
        try {
            const refund = await mpClient.refund.create({ payment_id: parseInt(paymentId) });
            
            // Actualizar el estado de la orden en la base de datos
            const payment = await this.getPaymentStatus(paymentId);
            if (payment && payment.external_reference) {
                const orderId = payment.external_reference;
                await prisma.orders.update({
                    where: { id: parseInt(orderId) },
                    data: { 
                        status: 'refunded',
                        payment_status: 'refunded'
                    }
                });
                
                // Registrar log de la orden
                await prisma.order_logs.create({
                    data: {
                        order_id: parseInt(orderId),
                        previous_status: 'paid', // Asumimos que estaba pagada
                        new_status: 'refunded',
                        note: `Reembolso procesado con ID: ${refund.body.id}`,
                        updated_by: 1, // ID del sistema
                        user_type: 'system'
                    }
                });
            }
            
            return refund.body;
        } catch (error) {
            console.error(`Error refunding payment ${paymentId}:`, error);
            throw new Error('Error al procesar el reembolso');
        }
    }

    /**
     * Escucha las notificaciones de MercadoPago (Webhook handler)
     * @param topic Tipo de notificación
     * @param id ID del recurso notificado
     * @returns Resultado del procesamiento de la notificación
     */
    async handleWebhookNotification(topic: string, id: string) {
        try {
            if (topic === 'payment') {
                const paymentInfo = await this.getPaymentStatus(id);
                
                // Procesar la actualización del pago según su estado
                // y actualizar la orden en la base de datos
                if (paymentInfo && paymentInfo.external_reference) {
                    const orderId = paymentInfo.external_reference;
                    // Importar el enum de status de Prisma
                    // import { orders_status_enum } from '@prisma/client'; (agrega esto al inicio del archivo si no está)

                    let newStatus: import('@prisma/client').orders_status_enum;
                    let newPaymentStatus: string;
                    
                    switch (paymentInfo.status) {
                        case 'approved':
                            newStatus = 'paid';
                            newPaymentStatus = 'paid';
                            break;
                        case 'pending':
                            newStatus = 'pending';
                            newPaymentStatus = 'pending';
                            break;
                        case 'rejected':
                            newStatus = 'cancelled';
                            newPaymentStatus = 'rejected';
                            break;
                        case 'refunded':
                            newStatus = 'refunded';
                            newPaymentStatus = 'refunded';
                            break;
                        default:
                            newStatus = 'pending';
                            newPaymentStatus = 'pending';
                    }
                    
                    // Actualizar la orden
                    await prisma.orders.update({
                        where: { id: parseInt(orderId) },
                        data: { 
                            status: newStatus,
                            payment_status: newPaymentStatus,
                            transaction_id: id,
                            paid_at: newStatus === 'paid' ? new Date() : null
                        }
                    });
                    
                    // Registrar log de la orden
                    const orderBefore = await prisma.orders.findUnique({
                        where: { id: parseInt(orderId) }
                    });
                    
                    if (orderBefore) {
                        await prisma.order_logs.create({
                            data: {
                                order_id: parseInt(orderId),
                                previous_status: orderBefore.status,
                                new_status: newStatus,
                                note: `Actualización de estado por notificación de MercadoPago: ${paymentInfo.status}`,
                                updated_by: 1, // ID del sistema
                                user_type: 'system'
                            }
                        });
                    }
                }
                
                return { success: true, message: 'Webhook procesado correctamente' };
            }
            
            return { success: true, message: 'Notificación recibida pero no procesada' };
        } catch (error) {
            console.error('Error handling webhook notification:', error);
            throw new Error('Error al procesar notificación de webhook');
        }
    }
}

export default new MercadoPagoService();
