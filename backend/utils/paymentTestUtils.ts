/**
 * Utilidades para manejar limitaciones de MercadoPago en ambiente de pruebas
 */

// Límites conocidos de MercadoPago para cuentas de prueba
export const TEST_LIMITS = {
  DAILY_AMOUNT_LIMIT: 50000, // Límite diario aproximado en ARS
  MAX_SINGLE_TRANSACTION: 10000, // Monto máximo recomendado por transacción
  SAFE_TEST_AMOUNT: 100, // Monto seguro para pruebas
  RETRY_AMOUNTS: [100, 50, 25, 10] // Montos para reintentos
};

export interface PaymentLimitError {
  isRateLimit: boolean;
  statusDetail: string;
  suggestedAmount?: number;
  canRetry: boolean;
}

/**
 * Analiza si un error es por límites de MercadoPago
 */
export const analyzePaymentError = (status: string, statusDetail: string): PaymentLimitError => {
  const rateLimitErrors = [
    'cc_amount_rate_limit_exceeded',
    'cc_rejected_high_risk',
    'cc_rejected_max_attempts'
  ];

  return {
    isRateLimit: rateLimitErrors.includes(statusDetail),
    statusDetail,
    suggestedAmount: statusDetail === 'cc_amount_rate_limit_exceeded' 
      ? TEST_LIMITS.SAFE_TEST_AMOUNT 
      : undefined,
    canRetry: rateLimitErrors.includes(statusDetail)
  };
};

/**
 * Ajusta el monto para evitar límites en ambiente de prueba
 */
export const adjustAmountForTesting = (originalAmount: number): number => {
  // En desarrollo, usar montos pequeños
  if (process.env.NODE_ENV === 'development') {
    return originalAmount > TEST_LIMITS.MAX_SINGLE_TRANSACTION 
      ? TEST_LIMITS.SAFE_TEST_AMOUNT 
      : originalAmount;
  }
  
  return originalAmount;
};

/**
 * Genera mensaje de error amigable para el frontend
 */
export const getPaymentErrorMessage = (statusDetail: string): string => {
  const errorMessages: Record<string, string> = {
    'cc_amount_rate_limit_exceeded': 
      'Has superado el límite diario de pruebas. En producción, este error no ocurriría. Intenta mañana o con un monto menor.',
    'cc_rejected_high_risk': 
      'Transacción marcada como riesgo alto. En ambiente de prueba, intenta con un monto menor.',
    'cc_rejected_max_attempts': 
      'Demasiados intentos de pago. Espera unos minutos antes de intentar nuevamente.',
    'cc_rejected_insufficient_amount': 
      'Fondos insuficientes en la tarjeta de prueba.',
    'cc_rejected_bad_filled_security_code': 
      'Código de seguridad incorrecto.',
    'cc_rejected_bad_filled_date': 
      'Fecha de vencimiento incorrecta.',
    'cc_rejected_bad_filled_card_number': 
      'Número de tarjeta incorrecto.'
  };

  return errorMessages[statusDetail] || 'Error en el procesamiento del pago.';
};

/**
 * Configuración recomendada para ambiente de desarrollo
 */
export const getTestingRecommendations = () => {
  return {
    recommendedAmount: TEST_LIMITS.SAFE_TEST_AMOUNT,
    maxDailyAmount: TEST_LIMITS.DAILY_AMOUNT_LIMIT,
    testCards: {
      visa: '4509953566233704',
      mastercard: '5031433215406351',
      amex: '3711803032769',
      success_codes: ['123', '456', '789']
    },
    bestPractices: [
      'Usar montos pequeños (≤ $100) para pruebas',
      'No superar $10,000 por transacción en desarrollo',
      'Los límites se resetean cada 24 horas',
      'En producción estos límites no aplican'
    ]
  };
};