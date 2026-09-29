import { site } from "@/data/site";
import { products } from "@/data/products";
import { siteUrl } from "@/lib/env";

/**
 * JSON-LD organization schema for search engines (PRD §19).
 * Rendered as a plain script tag, per the Next.js App Router
 * JSON-LD pattern.
 */
export function JsonLd() {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    description: site.description,
    url: siteUrl,
    makesOffer: products.map((p) => ({
      "@type": "Offer",
      itemOffered: {
        "@type": "SoftwareApplication",
        name: p.name,
        description: p.summary,
        applicationCategory: "EducationalApplication",
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
