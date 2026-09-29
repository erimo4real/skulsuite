/**
 * Real pricing, typed in from the owner's official price list
 * ("School Software Price List — Version 1.0 (Final), issued 29 September 2026,
 * valid until 29 October 2026"). Every number here comes verbatim from that
 * document — nothing is invented. When the owner revises the price list,
 * update this file and the valid-until date together.
 */

export type SchoolSize = "small" | "medium" | "large";

export interface SchoolSizeInfo {
  id: SchoolSize;
  label: string;
  range: string;
}

export const schoolSizes: SchoolSizeInfo[] = [
  { id: "small", label: "Small", range: "up to 99 students" },
  { id: "medium", label: "Medium", range: "100–299 students" },
  { id: "large", label: "Large", range: "300–600 students" },
];

export const OVER_600_NOTE =
  "Over 600 students: custom quote — request a demo and we'll put it together.";

export type ProductPricingKey = "sms" | "cbt" | "qbank" | "bundle";

export interface PriceRow {
  key: ProductPricingKey;
  name: string;
  /** Naira amounts per size, in order: small, medium, large. */
  amounts: [number, number, number];
  note?: string;
}

/** Option A — termly licence (pay per term). Includes updates + support while active. */
export const termlyPrices: PriceRow[] = [
  { key: "sms", name: "School Management System", amounts: [40000, 75000, 150000] },
  { key: "cbt", name: "CBT (Computer-Based Testing)", amounts: [20000, 40000, 70000] },
  { key: "qbank", name: "Question Bank", amounts: [15000, 25000, 40000] },
  {
    key: "bundle",
    name: "All three (15% bundle discount)",
    amounts: [63750, 119000, 221000],
    note: "Already includes the 15% bundle discount.",
  },
];

/** Option B — own the app (one-time purchase, one school site, no source code). */
export const ownershipPrices: PriceRow[] = [
  { key: "sms", name: "School Management System", amounts: [400000, 750000, 1500000] },
  { key: "cbt", name: "CBT (Computer-Based Testing)", amounts: [200000, 400000, 700000] },
  { key: "qbank", name: "Question Bank", amounts: [150000, 250000, 400000] },
  {
    key: "bundle",
    name: "All three (15% bundle discount)",
    amounts: [637500, 1190000, 2210000],
    note: "Already includes the 15% bundle discount.",
  },
];

export const TERMLY_NOTE =
  "Includes software updates and support (phone or WhatsApp on school days) while your licence is active.";
export const OWNERSHIP_NOTE =
  "Pay once and use the software permanently at one school site, with no termly licence fees. Source code is not included. Payment: 50% when we agree, 50% on delivery. Optional yearly support and updates plan: 20% of the purchase price per year. Full source-code ownership is available on request and quoted separately.";

export interface OneTimeFee {
  service: string;
  amount: number;
}

export const oneTimeFees: OneTimeFee[] = [
  { service: "Setup and offline installation (one school site)", amount: 50000 },
  { service: "Student records data migration", amount: 30000 },
  { service: "Staff training session", amount: 20000 },
];

export interface HostingTier {
  size: SchoolSize;
  hosting: number;
  domain: number;
}

/** Yearly hosting + domain (online version only; the offline version needs no hosting fee). */
export const hostingTiers: HostingTier[] = [
  { size: "small", hosting: 130000, domain: 40000 },
  { size: "medium", hosting: 260000, domain: 40000 },
  { size: "large", hosting: 525000, domain: 40000 },
];

export const HOSTING_SERVER_NOTE =
  "Server size: Small = 1 GB server, Medium = mid-tier server, Large = 4 GB server. Fees are reviewed at each yearly renewal and may change with the exchange rate. A school that already has its own domain or server pays only for the part it needs.";

export interface Discount {
  title: string;
  detail: string;
}

export const discounts: Discount[] = [
  {
    title: "Early adopter",
    detail: "50% off the first term (termly licence only).",
  },
  {
    title: "Pay all three terms upfront",
    detail: "10% off the yearly licence (termly licence only).",
  },
  {
    title: "Take all three products",
    detail: "15% off — already included in the bundle prices above.",
  },
  {
    title: "Rules",
    detail:
      "The early-adopter and upfront-payment discounts cannot be combined, and neither applies to hosting, domain or one-time fees.",
  },
];

export const pricingTerms: string[] = [
  "Prices are in Nigerian Naira and exclude any applicable taxes.",
  "Termly fees are due at the start of each term. Access may be suspended if a termly fee is more than 14 days overdue.",
  "Hosting and domain fees are due yearly, upfront. If they are not renewed, the online version may go offline until payment is received.",
  "The school owns its data. We keep the intellectual property of the software.",
  "Prices are valid until 29 October 2026.",
];

export const PRICE_LIST_VERSION = "Version 1.0 (Final) — issued 29 September 2026";

/** Formats a Naira amount without the ₦ sign merging into digits. */
export function naira(amount: number): string {
  return `₦${amount.toLocaleString("en-NG")}`;
}

/** Lowest termly price for a product — used for the "from ₦X" hints. */
export function fromPrice(row: PriceRow): number {
  return Math.min(...row.amounts);
}
