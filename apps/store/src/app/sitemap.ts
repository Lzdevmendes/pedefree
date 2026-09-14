import { MetadataRoute } from "next";

import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const baseUrl = process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3013";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const restaurants = await db.restaurant.findMany({
    select: { slug: true, updatedAt: true },
  });

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...restaurants.map((restaurant) => ({
      url: `${baseUrl}/${restaurant.slug}`,
      lastModified: restaurant.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
  ];
}
