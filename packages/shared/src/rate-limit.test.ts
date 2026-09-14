import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { checkRateLimit, resetRateLimit } from "./rate-limit";

describe("checkRateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("permite as primeiras tentativas dentro do limite", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) {
      expect(checkRateLimit(key).allowed).toBe(true);
    }
  });

  it("bloqueia após exceder o número máximo de tentativas", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) checkRateLimit(key);
    const result = checkRateLimit(key);
    expect(result.allowed).toBe(false);
    expect(result.retryAfterSec).toBeGreaterThan(0);
  });

  it("libera novamente após a janela de tempo expirar", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) checkRateLimit(key);
    expect(checkRateLimit(key).allowed).toBe(false);

    vi.advanceTimersByTime(60_001);

    expect(checkRateLimit(key).allowed).toBe(true);
  });

  it("resetRateLimit libera a chave imediatamente", () => {
    const key = `test-${Math.random()}`;
    for (let i = 0; i < 5; i++) checkRateLimit(key);
    expect(checkRateLimit(key).allowed).toBe(false);

    resetRateLimit(key);

    expect(checkRateLimit(key).allowed).toBe(true);
  });
});
