"use client";

import { OrderStatus } from "@prisma/client";
import { CheckCircleIcon, ChefHatIcon, ClockIcon } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

interface Step {
  status: OrderStatus;
  label: string;
  icon: React.ReactNode;
}

const STEPS: Step[] = [
  {
    status: "PENDING",
    label: "Pedido recebido",
    icon: <ClockIcon size={18} />,
  },
  {
    status: "IN_PREPARATION",
    label: "Em preparo",
    icon: <ChefHatIcon size={18} />,
  },
  {
    status: "FINISHED",
    label: "Pronto para retirada",
    icon: <CheckCircleIcon size={18} />,
  },
];

const STATUS_ORDER: Record<OrderStatus, number> = {
  PENDING: 0,
  IN_PREPARATION: 1,
  FINISHED: 2,
};

interface OrderStatusPollerProps {
  orderId: number;
  initialStatus: OrderStatus;
}

const OrderStatusPoller = ({
  orderId,
  initialStatus,
}: OrderStatusPollerProps) => {
  const [status, setStatus] = useState<OrderStatus>(initialStatus);

  const poll = useCallback(async () => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setStatus(data.status);
      }
    } catch {
      // silent fail — will retry on next interval
    }
  }, [orderId]);

  useEffect(() => {
    const interval = setInterval(poll, 10_000);
    return () => clearInterval(interval);
  }, [poll]);

  const currentStep = STATUS_ORDER[status];

  return (
    <div className="w-full">
      <div className="relative flex justify-between">
        <div className="absolute left-0 right-0 top-[18px] h-0.5 bg-gray-200">
          <div
            className="h-full bg-primary transition-all duration-700"
            style={{ width: `${(currentStep / (STEPS.length - 1)) * 100}%` }}
          />
        </div>

        {STEPS.map((step, idx) => {
          const done = idx <= currentStep;
          return (
            <div key={step.status} className="relative flex flex-col items-center gap-2">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-full border-2 transition-colors duration-500 ${
                  done
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-gray-300 bg-white text-gray-400"
                }`}
              >
                {step.icon}
              </div>
              <span
                className={`text-center text-xs font-medium ${done ? "text-foreground" : "text-muted-foreground"}`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {status === "FINISHED" && (
        <p className="mt-6 text-center text-sm font-semibold text-green-600">
          Seu pedido está pronto! Pode retirar.
        </p>
      )}

      {status !== "FINISHED" && (
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Atualiza automaticamente a cada 10 segundos
        </p>
      )}
    </div>
  );
};

export default OrderStatusPoller;
