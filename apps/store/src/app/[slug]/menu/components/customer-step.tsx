"use client";

import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

interface CustomerStepProps {
  isDineIn: boolean;
  discountedTotal: number;
  isPending: boolean;
  // Form fields
  customerName: string;
  setCustomerName: (v: string) => void;
  customerPhone: string;
  setCustomerPhone: (v: string) => void;
  tableNumber: string | number;
  setTableNumber: (v: string) => void;
  consentAccepted: boolean;
  setConsentAccepted: (v: boolean) => void;
  // Errors
  errors: Record<string, string>;
  setErrors: (fn: (prev: Record<string, string>) => Record<string, string>) => void;
  // Actions
  onBack: () => void;
  onSubmit: () => void;
}

export const CustomerStep = ({
  isDineIn,
  discountedTotal,
  isPending,
  customerName,
  setCustomerName,
  customerPhone,
  setCustomerPhone,
  tableNumber,
  setTableNumber,
  consentAccepted,
  setConsentAccepted,
  errors,
  setErrors,
  onBack,
  onSubmit,
}: CustomerStepProps) => {
  return (
    <div className="space-y-4 p-5">
      <div>
        <label className="mb-1.5 block text-sm font-medium">
          Seu nome <span className="text-red-500">*</span>
        </label>
        <Input
          placeholder="Ex: João Silva"
          autoComplete="name"
          className="rounded-xl border-border"
          value={customerName}
          onChange={(e) => {
            setCustomerName(e.target.value);
            setErrors((prev) => ({ ...prev, name: "" }));
          }}
          onKeyDown={(e) => e.key === "Enter" && onSubmit()}
        />
        {errors.name && (
          <p className="mt-1 text-xs text-red-500">{errors.name}</p>
        )}
      </div>

      {isDineIn ? (
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Número da mesa <span className="text-red-500">*</span>
          </label>
          <Input
            type="number"
            placeholder="Ex: 5"
            className="rounded-xl border-border"
            value={tableNumber}
            onChange={(e) => {
              setTableNumber(e.target.value);
              setErrors((prev) => ({ ...prev, table: "" }));
            }}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          />
          {errors.table && (
            <p className="mt-1 text-xs text-red-500">{errors.table}</p>
          )}
        </div>
      ) : (
        <div>
          <label className="mb-1.5 block text-sm font-medium">
            Telefone <span className="text-red-500">*</span>
          </label>
          <Input
            type="tel"
            placeholder="Ex: (11) 99999-9999"
            autoComplete="tel"
            className="rounded-xl border-border"
            value={customerPhone}
            onChange={(e) => {
              setCustomerPhone(e.target.value);
              setErrors((prev) => ({ ...prev, phone: "" }));
            }}
            onKeyDown={(e) => e.key === "Enter" && onSubmit()}
          />
          {errors.phone && (
            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
          )}
        </div>
      )}

      {/* Resumo do total */}
      <div className="flex items-center justify-between rounded-2xl bg-muted/50 px-4 py-3">
        <p className="text-sm text-muted-foreground">Total do pedido</p>
        <p className="font-bold">{formatCurrency(discountedTotal)}</p>
      </div>

      <div>
        <label className="flex items-start gap-2 text-xs text-muted-foreground">
          <input
            type="checkbox"
            className="mt-0.5 h-4 w-4 shrink-0 rounded border-input"
            checked={consentAccepted}
            onChange={(e) => {
              setConsentAccepted(e.target.checked);
              setErrors((prev) => ({ ...prev, consent: "" }));
            }}
          />
          <span>
            Autorizo o uso dos meus dados (nome{isDineIn ? "" : " e telefone"}) para o
            processamento deste pedido, conforme a{" "}
            <Link href="/privacidade" target="_blank" className="underline">
              Política de Privacidade
            </Link>
            .
          </span>
        </label>
        {errors.consent && (
          <p className="mt-1 text-xs text-red-500">{errors.consent}</p>
        )}
      </div>

      <div className="flex gap-3">
        <Button
          variant="outline"
          className="h-12 flex-1 rounded-2xl border-border"
          onClick={onBack}
        >
          Voltar
        </Button>
        <Button
          className="h-12 flex-1 rounded-2xl text-sm font-semibold"
          onClick={onSubmit}
          disabled={isPending}
        >
          {isPending ? "Processando..." : "Confirmar pedido"}
        </Button>
      </div>
    </div>
  );
};
