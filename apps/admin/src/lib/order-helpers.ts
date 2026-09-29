import { OrderStatus } from "@prisma/client";

/**
 * Configuração visual de status de pedido para exibição na UI.
 */
export const ORDER_STATUS_CONFIG: Record<OrderStatus, { label: string; color: string }> = {
  PENDING: { label: "Aguardando", color: "text-yellow-600" },
  IN_PREPARATION: { label: "Em preparo", color: "text-blue-600" },
  FINISHED: { label: "Pronto", color: "text-green-600" },
  CANCELLED: { label: "Cancelado", color: "text-red-500" },
};

/**
 * Retorna uma data correspondente ao dia de hoje subtraindo N dias, útil para consultas de histórico.
 * @param days Número de dias a subtrair
 */
export function getDateRange(days: number): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate() - days);
}

/**
 * Retorna uma data que representa o início do dia atual à meia-noite.
 */
export function getStartOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}
