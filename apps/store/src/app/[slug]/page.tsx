import { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { db } from "@/lib/prisma";

import RestaurantLoading from "./loading";
import RestaurantApp from "./restaurant-app";

interface RestaurantPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: RestaurantPageProps): Promise<Metadata> {
  const { slug } = await params;
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: { name: true, description: true },
  });
  if (!restaurant) return {};
  return {
    title: restaurant.name,
    description: restaurant.description,
    openGraph: {
      title: restaurant.name,
      description: restaurant.description,
    },
  };
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const RestaurantPage = async ({ params }: RestaurantPageProps) => {
  const { slug } = await params;
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    include: {
      menuCategories: {
        include: { products: { where: { isAvailable: true } } },
      },
      openingHours: true,
    },
  });
  if (!restaurant) {
    return notFound();
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: restaurant.name,
    description: restaurant.description,
    image: restaurant.avatarImageUrl || undefined,
    url: `${process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3013"}/${slug}`,
    openingHoursSpecification: restaurant.openingHours
      .filter((oh) => !oh.isClosed)
      .map((oh) => ({
        "@type": "OpeningHoursSpecification",
        dayOfWeek: `https://schema.org/${DAY_NAMES[oh.dayOfWeek]}`,
        opens: oh.openTime,
        closes: oh.closeTime,
      })),
  };

  return (
    <Suspense fallback={<RestaurantLoading />}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <RestaurantApp restaurant={restaurant} isPaused={restaurant.isPaused} />
    </Suspense>
  );
};

export default RestaurantPage;
