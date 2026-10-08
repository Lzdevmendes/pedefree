"use client";

import { ConsumptionMethod } from "@prisma/client";
import { useRouter } from "next/navigation";
import { useEffect, useState, useTransition } from "react";

import { useCart } from "@/contexts/cart";
import { useFcmToken } from "@/lib/use-fcm-token";

import { createOrder } from "../actions";
import { validateCoupon } from "../coupon-actions";

export type Step = "cart" | "customer";

export const useCheckout = (
  restaurantId: string,
  consumptionMethod: ConsumptionMethod,
  onClose: () => void,
) => {
  const router = useRouter();
  const { items, total, clearCart, prefilledTable } = useCart();
  const fcmToken = useFcmToken();

  const [idempotencyKey] = useState(() => crypto.randomUUID());

  const [step, setStep] = useState<Step>("cart");
  
  // Cart / Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [couponError, setCouponError] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState<number | null>(null);
  const [isCouponPending, startCouponTransition] = useTransition();

  // Customer state
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [tableNumber, setTableNumber] = useState<string | number>(prefilledTable ?? "");
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const [isPending, startTransition] = useTransition();

  const isDineIn = consumptionMethod === "DINE_IN";
  const discountedTotal = appliedDiscount !== null ? total * (1 - appliedDiscount / 100) : total;

  useEffect(() => {
    if (prefilledTable !== null) setTableNumber(prefilledTable);
  }, [prefilledTable]);

  const handleApplyCoupon = () => {
    if (!couponCode.trim()) return;
    startCouponTransition(async () => {
      const result = await validateCoupon(couponCode, restaurantId);
      if (result.valid) {
        setAppliedDiscount(result.discountPercent);
        setCouponError("");
      } else {
        setAppliedDiscount(null);
        setCouponError(result.error);
      }
    });
  };

  const handleRemoveCoupon = () => {
    setAppliedDiscount(null);
    setCouponCode("");
    setCouponError("");
  };

  const handleProceedToCustomer = () => {
    if (items.length > 0) setStep("customer");
  };

  const handleOrder = () => {
    const newErrors: Record<string, string> = {};
    if (!customerName.trim()) newErrors.name = "Nome é obrigatório";
    if (!isDineIn && !customerPhone.trim())
      newErrors.phone = "Telefone é obrigatório para pedidos para levar";
    if (isDineIn && !String(tableNumber).trim())
      newErrors.table = "Número da mesa é obrigatório";
    if (!consentAccepted)
      newErrors.consent = "É necessário aceitar o uso dos seus dados para continuar";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    startTransition(async () => {
      try {
        const { orderId, slug } = await createOrder({
          restaurantId,
          consumptionMethod,
          items,
          customerName: customerName.trim(),
          customerPhone: customerPhone.trim() || undefined,
          tableNumber: tableNumber ? Number(tableNumber) : undefined,
          couponCode: appliedDiscount !== null ? couponCode : undefined,
          fcmToken: fcmToken ?? undefined,
          idempotencyKey,
        });
        clearCart();
        setAppliedDiscount(null);
        setCouponCode("");
        onClose();
        setStep("cart");
        router.push(`/${slug}/orders/${orderId}`);
      } catch (error) {
        console.error("Erro ao criar pedido:", error);
      }
    });
  };

  const resetStep = () => setStep("cart");

  return {
    step,
    isDineIn,
    discountedTotal,
    isPending,
    // Form actions
    handleOrder,
    handleProceedToCustomer,
    resetStep,
    // Coupon state/actions
    couponCode,
    setCouponCode,
    couponError,
    setCouponError,
    appliedDiscount,
    isCouponPending,
    handleApplyCoupon,
    handleRemoveCoupon,
    // Customer state/setters
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
  };
};
