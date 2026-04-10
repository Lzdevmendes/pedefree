"use server";

import { OrderStatus } from "@prisma/client";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

import { db } from "@/lib/prisma";
import { signKitchenSession } from "@/lib/session";

export const kitchenLogin = async (slug: string, password: string) => {
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: { kitchenPassword: true },
  });

  if (!restaurant) return { success: false, error: "Restaurante não encontrado" };

  const isHash = restaurant.kitchenPassword.startsWith("$2");
  const valid = isHash
    ? await bcrypt.compare(password, restaurant.kitchenPassword)
    : restaurant.kitchenPassword === password; // fallback legado

  if (!valid) return { success: false, error: "Senha incorreta" };

  const token = signKitchenSession(slug);
  const cookieStore = await cookies();
  cookieStore.set(`kitchen_${slug}`, token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 12, // 12h
  });

  return { success: true };
};

export const kitchenLogout = async (slug: string) => {
  const cookieStore = await cookies();
  cookieStore.delete(`kitchen_${slug}`);
};

export const updateOrderStatus = async (
  orderId: number,
  status: OrderStatus,
) => {
  await db.order.update({
    where: { id: orderId },
    data: { status },
  });
};

export const cancelOrder = async (orderId: number) => {
  await db.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" },
  });
};

export const getKitchenOrders = async (slug: string) => {
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: { id: true },
  });

  if (!restaurant) return [];

  return db.order.findMany({
    where: {
      restaurantId: restaurant.id,
      status: { notIn: ["FINISHED", "CANCELLED"] },
    },
    include: {
      orderProducts: {
        include: {
          product: { select: { name: true } },
        },
      },
    },
    orderBy: { createdAt: "asc" },
  });
};
