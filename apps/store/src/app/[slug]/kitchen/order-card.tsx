import { OrderStatus } from "@prisma/client";
import { ClockIcon, XCircleIcon } from "lucide-react";
import { memo } from "react";

import { Button } from "@/components/ui/button";

export interface OrderProduct {
  quantity: number;
  notes?: string | null;
  product: { name: string; ingredients: string[] };
}

export interface Order {
  id: number;
  status: OrderStatus;
  consumptionMethod: string;
  customerName?: string | null;
  tableNumber?: number | null;
  createdAt: Date;
  orderProducts: OrderProduct[];
}

export const STATUS_NEXT: Partial<Record<OrderStatus, OrderStatus>> = {
  PENDING: "IN_PREPARATION",
  IN_PREPARATION: "FINISHED",
};

export const STATUS_BTN: Partial<Record<OrderStatus, string>> = {
  PENDING: "Iniciar preparo",
  IN_PREPARATION: "Marcar como pronto",
};

export const METHOD_LABEL: Record<string, string> = {
  DINE_IN: "Mesa",
  TAKEAWAY: "Retirada",
};

export function elapsed(date: Date) {
  const mins = Math.floor((Date.now() - new Date(date).getTime()) / 60000);
  return mins < 1 ? "agora" : `${mins}min`;
}

interface OrderCardProps {
  order: Order;
  updatingId: number | null;
  cancellingId: number | null;
  onAdvance: (order: Order) => void;
  onCancel: (order: Order) => void;
}

export const OrderCard = memo(function OrderCard({
  order,
  updatingId,
  cancellingId,
  onAdvance,
  onCancel,
}: OrderCardProps) {
  return (
    <div
      className={`rounded-2xl border p-4 shadow-sm ${
        order.status === "PENDING"
          ? "border-yellow-200 bg-yellow-50"
          : "border-blue-200 bg-blue-50"
      }`}
    >
      <div className="mb-2 flex items-center justify-between">
        <span className="text-base font-bold">#{order.id}</span>
        <div className="flex items-center gap-1 text-sm text-muted-foreground">
          <ClockIcon size={13} />
          {elapsed(order.createdAt)}
        </div>
      </div>

      <div className="mb-3 flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">
          {METHOD_LABEL[order.consumptionMethod] ?? order.consumptionMethod}
          {order.tableNumber ? ` · Mesa ${order.tableNumber}` : ""}
        </p>
        {order.customerName && (
          <p className="text-sm font-medium">{order.customerName}</p>
        )}
      </div>

      <ul className="mb-4 space-y-2">
        {order.orderProducts.map((op, i) => (
          <li key={i} className="text-sm">
            <span className="font-semibold">
              {op.quantity}x {op.product.name}
            </span>
            {op.product.ingredients.length > 0 && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                {op.product.ingredients.join(", ")}
              </p>
            )}
            {op.notes && (
              <p className="mt-0.5 text-xs font-medium text-foreground">↳ {op.notes}</p>
            )}
          </li>
        ))}
      </ul>

      <div className="flex gap-2">
        {STATUS_NEXT[order.status] && (
          <Button
            className="h-11 flex-1 rounded-full text-sm"
            disabled={updatingId === order.id || cancellingId === order.id}
            onClick={() => onAdvance(order)}
          >
            {updatingId === order.id ? "Atualizando..." : STATUS_BTN[order.status]}
          </Button>
        )}

        {(order.status === "PENDING" || order.status === "IN_PREPARATION") && (
          <Button
            variant="outline"
            className="h-11 w-11 shrink-0 rounded-full text-red-500 hover:bg-red-50 hover:text-red-600"
            disabled={cancellingId === order.id || updatingId === order.id}
            onClick={() => onCancel(order)}
            aria-label="Cancelar pedido"
          >
            <XCircleIcon size={18} />
          </Button>
        )}
      </div>
    </div>
  );
});
