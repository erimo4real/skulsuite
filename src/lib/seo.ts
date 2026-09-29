import type { Metadata } from "next";
import { siteUrl } from "./env";
import { site } from "@/data/site";

interface PageMetaInput {
  title: string;
  description: string;
  /** Route path beginning with "/" — used for canonical and OG URLs. */
  path: string;
}

export function buildMetadata({ title, description, path }: PageMetaInput): Metadata {
  const url = `${siteUrl}${path === "/" ? "" : path}`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ${site.name}`,
      description,
      url,
      siteName: site.name,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${site.name}`,
      description,
    },
  };
}
