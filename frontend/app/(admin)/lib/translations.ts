// frontend/lib/translations.ts
export const ORDER_STATUS_TRANSLATIONS = {
  pending: "Pendiente",
  paid: "Pagada",
  processing: "Procesando",
  shipped: "Enviada",
  delivered: "Entregada",
  cancelled: "Cancelada",
} as const;

export type OrderStatus = keyof typeof ORDER_STATUS_TRANSLATIONS;

export const translateOrderStatus = (status: string): string => {
  return ORDER_STATUS_TRANSLATIONS[status as OrderStatus] || status;
};
