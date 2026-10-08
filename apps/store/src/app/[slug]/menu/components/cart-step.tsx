"use client";

import { CheckCircle2Icon, MinusIcon, PlusIcon, ShoppingBagIcon, TagIcon, TrashIcon } from "lucide-react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useCart } from "@/contexts/cart";
import { formatCurrency } from "@/lib/utils";

interface CartStepProps {
  // Coupon
  couponCode: string;
  setCouponCode: (v: string) => void;
  couponError: string;
  setCouponError: (v: string) => void;
  appliedDiscount: number | null;
  isCouponPending: boolean;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  // Totals
  discountedTotal: number;
  onProceed: () => void;
}

export const CartStep = ({
  couponCode,
  setCouponCode,
  couponError,
  setCouponError,
  appliedDiscount,
  isCouponPending,
  onApplyCoupon,
  onRemoveCoupon,
  discountedTotal,
  onProceed,
}: CartStepProps) => {
  const { items, removeItem, increaseQuantity, decreaseQuantity, total } = useCart();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted">
          <ShoppingBagIcon size={28} className="text-muted-foreground" />
        </div>
        <div>
          <p className="font-semibold">Carrinho vazio</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Adicione itens para fazer seu pedido
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-5">
      {/* Itens */}
      <div className="space-y-3">
        {items.map(({ product, quantity, notes }) => (
          <div
            key={product.id}
            className="flex items-center gap-3 rounded-2xl border border-border/60 bg-card p-3"
          >
            <div className="relative h-14 w-14 flex-shrink-0 overflow-hidden rounded-xl bg-muted">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                sizes="56px"
                className="object-contain p-1"
              />
            </div>

            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-semibold">{product.name}</p>
              <p className="text-sm font-bold text-primary">
                {formatCurrency(product.price)}
              </p>
              {notes && (
                <p className="mt-0.5 truncate text-xs italic text-muted-foreground">
                  {notes}
                </p>
              )}
            </div>

            <div className="flex flex-col items-end gap-2">
              <button
                onClick={() => removeItem(product.id)}
                className="flex h-6 w-6 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-red-50 hover:text-red-500"
                aria-label="Remover item"
              >
                <TrashIcon size={13} />
              </button>
              <div className="flex items-center gap-1.5">
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted active:scale-95"
                  onClick={() => decreaseQuantity(product.id)}
                  aria-label="Diminuir quantidade"
                >
                  <MinusIcon size={12} />
                </button>
                <span className="w-5 text-center text-sm font-bold">{quantity}</span>
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-border bg-background text-foreground transition-colors hover:bg-muted active:scale-95"
                  onClick={() => increaseQuantity(product.id)}
                  aria-label="Aumentar quantidade"
                >
                  <PlusIcon size={12} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cupom */}
      <div className="mt-4 rounded-2xl border border-border/60 p-4">
        {appliedDiscount !== null ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-700">
              <CheckCircle2Icon size={16} />
              <span className="text-sm font-semibold">
                {couponCode.toUpperCase()} — {appliedDiscount}% off
              </span>
            </div>
            <button
              onClick={onRemoveCoupon}
              className="text-xs text-muted-foreground underline hover:text-foreground"
            >
              Remover
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <TagIcon
                  size={14}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <Input
                  placeholder="Cupom de desconto"
                  value={couponCode}
                  autoCapitalize="characters"
                  autoCorrect="off"
                  autoComplete="off"
                  onChange={(e) => {
                    setCouponCode(e.target.value);
                    setCouponError("");
                  }}
                  onKeyDown={(e) => e.key === "Enter" && onApplyCoupon()}
                  className="rounded-xl border-border pl-8 uppercase"
                />
              </div>
              <Button
                variant="outline"
                className="rounded-xl"
                onClick={onApplyCoupon}
                disabled={isCouponPending || !couponCode.trim()}
              >
                {isCouponPending ? "..." : "Aplicar"}
              </Button>
            </div>
            {couponError && (
              <p className="text-xs text-red-500">{couponError}</p>
            )}
          </div>
        )}
      </div>

      {/* Total */}
      <div className="mt-4 space-y-1.5 rounded-2xl bg-muted/50 p-4">
        {appliedDiscount !== null && (
          <div className="flex items-center justify-between text-sm">
            <p className="text-muted-foreground">Subtotal</p>
            <p className="text-muted-foreground line-through">
              {formatCurrency(total)}
            </p>
          </div>
        )}
        {appliedDiscount !== null && (
          <div className="flex items-center justify-between text-sm">
            <p className="text-emerald-700">Desconto ({appliedDiscount}%)</p>
            <p className="font-medium text-emerald-700">
              -{formatCurrency(total * (appliedDiscount / 100))}
            </p>
          </div>
        )}
        <div className="flex items-center justify-between">
          <p className="font-semibold">Total</p>
          <p className="text-lg font-bold">{formatCurrency(discountedTotal)}</p>
        </div>
      </div>

      <Button
        className="mt-4 h-12 w-full rounded-2xl text-sm font-semibold"
        onClick={onProceed}
      >
        Continuar para identificação
      </Button>
    </div>
  );
};
