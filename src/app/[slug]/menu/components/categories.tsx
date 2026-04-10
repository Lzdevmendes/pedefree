"use client";

import { Prisma } from "@prisma/client";
import { ClockIcon, SearchIcon, XIcon } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";

import Products from "./products";

interface RestaurantCategoriesProps {
  restaurant: Prisma.RestaurantGetPayload<{
    include: {
      menuCategories: {
        include: { products: true };
      };
    };
  }>;
}

type MenuCategoriesWithProducts = Prisma.MenuCategoryGetPayload<{
  include: { products: true };
}>;

const RestaurantCategories = ({ restaurant }: RestaurantCategoriesProps) => {
  const [selectedCategory, setSelectedCategory] =
    useState<MenuCategoriesWithProducts>(restaurant.menuCategories[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const allProducts = restaurant.menuCategories.flatMap((c) => c.products);

  const filteredProducts = searchQuery.trim()
    ? allProducts.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    : null;

  const handleCategoryClick = (category: MenuCategoriesWithProducts) => {
    setSelectedCategory(category);
  };

  const getCategoryButtonVariant = (category: MenuCategoriesWithProducts) => {
    return selectedCategory.id === category.id ? "default" : "secondary";
  };

  return (
    <div className="relative z-50 mt-[-1.5rem] rounded-t-3xl bg-white">
      <div className="p-5">
        <div className="flex items-center gap-3">
          <Image
            src={restaurant.avatarImageUrl}
            alt={restaurant.name}
            height={45}
            width={45}
          />
          <div>
            <h2 className="text-lg font-semibold">{restaurant.name}</h2>
            <p className="text-xs opacity-55">{restaurant.description}</p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1 text-xs text-green-500">
          <ClockIcon size={12} />
          <p>Aberto!</p>
        </div>

        <div className="relative mt-4">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            placeholder="Buscar no cardápio..."
            className="pl-9 pr-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              onClick={() => setSearchQuery("")}
            >
              <XIcon size={14} />
            </button>
          )}
        </div>
      </div>

      {!filteredProducts && (
        <>
          <ScrollArea className="w-full">
            <div className="flex w-max space-x-4 p-4 pt-0">
              {restaurant.menuCategories.map((category) => (
                <Button
                  onClick={() => handleCategoryClick(category)}
                  key={category.id}
                  variant={getCategoryButtonVariant(category)}
                  size="sm"
                  className="rounded-full"
                >
                  {category.name}
                </Button>
              ))}
            </div>
            <ScrollBar orientation="horizontal" />
          </ScrollArea>

          <h3 className="px-5 pt-2 font-semibold">{selectedCategory.name}</h3>
          <Products products={selectedCategory.products} />
        </>
      )}

      {filteredProducts && (
        <div className="px-5 pt-2">
          <p className="mb-2 text-sm text-muted-foreground">
            {filteredProducts.length === 0
              ? `Nenhum produto encontrado para "${searchQuery}"`
              : `${filteredProducts.length} resultado${filteredProducts.length > 1 ? "s" : ""} para "${searchQuery}"`}
          </p>
          <Products products={filteredProducts} />
        </div>
      )}
    </div>
  );
};

export default RestaurantCategories;
