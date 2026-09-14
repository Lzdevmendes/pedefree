import { describe, expect, it } from "vitest";

import { CouponLike, getCouponValidityError } from "./coupon-validation";

const baseCoupon: CouponLike = {
  restaurantId: "restaurant-1",
  isActive: true,
  usedCount: 0,
  maxUses: 100,
  expiresAt: null,
};

describe("getCouponValidityError", () => {
  it("retorna erro quando o cupom não existe", () => {
    expect(getCouponValidityError(null, "restaurant-1")).toBe("Cupom não encontrado");
  });

  it("retorna erro quando o cupom pertence a outro restaurante", () => {
    expect(getCouponValidityError(baseCoupon, "restaurant-2")).toBe(
      "Cupom inválido para este restaurante",
    );
  });

  it("retorna erro quando o cupom está inativo", () => {
    expect(getCouponValidityError({ ...baseCoupon, isActive: false }, "restaurant-1")).toBe(
      "Cupom inativo",
    );
  });

  it("retorna erro quando o cupom atingiu o limite de usos", () => {
    expect(
      getCouponValidityError({ ...baseCoupon, usedCount: 100, maxUses: 100 }, "restaurant-1"),
    ).toBe("Cupom esgotado");
  });

  it("retorna erro quando o cupom expirou", () => {
    const now = new Date("2026-01-15");
    const expired = { ...baseCoupon, expiresAt: new Date("2026-01-01") };
    expect(getCouponValidityError(expired, "restaurant-1", now)).toBe("Cupom expirado");
  });

  it("retorna null quando o cupom é válido", () => {
    const now = new Date("2026-01-15");
    const valid = { ...baseCoupon, expiresAt: new Date("2026-02-01") };
    expect(getCouponValidityError(valid, "restaurant-1", now)).toBeNull();
  });
});
