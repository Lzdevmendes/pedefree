import { z } from "zod";

export const createOrderSchema = z.object({
  restaurantId: z.string().min(1),
  consumptionMethod: z.enum(["TAKEAWAY", "DINE_IN"]),
  items: z
    .array(
      z.object({
        product: z.object({ id: z.string().min(1) }).passthrough(),
        quantity: z.number().int().positive(),
        notes: z.string().trim().max(500).optional(),
      }),
    )
    .min(1, "O carrinho está vazio"),
  customerName: z.string().trim().min(1).max(120),
  customerPhone: z.string().trim().max(30).optional(),
  tableNumber: z.number().int().positive().optional(),
  couponCode: z.string().trim().max(50).optional(),
  fcmToken: z.string().max(500).optional(),
});

export const validateCouponSchema = z.object({
  code: z.string().trim().min(1).max(50),
  restaurantId: z.string().min(1),
});

export const submitRatingSchema = z.object({
  orderId: z.number().int().positive(),
  stars: z.number().int().min(1).max(5),
  comment: z.string().trim().max(1000).optional(),
  restaurantSlug: z.string().min(1),
});
