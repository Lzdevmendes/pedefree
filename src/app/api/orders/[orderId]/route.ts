import { NextRequest, NextResponse } from "next/server";

import { db } from "@/lib/prisma";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> },
) {
  const { orderId } = await params;
  const id = Number(orderId);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid order id" }, { status: 400 });
  }

  const order = await db.order.findUnique({
    where: { id },
    select: { status: true, updatedAt: true },
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order, {
    headers: {
      "Cache-Control": "private, no-store",
    },
  });
}
