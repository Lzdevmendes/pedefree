import crypto from "crypto";

const SECRET = (() => {
  const s = process.env.NEXTAUTH_SECRET;
  if (!s) throw new Error("NEXTAUTH_SECRET não definido — defina a variável de ambiente");
  return s;
})();

const KITCHEN_MAX_AGE_MS = 12 * 60 * 60 * 1000;

function createSignature(payload: string): string {
  return crypto.createHmac("sha256", SECRET).update(payload).digest("hex");
}

function encodeToken(payload: string, sig: string): string {
  return Buffer.from(`${payload}:${sig}`).toString("base64");
}

function verifySignature(payload: string, sig: string): boolean {
  const expected = createSignature(payload);
  return crypto.timingSafeEqual(Buffer.from(sig, "hex"), Buffer.from(expected, "hex"));
}

function decodeAndValidateToken(token: string, maxAgeMs: number): string[] | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 4) return null;

    const sig = parts.pop()!;
    const payload = parts.join(":");

    if (!verifySignature(payload, sig)) return null;

    const timestamp = Number(parts[2]);
    if (isNaN(timestamp) || Date.now() - timestamp > maxAgeMs) return null;

    return parts;
  } catch {
    return null;
  }
}

/** Gera um token HMAC para a sessão de cozinha (por slug). */
export function signKitchenSession(slug: string): string {
  const payload = `kitchen:${slug}:${Date.now()}`;
  const sig = createSignature(payload);
  return encodeToken(payload, sig);
}

/** Verifica o token de cozinha. Retorna o slug se válido, null se inválido. */
export function verifyKitchenSession(token: string): string | null {
  const parts = decodeAndValidateToken(token, KITCHEN_MAX_AGE_MS);
  return parts ? (parts[1] ?? null) : null;
}
