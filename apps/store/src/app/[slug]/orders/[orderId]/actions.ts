"use server";

import { db } from "@/lib/prisma";
import { submitRatingSchema } from "@/lib/validation";

export const submitRating = async (
  orderId: number,
  stars: number,
  comment: string,
  restaurantSlug: string,
): Promise<{ success: boolean; error?: string }> => {
  const parsed = submitRatingSchema.safeParse({ orderId, stars, comment, restaurantSlug });
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Dados inválidos" };
  }

  const order = await db.order.findUnique({
    where: { id: parsed.data.orderId },
    select: { status: true, rating: true, restaurant: { select: { slug: true } } },
  });

  if (!order || order.restaurant.slug !== parsed.data.restaurantSlug) {
    return { success: false, error: "Pedido não encontrado" };
  }
  if (order.status !== "FINISHED") return { success: false, error: "Só é possível avaliar pedidos concluídos" };
  if (order.rating) return { success: false, error: "Pedido já avaliado" };

  await db.rating.create({
    data: { orderId: parsed.data.orderId, stars: parsed.data.stars, comment: parsed.data.comment || undefined },
  });

  return { success: true };
};
