import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/env";
import { products } from "@/data/products";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${siteUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/products`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/pricing`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${siteUrl}/offline`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/resources`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${siteUrl}/how-it-works`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/demo`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${siteUrl}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/faq`, changeFrequency: "monthly", priority: 0.5 },
    { url: `${siteUrl}/terms`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/refund-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${siteUrl}/licence`, changeFrequency: "yearly", priority: 0.3 },
  ];
  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = staticEntries.map((entry) => ({
    ...entry,
    lastModified: now,
  }));

  const productRoutes: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${siteUrl}/products/${product.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [...staticRoutes, ...productRoutes];
}
