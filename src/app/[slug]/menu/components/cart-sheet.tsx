"use client";

import { ConsumptionMethod } from "@prisma/client";
import { MinusIcon, PlusIcon, TrashIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTransition } from "react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useCart } from "@/contexts/cart";

import { createOrder } from "../actions";

interface CartSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurantId: string;
  consumptionMethod: ConsumptionMethod;
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const CartSheet = ({
  open,
  onOpenChange,
  restaurantId,
  consumptionMethod,
}: CartSheetProps) => {
  const router = useRouter();
  const { items, removeItem, increaseQuantity, decreaseQuantity, total, clearCart } =
    useCart();
  const [isPending, startTransition] = useTransition();

  const handleOrder = () => {
    startTransition(async () => {
      const { orderId, slug } = await createOrder({
        slug: "",
        restaurantId,
        consumptionMethod,
        items,
      });
      clearCart();
      onOpenChange(false);
      router.push(`/${slug}/orders/${orderId}`);
    });
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="bottom"
        className="max-h-[90vh] overflow-y-auto rounded-t-2xl p-0"
      >
        <SheetHeader className="border-b p-5 pb-4">
          <SheetTitle>Meu pedido</SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-16 text-center">
            <p className="font-semibold">Seu carrinho está vazio</p>
            <p className="text-sm text-muted-foreground">
              Adicione itens para fazer seu pedido
            </p>
          </div>
        ) : (
          <div className="p-5">
            <div className="space-y-4">
              {items.map(({ product, quantity, notes }) => (
                <div
                  key={product.id}
                  className="flex items-center gap-4 border-b pb-4"
                >
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-contain p-1"
                    />
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <p className="truncate text-sm font-medium">
                      {product.name}
                    </p>
                    <p className="text-sm font-semibold">
                      {formatCurrency(product.price)}
                    </p>
                    {notes && (
                      <p className="mt-0.5 text-xs italic text-muted-foreground">
                        {notes}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full"
                      onClick={() => decreaseQuantity(product.id)}
                    >
                      <MinusIcon size={12} />
                    </Button>
                    <span className="w-5 text-center text-sm font-semibold">
                      {quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7 rounded-full"
                      onClick={() => increaseQuantity(product.id)}
                    >
                      <PlusIcon size={12} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 rounded-full text-red-500 hover:text-red-600"
                      onClick={() => removeItem(product.id)}
                    >
                      <TrashIcon size={12} />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between border-t pt-4">
              <p className="text-sm text-muted-foreground">Total</p>
              <p className="font-semibold">{formatCurrency(total)}</p>
            </div>

            <Button
              className="mt-5 w-full rounded-full"
              onClick={handleOrder}
              disabled={isPending}
            >
              {isPending ? "Processando..." : "Fazer pedido"}
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default CartSheet;
