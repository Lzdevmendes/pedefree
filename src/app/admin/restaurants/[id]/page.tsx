import Link from "next/link";
import { notFound } from "next/navigation";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";

import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
} from "../../actions";

interface PageProps {
  params: Promise<{ id: string }>;
}

const RestaurantDetailPage = async ({ params }: PageProps) => {
  const { id } = await params;

  const restaurant = await db.restaurant.findUnique({
    where: { id },
    include: {
      menuCategories: {
        include: { products: { orderBy: { name: "asc" } } },
        orderBy: { name: "asc" },
      },
    },
  });

  if (!restaurant) return notFound();

  const createCategoryForRestaurant = createCategory.bind(null, id, {});
  const createProductForRestaurant = createProduct.bind(null, id, {});

  return (
    <div className="mx-auto max-w-3xl p-8">
      <div className="mb-6">
        <Button asChild variant="ghost" size="sm" className="-ml-2 mb-2">
          <Link href="/admin">← Voltar</Link>
        </Button>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">{restaurant.name}</h1>
            <p className="text-sm text-muted-foreground">/{restaurant.slug}</p>
          </div>
          <Button asChild variant="outline" size="sm">
            <Link href={`/admin/restaurants/${id}/edit`}>Editar restaurante</Link>
          </Button>
        </div>
      </div>

      {/* ADD CATEGORY */}
      <section className="mb-8 rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold">Nova categoria</h2>
        <form action={createCategoryForRestaurant} className="flex gap-2">
          <input
            name="name"
            required
            placeholder="Nome da categoria"
            className="flex-1 rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
          />
          <Button type="submit" size="sm" className="rounded-full">
            Adicionar
          </Button>
        </form>
      </section>

      {/* ADD PRODUCT */}
      <section className="mb-8 rounded-xl border bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold">Novo produto</h2>
        <form action={createProductForRestaurant} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-xs font-medium">Nome *</label>
              <input
                name="name"
                required
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium">Preço (R$) *</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                required
                className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">Categoria *</label>
            <select
              name="menuCategoryId"
              required
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Selecione...</option>
              {restaurant.menuCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">URL da imagem *</label>
            <input
              name="imageUrl"
              type="url"
              required
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">Descrição *</label>
            <textarea
              name="description"
              required
              rows={2}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium">
              Ingredientes (um por linha)
            </label>
            <textarea
              name="ingredients"
              rows={3}
              className="w-full rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <Button type="submit" size="sm" className="w-full rounded-full">
            Adicionar produto
          </Button>
        </form>
      </section>

      {/* CATEGORIES + PRODUCTS LIST */}
      <section className="space-y-4">
        <h2 className="font-semibold">Cardápio</h2>
        {restaurant.menuCategories.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nenhuma categoria ainda.</p>
        ) : (
          restaurant.menuCategories.map((cat) => (
            <div key={cat.id} className="rounded-xl border bg-white shadow-sm">
              <div className="flex items-center justify-between border-b px-4 py-3">
                <p className="font-semibold">{cat.name}</p>
                <form
                  action={async () => {
                    "use server";
                    await deleteCategory(cat.id, id);
                  }}
                >
                  <button
                    type="submit"
                    className="text-xs text-red-400 hover:text-red-600"
                  >
                    Excluir categoria
                  </button>
                </form>
              </div>
              {cat.products.length === 0 ? (
                <p className="px-4 py-3 text-sm text-muted-foreground">
                  Nenhum produto nesta categoria
                </p>
              ) : (
                <ul className="divide-y">
                  {cat.products.map((product) => (
                    <li
                      key={product.id}
                      className="flex items-center justify-between px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-medium">{product.name}</p>
                        <p className="text-xs text-muted-foreground">
                          R$ {product.price.toFixed(2)}
                        </p>
                      </div>
                      <form
                        action={async () => {
                          "use server";
                          await deleteProduct(product.id, id);
                        }}
                      >
                        <button
                          type="submit"
                          className="text-xs text-red-400 hover:text-red-600"
                        >
                          Excluir
                        </button>
                      </form>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))
        )}
      </section>
    </div>
  );
};

export default RestaurantDetailPage;
