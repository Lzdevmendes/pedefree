import { describe, expect, it } from "vitest";

import { formatCurrency, normalizePhone } from "./utils";

describe("formatCurrency", () => {
  it("formata valores em Real brasileiro", () => {
    expect(formatCurrency(19.9)).toBe("R$ 19,90");
  });

  it("formata valores inteiros com centavos", () => {
    expect(formatCurrency(100)).toBe("R$ 100,00");
  });
});

describe("normalizePhone", () => {
  it("remove caracteres não numéricos", () => {
    expect(normalizePhone("(11) 99999-9999")).toBe("11999999999");
  });

  it("mantém string vazia quando não há dígitos", () => {
    expect(normalizePhone("abc")).toBe("");
  });
});
