import { MercadoPagoConfig, Payment, CardToken } from 'mercadopago';
import { BACK_CONFIG } from '../config/credentials';

// Extend MercadoPago types with additional properties
interface ExtendedPaymentResponse {
  id?: number;
  status?: string;
  status_detail?: string;
  transaction_amount?: number;
  date_created?: string;
  date_approved?: string | null;
  net_received_amount?: number;
  fee_details?: FeeDetail[];
  authorization_code?: string | null;
  external_reference?: string | null;
  transaction_details?: {
    payment_method_reference_id?: string | null;
    net_received_amount?: number;
    total_paid_amount?: number;
    overpaid_amount?: number;
    external_resource_url?: string | null;
    installment_amount?: number;
    financial_institution?: string | null;
  };
  card?: {
    id?: string | null;
    first_six_digits?: string;
    last_four_digits?: string;
    expiration_month?: number;
    expiration_year?: number;
    date_created?: string;
    date_last_updated?: string;
    cardholder?: {
      name?: string;
      identification?: {
        number?: string;
        type?: string;
      };
    };
  };
}

interface CardData {
  card_number: string;
  security_code: string;
  expiration_month: string;
  expiration_year: string;
  cardholder: {
    name: string;
    identification?: {
      type: string;
      number: string;
    };
  };
}

interface PaymentRequest {
  token: string;
  transaction_amount: number;
  description: string;
  payment_method_id: string;
  installments: number;
  payer: {
    email: string;
    identification: {
      type: string;
      number: string;
    };
  };
  external_reference?: string;
  notification_url?: string;
}

interface FeeDetail {
  type: string;
  amount: number;
  fee_payer: string;
}

interface PaymentResponse {
  id: number;
  status: string;
  status_detail: string;
  transaction_amount: number;
  net_received_amount?: number;
  fee_details?: FeeDetail[];
  date_created: string;
  date_approved?: string | null;
  authorization_code?: string | null;
  external_reference?: string | null;
  transaction_details?: {
    payment_method_reference_id?: string | null;
    net_received_amount?: number;
    total_paid_amount?: number;
    overpaid_amount?: number;
    external_resource_url?: string | null;
    installment_amount?: number;
    financial_institution?: string | null;
  };
  card?: {
    id?: string | null;
    first_six_digits: string;
    last_four_digits: string;
    expiration_month: number;
    expiration_year: number;
    date_created?: string;
    date_last_updated?: string;
    cardholder: {
      name: string;
      identification?: {
        number: string;
        type: string;
      };
    };
  };
}

class CardPaymentService {
  private client: MercadoPagoConfig;
  private payment: Payment;
  private cardToken: CardToken;

  constructor() {
    if (!BACK_CONFIG.mercado_pago_access_token) {
      throw new Error('Mercado Pago access token no está configurado');
    }

    this.client = new MercadoPagoConfig({
      accessToken: BACK_CONFIG.mercado_pago_access_token
    });

    this.payment = new Payment(this.client);
    this.cardToken = new CardToken(this.client);
  }

  /**
   * Valida los datos de la tarjeta antes de tokenizarla
   * @param cardData - Datos de la tarjeta
   * @returns Datos validados
   */
  validateCardData(cardData: CardData): CardData {
    const requiredFields = ['card_number', 'security_code', 'expiration_month', 'expiration_year'];
    const missingFields = requiredFields.filter(field => !cardData[field as keyof CardData]);

    if (missingFields.length > 0) {
      throw new Error(`Campos requeridos de tarjeta faltantes: ${missingFields.join(', ')}`);
    }

    if (!cardData.cardholder?.name) {
      throw new Error('Nombre del titular de la tarjeta es requerido');
    }

    // Validar formato del número de tarjeta (solo dígitos, 13-19 caracteres)
    const cleanCardNumber = cardData.card_number.replace(/\s/g, '');
    if (!/^\d{13,19}$/.test(cleanCardNumber)) {
      throw new Error('Número de tarjeta inválido');
    }

    // Validar código de seguridad (3 o 4 dígitos)
    if (!/^\d{3,4}$/.test(cardData.security_code)) {
      throw new Error('Código de seguridad inválido');
    }

    // Validar mes de expiración (01-12)
    const month = parseInt(cardData.expiration_month);
    if (month < 1 || month > 12) {
      throw new Error('Mes de expiración inválido');
    }

    // Validar año de expiración (no puede ser pasado)
    const year = parseInt(cardData.expiration_year);
    const currentYear = new Date().getFullYear();
    if (year < currentYear || year > currentYear + 20) {
      throw new Error('Año de expiración inválido');
    }

    // Validar que la tarjeta no esté vencida
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1;
    if (year === currentYear && month < currentMonth) {
      throw new Error('La tarjeta está vencida');
    }

    return {
      ...cardData,
      card_number: cleanCardNumber, // Remover espacios
      expiration_month: cardData.expiration_month.padStart(2, '0'), // Asegurar 2 dígitos
      cardholder: {
        ...cardData.cardholder,
        name: cardData.cardholder.name.trim().toUpperCase() // Normalizar nombre
      }
    };
  }

  /**
   * Crea un token de tarjeta para usar en pagos
   * @param cardData - Datos de la tarjeta
   * @returns Token de la tarjeta
   */
  async createCardToken(cardData: CardData): Promise<string> {
    try {
      const validatedData = this.validateCardData(cardData);

      const tokenResponse = await this.cardToken.create({
        body: {
          card_number: validatedData.card_number,
          security_code: validatedData.security_code,
          expiration_month: validatedData.expiration_month,
          expiration_year: validatedData.expiration_year,
        }
      });

      if (!tokenResponse.id) {
        throw new Error('Error al crear el token de la tarjeta');
      }

      return tokenResponse.id;
    } catch (error: unknown) {
      console.error('Error creando token de tarjeta:', error);
      throw new Error(error instanceof Error ? error.message : 'Error al tokenizar la tarjeta');
    }
  }

  /**
   * Procesa un pago con tarjeta
   * @param paymentData - Datos del pago
   * @returns Resultado del pago
   */
  async processCardPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const paymentResponse = await this.payment.create({
        body: {
          token: paymentData.token,
          transaction_amount: paymentData.transaction_amount,
          description: paymentData.description,
          payment_method_id: paymentData.payment_method_id,
          installments: paymentData.installments,
          payer: paymentData.payer,
          external_reference: paymentData.external_reference,
          notification_url: paymentData.notification_url,
          statement_descriptor: 'NEOSALE', // Nombre que aparece en el estado de cuenta
          capture: true, // Capturar el pago inmediatamente
          binary_mode: false // Permitir estados pending
        }
      });

      // Map MercadoPago response to your custom PaymentResponse type
      const extendedResponse = paymentResponse as ExtendedPaymentResponse;
      const mappedPayment: PaymentResponse = {
        id: extendedResponse.id ?? 0,
        status: extendedResponse.status ?? 'unknown',
        status_detail: extendedResponse.status_detail ?? 'unknown',
        transaction_amount: extendedResponse.transaction_amount ?? 0,
        net_received_amount: extendedResponse.net_received_amount ?? 0,
        fee_details: extendedResponse.fee_details ?? [],
        date_created: extendedResponse.date_created ?? '',
        date_approved: extendedResponse.date_approved ?? null,
        authorization_code: extendedResponse.authorization_code ?? null,
        external_reference: extendedResponse.external_reference ?? null,
        transaction_details: {
          payment_method_reference_id: extendedResponse.transaction_details?.payment_method_reference_id ?? null,
          net_received_amount: extendedResponse.transaction_details?.net_received_amount ?? 0,
          total_paid_amount: extendedResponse.transaction_details?.total_paid_amount ?? 0,
          overpaid_amount: extendedResponse.transaction_details?.overpaid_amount ?? 0,
          external_resource_url: extendedResponse.transaction_details?.external_resource_url ?? null,
          installment_amount: extendedResponse.transaction_details?.installment_amount ?? 0,
          financial_institution: extendedResponse.transaction_details?.financial_institution ?? null,
        },
        card: {
          id: extendedResponse.card?.id ?? null,
          first_six_digits: extendedResponse.card?.first_six_digits ?? '',
          last_four_digits: extendedResponse.card?.last_four_digits ?? '',
          expiration_month: extendedResponse.card?.expiration_month ?? 0,
          expiration_year: extendedResponse.card?.expiration_year ?? 0,
          date_created: extendedResponse.card?.date_created ?? '',
          date_last_updated: extendedResponse.card?.date_last_updated ?? '',
          cardholder: {
            name: extendedResponse.card?.cardholder?.name ?? '',
            identification: {
              number: extendedResponse.card?.cardholder?.identification?.number ?? '',
              type: extendedResponse.card?.cardholder?.identification?.type ?? ''
            }
          }
        }
      };

      return mappedPayment;
    } catch (error) {
      console.error('Error procesando pago con tarjeta:', error);
      throw new Error(error instanceof Error ? error.message : 'Error al procesar el pago');
    }
  }

  /**
   * Flujo completo: tokenizar tarjeta y procesar pago
   * @param cardData - Datos de la tarjeta
   * @param paymentInfo - Información del pago (monto, descripción, etc.)
   * @returns Resultado del pago
   */
  async processPaymentWithCard(
    cardData: CardData, 
    paymentInfo: {
      transaction_amount: number;
      description: string;
      payment_method_id: string;
      installments: number;
      payer: {
        email: string;
        identification: {
          type: string;
          number: string;
        };
      };
      external_reference?: string;
      notification_url?: string;
    }
  ): Promise<{
    token: string;
    payment: PaymentResponse;
    success: boolean;
    message: string;
  }> {
    try {
      // 1. Crear token de la tarjeta
      const token = await this.createCardToken(cardData);

      // 2. Procesar el pago con el token
      const payment = await this.processCardPayment({
        token,
        ...paymentInfo
      });

      return {
        token,
        payment,
        success: payment.status === 'approved',
        message: this.getPaymentStatusMessage(payment.status, payment.status_detail)
      };

    } catch (error) {
      console.error('Error en flujo completo de pago:', error);
      throw error;
    }
  }

  /**
   * Obtiene un mensaje descriptivo del estado del pago
   * @param status - Estado del pago
   * @param statusDetail - Detalle del estado
   * @returns Mensaje descriptivo
   */
  private getPaymentStatusMessage(status: string, statusDetail: string): string {
    const messages: { [key: string]: string } = {
      'approved': 'Pago aprobado exitosamente',
      'pending': 'Pago pendiente de aprobación',
      'authorized': 'Pago autorizado, pendiente de captura',
      'in_process': 'Pago en proceso',
      'in_mediation': 'Pago en mediación',
      'rejected': 'Pago rechazado',
      'cancelled': 'Pago cancelado',
      'refunded': 'Pago reembolsado',
      'charged_back': 'Pago contracargo'
    };

    const detailMessages: { [key: string]: string } = {
      'cc_rejected_insufficient_amount': 'Fondos insuficientes',
      'cc_rejected_bad_filled_card_number': 'Número de tarjeta inválido',
      'cc_rejected_bad_filled_date': 'Fecha de vencimiento inválida',
      'cc_rejected_bad_filled_security_code': 'Código de seguridad inválido',
      'cc_rejected_bad_filled_other': 'Datos de tarjeta incorrectos',
      'cc_rejected_blacklist': 'Tarjeta en lista negra',
      'cc_rejected_call_for_authorize': 'Contactar banco para autorizar',
      'cc_rejected_card_disabled': 'Tarjeta deshabilitada',
      'cc_rejected_duplicated_payment': 'Pago duplicado',
      'cc_rejected_high_risk': 'Pago de alto riesgo'
    };

    return detailMessages[statusDetail] || messages[status] || 'Estado desconocido';
  }

  /**
   * Consulta un pago específico por ID
   * @param paymentId - ID del pago
   * @returns Información del pago
   */
  async getPayment(paymentId: number): Promise<PaymentResponse> {
    try {
      const payment = await this.payment.get({ id: paymentId });
      // Map MercadoPago response to your custom PaymentResponse type
      const extendedPayment = payment as ExtendedPaymentResponse;
      const mappedPayment: PaymentResponse = {
        id: extendedPayment.id ?? 0,
        status: extendedPayment.status ?? 'unknown',
        status_detail: extendedPayment.status_detail ?? 'unknown',
        transaction_amount: extendedPayment.transaction_amount ?? 0,
        net_received_amount: extendedPayment.net_received_amount ?? 0,
        fee_details: extendedPayment.fee_details ?? [],
        date_created: extendedPayment.date_created ?? '',
        date_approved: extendedPayment.date_approved ?? null,
        authorization_code: extendedPayment.authorization_code ?? null,
        external_reference: extendedPayment.external_reference ?? null,
        transaction_details: {
          payment_method_reference_id: extendedPayment.transaction_details?.payment_method_reference_id ?? null,
          net_received_amount: extendedPayment.transaction_details?.net_received_amount ?? 0,
          total_paid_amount: extendedPayment.transaction_details?.total_paid_amount ?? 0,
          overpaid_amount: extendedPayment.transaction_details?.overpaid_amount ?? 0,
          external_resource_url: extendedPayment.transaction_details?.external_resource_url ?? null,
          installment_amount: extendedPayment.transaction_details?.installment_amount ?? 0,
          financial_institution: extendedPayment.transaction_details?.financial_institution ?? null,
        },
        card: {
          id: extendedPayment.card?.id ?? null,
          first_six_digits: extendedPayment.card?.first_six_digits ?? '',
          last_four_digits: extendedPayment.card?.last_four_digits ?? '',
          expiration_month: extendedPayment.card?.expiration_month ?? 0,
          expiration_year: extendedPayment.card?.expiration_year ?? 0,
          date_created: extendedPayment.card?.date_created ?? '',
          date_last_updated: extendedPayment.card?.date_last_updated ?? '',
          cardholder: {
            name: extendedPayment.card?.cardholder?.name ?? '',
            identification: {
              number: extendedPayment.card?.cardholder?.identification?.number ?? '',
              type: extendedPayment.card?.cardholder?.identification?.type ?? ''
            }
          }
        }
      };
      return mappedPayment;
    } catch (error) {
      console.error('Error consultando pago:', error);
      throw new Error('Error al consultar el pago');
    }
  }

  /**
   * Cancela un pago autorizado pero no capturado
   * @param paymentId - ID del pago
   * @returns Resultado de la cancelación
   */
  async cancelPayment(paymentId: number): Promise<PaymentResponse> {
    try {
      const payment = await this.payment.cancel({ id: paymentId });
      return payment as PaymentResponse;
    } catch (error) {
      console.error('Error cancelando pago:', error);
      throw new Error('Error al cancelar el pago');
    }
  }

  /**
   * Reembolsa un pago total o parcialmente
   * @param paymentId - ID del pago
   * @param amount - Monto a reembolsar (opcional, si no se especifica se reembolsa todo)
   * @returns Resultado del reembolso
   */
  async refundPayment(paymentId: number, amount?: number) {
    try {
      // Note: For refunds, you typically need to use the MercadoPago Refund API
      // This is a placeholder implementation - you'll need to implement according to your needs
      console.log(`Refund requested for payment ${paymentId}${amount ? ` amount: ${amount}` : ' (full refund)'}`);
      throw new Error('Refund functionality needs to be implemented with proper MercadoPago Refund API');
    } catch (error) {
      console.error('Error procesando reembolso:', error);
      throw new Error('Error al procesar el reembolso');
    }
  }
}

export default CardPaymentService;
export { CardData, PaymentRequest, PaymentResponse };
