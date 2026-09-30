import fs from "fs";
import path from "path";
import { hostingTiers } from "@/data/pricing-table";

/**
 * Live hosting prices, generated daily by scripts/update-hosting-prices.mjs
 * (GitHub Actions). When the file is absent (fresh clone, before first run)
 * we fall back to the static tiers from the official price list — the site
 * always shows real numbers either way.
 */
export interface LiveHosting {
  updated: string;
  rate: number;
  planning_rate_ngn_per_usd: number;
  tiers: Record<string, { label: string; hosting: number }>;
  note: string;
}

export function getLiveHosting(): LiveHosting | null {
  try {
    const raw = fs.readFileSync(
      path.join(process.cwd(), "src", "data", "hosting-live.json"),
      "utf8",
    );
    return JSON.parse(raw) as LiveHosting;
  } catch {
    return null;
  }
}

/** Hosting amounts per size: live values when available, price-list values otherwise. */
export function hostingAmounts(): Record<string, number> {
  const live = getLiveHosting();
  const out: Record<string, number> = {};
  for (const t of hostingTiers) {
    out[t.size] = live?.tiers?.[t.size]?.hosting ?? t.hosting;
  }
  return out;
}
