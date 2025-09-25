import { Request, Response } from 'express';
import { getTestingRecommendations } from '../utils/paymentTestUtils';

/**
 * Obtener configuración y recomendaciones para pruebas de pago
 * Solo disponible en desarrollo
 */
export const getTestConfig = async (req: Request, res: Response) => {
  try {
 

    const config = getTestingRecommendations();

    res.json({
      success: true,
      message: 'Configuración de pruebas obtenida',
      data: {
        environment: 'development',
        ...config,
        warning: 'Esta configuración es solo para desarrollo. En producción no hay estos límites.'
      }
    });

  } catch (error: any) {
    console.error('Error obteniendo config de prueba:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};