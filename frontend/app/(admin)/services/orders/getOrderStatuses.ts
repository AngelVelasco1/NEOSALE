import { ORDER_STATUS_TRANSLATIONS } from "@/app/(admin)/lib/translations";

export interface OrderStatusOption {
  value: string;
  label: string;
}

/**
 * Obtiene la lista de estados de orden disponibles
 * En el futuro, esto podría venir de una API
 */
export function getOrderStatuses(): OrderStatusOption[] {
  return Object.entries(ORDER_STATUS_TRANSLATIONS).map(([value, label]) => ({
    value,
    label,
  }));
}
