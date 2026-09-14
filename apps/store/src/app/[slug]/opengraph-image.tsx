import { ImageResponse } from "next/og";

import { db } from "@/lib/prisma";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface OpengraphImageProps {
  params: Promise<{ slug: string }>;
}

export default async function Image({ params }: OpengraphImageProps) {
  const { slug } = await params;
  const restaurant = await db.restaurant.findUnique({
    where: { slug },
    select: { name: true, description: true, avatarImageUrl: true, primaryColor: true },
  });

  const name = restaurant?.name ?? "PedeFree";
  const description = restaurant?.description ?? "Cardápio digital e pedidos online";
  const accent = restaurant?.primaryColor ? `hsl(${restaurant.primaryColor})` : "hsl(42 100% 50%)";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 28,
          background: `linear-gradient(135deg, ${accent} 0%, #1c1917 85%)`,
          padding: 80,
          textAlign: "center",
        }}
      >
        {restaurant?.avatarImageUrl ? (
          <img
            src={restaurant.avatarImageUrl}
            alt=""
            width={160}
            height={160}
            style={{ borderRadius: "50%", objectFit: "cover", border: "6px solid rgba(255,255,255,0.9)" }}
          />
        ) : (
          <div style={{ fontSize: 96 }}>🍽️</div>
        )}
        <div style={{ fontSize: 64, fontWeight: 700, color: "white", lineHeight: 1.1 }}>{name}</div>
        <div style={{ fontSize: 28, color: "rgba(255,255,255,0.85)", maxWidth: 900 }}>{description}</div>
      </div>
    ),
    { ...size },
  );
}
