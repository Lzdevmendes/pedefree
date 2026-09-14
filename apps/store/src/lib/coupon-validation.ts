export interface CouponLike {
  restaurantId: string;
  isActive: boolean;
  usedCount: number;
  maxUses: number;
  expiresAt: Date | null;
}

export function getCouponValidityError(
  coupon: CouponLike | null,
  restaurantId: string,
  now: Date = new Date(),
): string | null {
  if (!coupon) return "Cupom não encontrado";
  if (coupon.restaurantId !== restaurantId) return "Cupom inválido para este restaurante";
  if (!coupon.isActive) return "Cupom inativo";
  if (coupon.usedCount >= coupon.maxUses) return "Cupom esgotado";
  if (coupon.expiresAt && coupon.expiresAt < now) return "Cupom expirado";
  return null;
}
