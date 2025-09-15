import { Request, Response } from 'express';
import { processCardPayment } from '../services/payments';

import { Request, Response } from 'express';
import { processCardPayment } from '../services/payments';

export const addPayment = {
  async processPayment(req: Request, res: Response) {
    try {
      const { 
        amount, 
        email, 
        installments, 
        token, 
        identificationType, 
        identificationNumber 
      } = req.body;
      
      // ✅ Validación completa de datos requeridos
      if (!amount || !email || !token) {
        return res.status(400).json({
          success: false,
          message: 'Faltan datos requeridos para el pago (amount, email, token)'
        });
      }

      // ✅ Validaciones adicionales
      if (amount <= 0) {
        return res.status(400).json({
          success: false,
          message: 'El monto debe ser mayor a cero'
        });
      }

      if (!email.includes('@')) {
        return res.status(400).json({
          success: false,
          message: 'Email inválido'
        });
      }

      // ✅ Validar datos de identificación si se proporcionan
      if (identificationType && identificationType !== 'none' && !identificationNumber) {
        return res.status(400).json({
          success: false,
          message: 'Si especifica tipo de identificación, debe proporcionar el número'
        });
      }

      if (identificationNumber && identificationNumber.length < 6) {
        return res.status(400).json({
          success: false,
          message: 'El número de identificación debe tener al menos 6 dígitos'
        });
      }

      console.log('🔄 Procesando pago:', {
        amount: Number(amount),
        email: email.toLowerCase().trim(),
        installments: installments || 1,
        hasToken: !!token,
        identificationType: identificationType && identificationType !== 'none' ? identificationType : 'No especificado',
        hasIdentification: !!(identificationNumber && identificationType !== 'none')
      });
      
      // ✅ Procesar el pago usando el servicio con datos completos
      const payment = await processCardPayment({
        amount: Number(amount),
        email: email.toLowerCase().trim(),
        installments: installments || 1,
        token,
        identificationType: identificationType && identificationType !== 'none' ? identificationType : undefined,
        identificationNumber: identificationNumber && identificationType !== 'none' ? identificationNumber : undefined
      });
      
      // ✅ Devolver el resultado con información detallada
       res.status(200).json({
        success: true,
        payment: {
          id: payment.id,
          status: payment.status,
          status_detail: payment.status_detail,
          transaction_amount: payment.transaction_amount,
          payment_method_id: payment.payment_method_id,
          external_reference: payment.external_reference,
          date_created: payment.date_created
        }
      });
      return;
    } catch (error: any) {
      console.error('❌ Error procesando pago:', error);
      
      return res.status(500).json({
        success: false,
        message: error.message || 'Error interno del servidor al procesar el pago'
      });
    }
  }
};