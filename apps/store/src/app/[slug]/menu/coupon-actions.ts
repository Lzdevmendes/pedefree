"use server";

import { getCouponValidityError } from "@/lib/coupon-validation";
import { db } from "@/lib/prisma";
import { validateCouponSchema } from "@/lib/validation";

export const validateCoupon = async (
  code: string,
  restaurantId: string,
): Promise<{ valid: true; discountPercent: number } | { valid: false; error: string }> => {
  const parsed = validateCouponSchema.safeParse({ code, restaurantId });
  if (!parsed.success) {
    return { valid: false, error: "Cupom inválido" };
  }

  const coupon = await db.coupon.findUnique({
    where: { code: parsed.data.code.toUpperCase().trim() },
  });

  const error = getCouponValidityError(coupon, restaurantId);
  if (error || !coupon) return { valid: false, error: error ?? "Cupom não encontrado" };

  return { valid: true, discountPercent: coupon.discountPercent };
};
