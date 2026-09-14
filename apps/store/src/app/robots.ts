import { MetadataRoute } from "next";

const baseUrl = process.env.NEXT_PUBLIC_STORE_URL || "http://localhost:3013";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/*/kitchen", "/*/orders", "/*/qrcode"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
