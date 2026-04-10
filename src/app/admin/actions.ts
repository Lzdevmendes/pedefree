"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { db } from "@/lib/prisma";

// ── AUTH ──────────────────────────────────────────────────────────────────────

export const adminLogin = async (
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (
    email !== process.env.ADMIN_EMAIL ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return { error: "Credenciais inválidas" };
  }

  const jar = await cookies();
  jar.set("admin_session", "authenticated", {
    httpOnly: true,
    maxAge: 60 * 60 * 8, // 8h
    path: "/",
  });

  redirect("/admin");
};

export const adminLogout = async () => {
  const jar = await cookies();
  jar.delete("admin_session");
  redirect("/admin/login");
};

// ── RESTAURANTS ───────────────────────────────────────────────────────────────

export const createRestaurant = async (
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> => {
  const name = (formData.get("name") as string).trim();
  const slug = (formData.get("slug") as string).trim().toLowerCase();
  const description = (formData.get("description") as string).trim();
  const avatarImageUrl = (formData.get("avatarImageUrl") as string).trim();
  const coverImageUrl = (formData.get("coverImageUrl") as string).trim();
  const primaryColor = (formData.get("primaryColor") as string).trim() || "42 100% 50%";

  if (!name || !slug || !description || !avatarImageUrl || !coverImageUrl) {
    return { error: "Preencha todos os campos obrigatórios" };
  }

  await db.restaurant.create({
    data: { name, slug, description, avatarImageUrl, coverImageUrl, primaryColor },
  });

  revalidatePath("/admin");
  redirect("/admin");
};

export const updateRestaurant = async (
  id: string,
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> => {
  const name = (formData.get("name") as string).trim();
  const slug = (formData.get("slug") as string).trim().toLowerCase();
  const description = (formData.get("description") as string).trim();
  const avatarImageUrl = (formData.get("avatarImageUrl") as string).trim();
  const coverImageUrl = (formData.get("coverImageUrl") as string).trim();
  const primaryColor = (formData.get("primaryColor") as string).trim() || "42 100% 50%";

  if (!name || !slug || !description || !avatarImageUrl || !coverImageUrl) {
    return { error: "Preencha todos os campos obrigatórios" };
  }

  await db.restaurant.update({
    where: { id },
    data: { name, slug, description, avatarImageUrl, coverImageUrl, primaryColor },
  });

  revalidatePath("/admin");
  redirect("/admin");
};

export const deleteRestaurant = async (id: string) => {
  await db.restaurant.delete({ where: { id } });
  revalidatePath("/admin");
};

// ── CATEGORIES ────────────────────────────────────────────────────────────────

export const createCategory = async (
  restaurantId: string,
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> => {
  const name = (formData.get("name") as string).trim();
  if (!name) return { error: "Nome obrigatório" };

  await db.menuCategory.create({ data: { name, restaurantId } });
  revalidatePath(`/admin/restaurants/${restaurantId}`);
  redirect(`/admin/restaurants/${restaurantId}`);
};

export const deleteCategory = async (id: string, restaurantId: string) => {
  await db.menuCategory.delete({ where: { id } });
  revalidatePath(`/admin/restaurants/${restaurantId}`);
};

// ── PRODUCTS ──────────────────────────────────────────────────────────────────

export const createProduct = async (
  restaurantId: string,
  _prev: { error?: string },
  formData: FormData,
): Promise<{ error?: string }> => {
  const name = (formData.get("name") as string).trim();
  const description = (formData.get("description") as string).trim();
  const price = parseFloat(formData.get("price") as string);
  const imageUrl = (formData.get("imageUrl") as string).trim();
  const menuCategoryId = (formData.get("menuCategoryId") as string).trim();
  const ingredientsRaw = (formData.get("ingredients") as string).trim();

  if (!name || !description || isNaN(price) || !imageUrl || !menuCategoryId) {
    return { error: "Preencha todos os campos obrigatórios" };
  }

  const ingredients = ingredientsRaw
    ? ingredientsRaw.split("\n").map((s) => s.trim()).filter(Boolean)
    : [];

  await db.product.create({
    data: { name, description, price, imageUrl, menuCategoryId, restaurantId, ingredients },
  });

  revalidatePath(`/admin/restaurants/${restaurantId}`);
  redirect(`/admin/restaurants/${restaurantId}`);
};

export const deleteProduct = async (id: string, restaurantId: string) => {
  await db.product.delete({ where: { id } });
  revalidatePath(`/admin/restaurants/${restaurantId}`);
};
