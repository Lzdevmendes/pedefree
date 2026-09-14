export function calculateDiscountedTotal(subtotal: number, discountPercent: number): number {
  return Math.round(subtotal * (1 - discountPercent / 100) * 100) / 100;
}
