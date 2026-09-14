import { describe, expect, it } from "vitest";

import { calculateDiscountedTotal } from "./pricing";

describe("calculateDiscountedTotal", () => {
  it("aplica o percentual de desconto corretamente", () => {
    expect(calculateDiscountedTotal(100, 10)).toBe(90);
  });

  it("arredonda para 2 casas decimais evitando erro de ponto flutuante", () => {
    expect(calculateDiscountedTotal(19.9, 10)).toBe(17.91);
  });

  it("retorna o subtotal integral quando o desconto é 0", () => {
    expect(calculateDiscountedTotal(50, 0)).toBe(50);
  });

  it("retorna 0 quando o desconto é 100%", () => {
    expect(calculateDiscountedTotal(50, 100)).toBe(0);
  });
});
