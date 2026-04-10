import crypto from "crypto";
import { NextRequest, NextResponse } from "next/server";

const SECRET =
  process.env.NEXTAUTH_SECRET ?? "changeme-set-NEXTAUTH_SECRET-in-env";

function verifyAdminToken(token: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 4) return false;

    const sig = parts.pop()!;
    const payload = parts.join(":");
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("hex");

    if (sig.length !== expected.length) return false;
    return crypto.timingSafeEqual(
      Buffer.from(sig, "hex"),
      Buffer.from(expected, "hex"),
    );
  } catch {
    return false;
  }
}

function verifyKitchenToken(token: string, slug: string): boolean {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const parts = decoded.split(":");
    if (parts.length < 4) return false;

    const sig = parts.pop()!;
    const payload = parts.join(":");
    const expected = crypto
      .createHmac("sha256", SECRET)
      .update(payload)
      .digest("hex");

    if (sig.length !== expected.length) return false;
    const valid = crypto.timingSafeEqual(
      Buffer.from(sig, "hex"),
      Buffer.from(expected, "hex"),
    );

    // garante que o token é para o slug correto
    return valid && parts[1] === slug;
  } catch {
    return false;
  }
}

export const middleware = (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // proteção do painel admin
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const session = request.cookies.get("admin_session");
    if (!session?.value || !verifyAdminToken(session.value)) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }
  }

  // proteção da cozinha (slug extraído da URL)
  const kitchenMatch = pathname.match(/^\/([^/]+)\/kitchen/);
  if (kitchenMatch) {
    const slug = kitchenMatch[1];
    const kitchenCookie = request.cookies.get(`kitchen_${slug}`);
    if (!kitchenCookie?.value || !verifyKitchenToken(kitchenCookie.value, slug)) {
      // deixa passar para a página mostrar o password-gate
      return NextResponse.next();
    }
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/admin/:path*", "/:slug/kitchen"],
};
