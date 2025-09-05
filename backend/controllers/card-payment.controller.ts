import { Request, Response, NextFunction } from 'express';
import CardPaymentService, { CardData } from '../services/card-payment.service';
import { prisma } from '../lib/prisma';

const cardPaymentService = new CardPaymentService();

/**
 * Crear token de tarjeta
 * POST /api/payments/card/token
 */
export const createCardToken = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const cardData: CardData = req.body;

    // Validar datos requeridos
    if (!cardData.card_number || !cardData.security_code || 
        !cardData.expiration_month || !cardData.expiration_year || !cardData.cardholder) {
      res.status(400).json({
        success: false,
        message: 'Todos los campos de la tarjeta son requeridos'
      });
      return;
    }

    const token = await cardPaymentService.createCardToken(cardData);

    res.json({
      success: true,
      message: 'Token creado exitosamente',
      data: {
        token,
        // No devolver datos sensibles de la tarjeta
        card_info: {
          first_six_digits: cardData.card_number.substring(0, 6),
          last_four_digits: cardData.card_number.slice(-4),
          cardholder: cardData.cardholder
        }
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Procesar pago con token de tarjeta
 * POST /api/payments/card/process
 */
export const processCardPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      token,
      transaction_amount,
      description,
      payment_method_id,
      installments,
      payer,
      external_reference
    } = req.body;

    // Validaciones básicas
    if (!token || !transaction_amount || !payment_method_id || !payer?.email) {
      res.status(400).json({
        success: false,
        message: 'Datos de pago incompletos'
      });
      return;
    }

    const paymentResult = await cardPaymentService.processCardPayment({
      token,
      transaction_amount,
      description: description || 'Compra en NeoSale',
      payment_method_id,
      installments: installments || 1,
      payer,
      external_reference,
      notification_url: `${process.env.BACKEND_URL}/api/payments/webhook/mercadopago`
    });

    // Actualizar orden si hay external_reference
    if (external_reference) {
      try {
        await prisma.orders.update({
          where: { id: parseInt(external_reference) },
          data: {
            transaction_id: paymentResult.id.toString(),
            payment_status: paymentResult.status,
            paid_at: paymentResult.status === 'approved' ? new Date() : null
          }
        });
      } catch (dbError) {
        console.warn('Error updating order:', dbError);
        // No fallar el pago por error de BD
      }
    }

    res.json({
      success: paymentResult.status === 'approved',
      message: cardPaymentService['getPaymentStatusMessage'](
        paymentResult.status, 
        paymentResult.status_detail
      ),
      data: {
        payment_id: paymentResult.id,
        status: paymentResult.status,
        status_detail: paymentResult.status_detail,
        transaction_amount: paymentResult.transaction_amount,
        net_received_amount: paymentResult.net_received_amount,
        date_created: paymentResult.date_created,
        date_approved: paymentResult.date_approved,
        authorization_code: paymentResult.authorization_code,
        card: paymentResult.card ? {
          first_six_digits: paymentResult.card.first_six_digits,
          last_four_digits: paymentResult.card.last_four_digits,
          cardholder: paymentResult.card.cardholder
        } : null
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Flujo completo: tokenizar y pagar
 * POST /api/payments/card/complete
 */
export const processCompleteCardPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const {
      card_data,
      payment_info
    } = req.body;

    // Validar datos de tarjeta
    if (!card_data?.card_number || !card_data?.security_code || 
        !card_data?.expiration_month || !card_data?.expiration_year || !card_data?.cardholder) {
      res.status(400).json({
        success: false,
        message: 'Datos de tarjeta incompletos'
      });
      return;
    }

    // Validar información de pago
    if (!payment_info?.transaction_amount || !payment_info?.payment_method_id || !payment_info?.payer?.email) {
      res.status(400).json({
        success: false,
        message: 'Información de pago incompleta'
      });
      return;
    }

    const result = await cardPaymentService.processPaymentWithCard(
      card_data,
      {
        ...payment_info,
        description: payment_info.description || 'Compra en NeoSale',
        installments: payment_info.installments || 1,
        notification_url: `${process.env.BACKEND_URL}/api/payments/webhook/mercadopago`
      }
    );

    // Actualizar orden si hay external_reference
    if (payment_info.external_reference) {
      try {
        await prisma.orders.update({
          where: { id: parseInt(payment_info.external_reference) },
          data: {
            transaction_id: result.payment.id.toString(),
            payment_status: result.payment.status,
            paid_at: result.payment.status === 'approved' ? new Date() : null
          }
        });
      } catch (dbError) {
        console.warn('Error updating order:', dbError);
      }
    }

    res.json({
      success: result.success,
      message: result.message,
      data: {
        token: result.token,
        payment_id: result.payment.id,
        status: result.payment.status,
        status_detail: result.payment.status_detail,
        transaction_amount: result.payment.transaction_amount,
        net_received_amount: result.payment.net_received_amount,
        date_created: result.payment.date_created,
        date_approved: result.payment.date_approved,
        authorization_code: result.payment.authorization_code,
        card: result.payment.card ? {
          first_six_digits: result.payment.card.first_six_digits,
          last_four_digits: result.payment.card.last_four_digits,
          cardholder: result.payment.card.cardholder
        } : null
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Consultar estado de un pago
 * GET /api/payments/card/:paymentId
 */
export const getPaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { paymentId } = req.params;

    if (!paymentId || isNaN(parseInt(paymentId))) {
      res.status(400).json({
        success: false,
        message: 'ID de pago inválido'
      });
      return;
    }

    const payment = await cardPaymentService.getPayment(parseInt(paymentId));

    res.json({
      success: true,
      data: {
        payment_id: payment.id,
        status: payment.status,
        status_detail: payment.status_detail,
        transaction_amount: payment.transaction_amount,
        net_received_amount: payment.net_received_amount,
        date_created: payment.date_created,
        date_approved: payment.date_approved,
        authorization_code: payment.authorization_code,
        card: payment.card ? {
          first_six_digits: payment.card.first_six_digits,
          last_four_digits: payment.card.last_four_digits,
          cardholder: payment.card.cardholder
        } : null
      }
    });

  } catch (error) {
    next(error);
  }
};

/**
 * Reembolsar un pago
 * POST /api/payments/card/:paymentId/refund
 */
export const refundPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { paymentId } = req.params;
    const { amount } = req.body;
    const userId = req.user?.id;

    // Validar permisos (solo admin puede reembolsar)
    if (!userId || req.user?.role !== 'admin') {
      res.status(403).json({
        success: false,
        message: 'No tienes permisos para realizar reembolsos'
      });
      return;
    }

    if (!paymentId || isNaN(parseInt(paymentId))) {
      res.status(400).json({
        success: false,
        message: 'ID de pago inválido'
      });
      return;
    }

    const refund = await cardPaymentService.refundPayment(
      parseInt(paymentId), 
      amount ? parseFloat(amount) : undefined
    );

    // Actualizar la orden relacionada
    try {
      const payment = await cardPaymentService.getPayment(parseInt(paymentId));
      if (payment.external_reference) {
        await prisma.orders.update({
          where: { id: parseInt(payment.external_reference) },
          data: { status: 'refunded' as const }
        });
      }
    } catch (dbError) {
      console.warn('Error updating order on refund:', dbError);
    }

    res.json({
      success: true,
      message: 'Reembolso procesado exitosamente',
      data: refund
    });

  } catch (error) {
    next(error);
  }
};
