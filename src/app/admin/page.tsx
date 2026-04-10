import Link from "next/link";

import { Button } from "@/components/ui/button";
import { db } from "@/lib/prisma";

import { adminLogout, deleteRestaurant } from "./actions";

const AdminPage = async () => {
  const restaurants = await db.restaurant.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { products: true, orders: true } } },
  });

  return (
    <div className="mx-auto max-w-4xl p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Painel Admin</h1>
          <p className="text-sm text-muted-foreground">
            Gerencie restaurantes, cardápios e produtos
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/restaurants/new">+ Novo restaurante</Link>
          </Button>
          <form action={adminLogout}>
            <Button variant="ghost" size="sm" type="submit">
              Sair
            </Button>
          </form>
        </div>
      </div>

      {restaurants.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <p className="text-muted-foreground">Nenhum restaurante cadastrado</p>
          <Button asChild className="mt-4 rounded-full" size="sm">
            <Link href="/admin/restaurants/new">Criar primeiro restaurante</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          {restaurants.map((r) => (
            <div
              key={r.id}
              className="flex items-center gap-4 rounded-xl border bg-white p-4 shadow-sm"
            >
              <div className="flex-1">
                <p className="font-semibold">{r.name}</p>
                <p className="text-sm text-muted-foreground">
                  /{r.slug} · {r._count.products} produtos · {r._count.orders} pedidos
                </p>
              </div>
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/restaurants/${r.id}`}>Gerenciar</Link>
                </Button>
                <Button asChild variant="outline" size="sm">
                  <Link href={`/${r.slug}/menu?consumptionMethod=DINE_IN`} target="_blank">
                    Ver menu
                  </Link>
                </Button>
                <form
                  action={async () => {
                    "use server";
                    await deleteRestaurant(r.id);
                  }}
                >
                  <Button
                    variant="ghost"
                    size="sm"
                    type="submit"
                    className="text-red-500 hover:text-red-600"
                  >
                    Excluir
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPage;
