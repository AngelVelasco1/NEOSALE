import { Request, Response } from 'express';
import { processCardPayment } from '../services/payments';

export const addPayment = {
  async processPayment(req: Request, res: Response) {
    try {
      const { amount, email, installments, token } = req.body;
      
      // Validación básica de datos
      if (!amount || !email || !token) {
        return res.status(400).json({
          success: false,
          message: 'Faltan datos requeridos para el pago'
        });
      }
      
      // Procesar el pago usando el servicio
      const payment = await processCardPayment({
        amount: Number(amount),
        email,
        installments: installments || 1,
        token
      });
      
      // Devolver el resultado
      return res.status(200).json({
        success: true,
        payment
      });
    } catch (error: any) {
      console.error('Error procesando pago:', error);
      
      return res.status(500).json({
        success: false,
        message: error.message || 'Error al procesar el pago'
      });
    }
  }
};