import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/prisma";

const VALID_NUMBER_REGEX = /^\d+$/;

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const slug = req.nextUrl.searchParams.get("slug");

  if (!orderId || !VALID_NUMBER_REGEX.test(orderId) || !slug) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  const normalizedId = parseInt(orderId, 10);

  const order = await db.order.findUnique({
    where: { id: normalizedId },
    select: { status: true, updatedAt: true, restaurant: { select: { slug: true } } },
  });

  if (!order || order.restaurant.slug !== slug) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(
    { status: order.status, updatedAt: order.updatedAt },
    { headers: { "Cache-Control": "private, no-store" } },
  );
}

