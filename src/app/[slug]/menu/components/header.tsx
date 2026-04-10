"use client";

import { ConsumptionMethod, Restaurant } from "@prisma/client";
import { ChevronLeftIcon, ScrollTextIcon } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/cart";

import CartSheet from "./cart-sheet";

interface RestaurantHeaderProps {
  restaurant: Pick<Restaurant, "id" | "name" | "coverImageUrl">;
  consumptionMethod: ConsumptionMethod;
}

const RestaurantHeader = ({
  restaurant,
  consumptionMethod,
}: RestaurantHeaderProps) => {
  const router = useRouter();
  const { totalItems } = useCart();
  const [cartOpen, setCartOpen] = useState(false);

  return (
    <>
      <div className="relative h-[250px] w-full">
        <Button
          variant="secondary"
          size="icon"
          className="absolute left-4 top-4 z-50 rounded-full"
          onClick={() => router.back()}
        >
          <ChevronLeftIcon />
        </Button>

        <Image
          src={restaurant.coverImageUrl}
          alt={restaurant.name}
          fill
          className="object-cover"
        />

        <div className="absolute right-4 top-4 z-50">
          <Button
            variant="secondary"
            size="icon"
            className="relative rounded-full"
            onClick={() => setCartOpen(true)}
          >
            <ScrollTextIcon />
            {totalItems > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {totalItems > 9 ? "9+" : totalItems}
              </span>
            )}
          </Button>
        </div>
      </div>

      <CartSheet
        open={cartOpen}
        onOpenChange={setCartOpen}
        restaurantId={restaurant.id}
        consumptionMethod={consumptionMethod}
      />
    </>
  );
};

export default RestaurantHeader;
