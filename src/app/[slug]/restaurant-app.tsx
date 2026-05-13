"use client";

import { ConsumptionMethod, Prisma } from "@prisma/client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

import { useCart } from "@/contexts/cart";

import ConsumptionMethodOption from "./components/consumption-method-option";
import RestaurantCategories from "./menu/components/categories";
import RestaurantHeader from "./menu/components/header";
import OrderHistoryPage from "./orders/page";

type Page = "welcome" | "menu" | "orders";

type RestaurantWithMenu = Prisma.RestaurantGetPayload<{
  include: {
    menuCategories: { include: { products: true } };
    openingHours: true;
  };
}>;

interface RestaurantAppProps {
  restaurant: RestaurantWithMenu;
  isPaused?: boolean;
}

const VALID_METHODS: ConsumptionMethod[] = ["DINE_IN", "TAKEAWAY"];

export default function RestaurantApp({ restaurant, isPaused }: RestaurantAppProps) {
  const searchParams = useSearchParams();
  const { setPrefilledTable } = useCart();
  const [page, setPage] = useState<Page>("welcome");
  const [consumptionMethod, setConsumptionMethod] =
    useState<ConsumptionMethod>("DINE_IN");

  useEffect(() => {
    const method = searchParams.get("consumptionMethod")?.toUpperCase();
    const table = searchParams.get("table");
    if (method && VALID_METHODS.includes(method as ConsumptionMethod)) {
      setConsumptionMethod(method as ConsumptionMethod);
      if (table) setPrefilledTable(table);
      setPage("menu");
    }
  }, [searchParams, setPrefilledTable]);

  if (page === "menu") {
    return (
      <div>
        {isPaused && (
          <div className="flex items-center justify-center gap-2 bg-red-500 px-4 py-2.5 text-center text-xs font-semibold text-white">
            <span>⏸</span>
            <span>Restaurante pausado — não aceitando pedidos no momento</span>
          </div>
        )}
        <RestaurantHeader
          restaurant={restaurant}
          consumptionMethod={consumptionMethod}
          onBack={() => setPage("welcome")}
        />
        <RestaurantCategories
          restaurant={restaurant}
          openingHours={restaurant.openingHours}
        />
      </div>
    );
  }

  if (page === "orders") {
    return <OrderHistoryPage onBack={() => setPage("welcome")} />;
  }

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-background">
      {/* Fundo decorativo com gradiente */}
      <div
        className="absolute inset-0 -z-10"
        aria-hidden="true"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-primary/12 via-background to-background" />
        <div className="absolute -top-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      </div>

      {/* Conteúdo principal */}
      <div className="flex flex-1 flex-col items-center justify-center px-6 py-12 pt-safe">
        {/* Logo e nome */}
        <div className="animate-scale-in flex flex-col items-center gap-4">
          <div className="relative">
            <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-xl scale-110" />
            <Image
              src={restaurant.avatarImageUrl}
              alt={restaurant.name}
              width={100}
              height={100}
              priority
              className="relative rounded-3xl shadow-md"
            />
          </div>
          <h2 className="text-base font-semibold text-foreground/70">{restaurant.name}</h2>
        </div>

        {/* Boas-vindas */}
        <div className="animate-slide-up animate-delay-100 mt-8 max-w-xs space-y-2 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Seja bem-vindo! 👋
          </h1>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Como você prefere aproveitar sua refeição hoje?
          </p>
        </div>

        {/* Opções de consumo */}
        <div className="animate-slide-up animate-delay-200 mt-8 grid w-full max-w-xs grid-cols-2 gap-3">
          <ConsumptionMethodOption
            buttonText="Comer aqui"
            imageAlt="Comer aqui"
            imageUrl="/dine_in.png"
            priority
            onClick={() => {
              setConsumptionMethod("DINE_IN");
              setPage("menu");
            }}
          />
          <ConsumptionMethodOption
            buttonText="Para levar"
            imageAlt="Para levar"
            imageUrl="/takeaway.png"
            priority
            onClick={() => {
              setConsumptionMethod("TAKEAWAY");
              setPage("menu");
            }}
          />
        </div>

        {/* Link pedidos anteriores */}
        <button
          onClick={() => setPage("orders")}
          className="animate-fade-in animate-delay-400 mt-8 rounded-full px-5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:opacity-70"
        >
          Ver meus pedidos anteriores →
        </button>
      </div>
    </div>
  );
}
