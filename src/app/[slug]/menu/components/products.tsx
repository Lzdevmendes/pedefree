"use client";

import { Product } from "@prisma/client";
import Image from "next/image";
import { useState } from "react";

import ProductDetails from "./product-details";

interface ProductsProps {
  products: Product[];
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);

const Products = ({ products }: ProductsProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  return (
    <>
      <div className="space-y-3 px-5">
        {products.map((product) => (
          <div
            key={product.id}
            className="flex cursor-pointer items-center justify-between gap-10 border-b py-3"
            onClick={() => setSelectedProduct(product)}
          >
            <div>
              <h3 className="text-sm font-medium">{product.name}</h3>
              <p className="line-clamp-2 text-sm text-muted-foreground">
                {product.description}
              </p>
              <p className="pt-3 text-sm font-semibold">
                {formatCurrency(product.price)}
              </p>
            </div>

            <div className="relative min-h-[82px] min-w-[120px]">
              <Image
                src={product.imageUrl}
                alt={product.name}
                fill
                className="rounded-lg object-contain"
              />
            </div>
          </div>
        ))}
      </div>

      {selectedProduct && (
        <ProductDetails
          product={selectedProduct}
          open={!!selectedProduct}
          onOpenChange={(open) => !open && setSelectedProduct(null)}
        />
      )}
    </>
  );
};

export default Products;
