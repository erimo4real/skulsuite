/**
 * SkulSuite pricing engine — ONE function that calculates every quote.
 *
 * Implements the pricing rules from the owner's official build prompt
 * (sections 2 and 17). The website calculator, the printable quote and any
 * future checkout must all call this function; prices shown anywhere else
 * come from src/data/pricing-table.ts.
 *
 * The engine is import-free (pure data in, pure data out) so it can run in
 * the browser, in Next.js server code, and in Node test scripts unchanged.
 *
 * Discount rules (from the price list / build prompt):
 * - Bundle 15% is built into the bundle prices; it applies only when all
 *   three products are chosen together.
 * - Early adopter = 50% off the first term (termly licences only).
 * - Pay all three terms upfront = 10% off the yearly licence (termly only).
 * - Early adopter and upfront cannot be combined (rejected, not merged).
 * - No discount ever applies to hosting, domain, one-time fees or the
 *   ownership support plan.
 * - Over 600 students = custom quote: no online price is ever shown.
 *
 * All money is in whole Naira (integers); computed amounts are rounded to
 * the nearest Naira so totals always display cleanly.
 */

export type SchoolSize = "small" | "medium" | "large";
export type PurchaseOption = "termly" | "ownership";
export type ProductKey = "sms" | "cbt" | "qbank";

/** Product price rows, in size order [small, medium, large]. */
export type PriceRow = [number, number, number];

export interface PricingTables {
  /** Per-term licence prices (Option A), including the bundle row. */
  termly: Record<ProductKey | "bundle", PriceRow>;
  /** One-time ownership prices (Option B), including the bundle row. */
  ownership: Record<ProductKey | "bundle", PriceRow>;
  /** Yearly cloud hosting per size (live values from the daily job). */
  hosting: Record<SchoolSize, number>;
  /** Yearly domain fee (same for every size). */
  domain: number;
  /** One-time fees, both options. */
  fees: { setup: number; migration: number; trainingPerSession: number };
}

export interface QuoteInput {
  /** Number of students at the school (drives the size tier). */
  students: number;
  option: PurchaseOption;
  products: ProductKey[];
  /** Online version (adds yearly hosting + domain). */
  online: boolean;
  extras: {
    setup: boolean;
    migration: boolean;
    /** Staff training sessions requested (0–10). */
    trainingSessions: number;
  };
  /** Requested discounts. The engine rejects invalid combinations. */
  discounts: { earlyAdopter: boolean; upfront: boolean };
  /** Ownership only: optional yearly support & updates plan (20% of price). */
  supportPlan: boolean;
  tables: PricingTables;
}

export interface QuoteLine {
  label: string;
  amount: number;
  /** Extra explanation shown under the line (e.g. renewal terms). */
  note?: string;
}

export interface QuoteResult {
  size: SchoolSize | null;
  /** True when the school is over 600 students: no online price is shown. */
  customQuote: boolean;
  /** Set when the request breaks a pricing rule — nothing is calculated. */
  error: string | null;
  /** Warnings the UI must show next to the total. */
  warnings: string[];
  lines: QuoteLine[];
  /** Sum before discounts. */
  subtotal: number;
  /** Total discount amount (positive number). */
  discountAmount: number;
  discountLabel: string | null;
  /** Final total for the period the quote covers (null for custom quotes). */
  total: number | null;
  /** What the total covers, shown under the total ("first term", "3 terms", "one-time"). */
  totalCovers: string;
}

const ALL_PRODUCTS: ProductKey[] = ["sms", "cbt", "qbank"];

export const SIZE_LABELS: Record<SchoolSize, string> = {
  small: "Small (up to 99 students)",
  medium: "Medium (100–299 students)",
  large: "Large (300–600 students)",
};

/** T12: tier boundaries are exact — 99 small, 100 medium, 299 medium, 300 large, 600 large, 601 custom. */
export function sizeForStudents(students: number): SchoolSize | null {
  if (!Number.isFinite(students) || students <= 0) return null;
  if (students <= 99) return "small";
  if (students <= 299) return "medium";
  if (students <= 600) return "large";
  return null; // over 600 = custom quote
}

function sizeIndex(size: SchoolSize): 0 | 1 | 2 {
  return size === "small" ? 0 : size === "medium" ? 1 : 2;
}

function isBundle(products: ProductKey[]): boolean {
  const set = new Set(products);
  return ALL_PRODUCTS.every((p) => set.has(p));
}

function round(n: number): number {
  return Math.round(n);
}

export function calculateQuote(input: QuoteInput): QuoteResult {
  const empty: QuoteResult = {
    size: null,
    customQuote: false,
    error: null,
    warnings: [],
    lines: [],
    subtotal: 0,
    discountAmount: 0,
    discountLabel: null,
    total: null,
    totalCovers: "",
  };

  // ── Rule guards (never trust the browser) ──────────────────────────────
  if (!Number.isFinite(input.students) || input.students <= 0) {
    return { ...empty, error: "Enter the number of students at your school." };
  }
  const products = Array.from(new Set(input.products)).filter((p) =>
    ALL_PRODUCTS.includes(p),
  );
  if (products.length === 0) {
    return {
      ...empty,
      error: "Choose at least one product to build a quote.",
    };
  }
  // T13: the two termly discounts can never be combined.
  if (input.discounts.earlyAdopter && input.discounts.upfront) {
    return {
      ...empty,
      error:
        "The early-adopter and upfront-payment discounts cannot be combined. Choose one.",
    };
  }
  if (input.discounts.earlyAdopter && input.option !== "termly") {
    return {
      ...empty,
      error: "The early-adopter discount applies to termly licences only.",
    };
  }
  if (input.discounts.upfront && input.option !== "termly") {
    return {
      ...empty,
      error: "The upfront discount applies to termly licences only.",
    };
  }

  const size = sizeForStudents(input.students);
  if (size === null) {
    // T12: over 600 students = custom quote, no online price.
    return {
      ...empty,
      customQuote: true,
      warnings: [
        "Schools with more than 600 students get a custom quote — request a demo and we will put it together.",
      ],
    };
  }

  const idx = sizeIndex(size);
  const rows = input.option === "termly" ? input.tables.termly : input.tables.ownership;
  const bundle = isBundle(products);

  // ── Base licence price (bundle row already includes the 15% discount) ──
  const base = bundle ? rows.bundle[idx] : products.reduce((sum, p) => sum + rows[p][idx], 0);

  const lines: QuoteLine[] = [];
  const warnings: string[] = [];
  let subtotal = 0;
  let discountAmount = 0;
  let discountLabel: string | null = null;
  let totalCovers: string;

  if (input.option === "termly") {
    if (input.discounts.upfront) {
      // T8: base × 3 terms, then 10% off the yearly (3-term) amount.
      const threeTerms = base * 3;
      subtotal += threeTerms;
      lines.push({
        label: bundle ? "All three products — termly licence, 3 terms" : "Termly licence, 3 terms",
        amount: threeTerms,
        note: "All three terms paid upfront.",
      });
      discountAmount = round(threeTerms * 0.1);
      discountLabel = "Pay all three terms upfront — 10% off";
      totalCovers = "the full school year (3 terms)";
    } else {
      subtotal += base;
      lines.push({
        label: bundle ? "All three products — termly licence" : "Termly licence",
        amount: base,
        note: input.discounts.earlyAdopter ? "First term." : "Per term.",
      });
      if (input.discounts.earlyAdopter) {
        // T7: 50% off the first term.
        discountAmount = round(base * 0.5);
        discountLabel = "Early adopter — 50% off the first term";
        warnings.push(
          "The early-adopter price covers the first term only. Later terms return to the normal termly price.",
        );
      }
      totalCovers = input.discounts.earlyAdopter ? "the first term" : "one term";
    }
  } else {
    // Ownership: one-time purchase (T5/T6).
    subtotal += base;
    lines.push({
      label: bundle ? "All three products — one-time purchase" : "One-time purchase",
      amount: base,
      note: "Pay 50% when we agree and 50% on delivery. Source code is not included.",
    });
    totalCovers = "one-time purchase (one school site)";

    if (input.supportPlan) {
      // T11: 20% of the ownership price per year.
      const support = round(base * 0.2);
      subtotal += support;
      lines.push({
        label: "Yearly support and updates plan (optional)",
        amount: support,
        note: "20% of the purchase price, billed yearly.",
      });
    }
  }

  // ── Yearly hosting + domain (online version only, never discounted) ────
  if (input.online) {
    const hosting = input.tables.hosting[size];
    subtotal += hosting;
    lines.push({
      label: "Cloud hosting (yearly)",
      amount: hosting,
      note: "Reviewed at each yearly renewal because providers are paid in US dollars.",
    });
    subtotal += input.tables.domain;
    lines.push({
      label: "Domain name (yearly)",
      amount: input.tables.domain,
    });
  }

  // ── One-time extras (never discounted, T14) ────────────────────────────
  if (input.extras.setup) {
    subtotal += input.tables.fees.setup;
    lines.push({
      label: "Setup and offline installation (one school site)",
      amount: input.tables.fees.setup,
    });
  }
  if (input.extras.migration) {
    subtotal += input.tables.fees.migration;
    lines.push({
      label: "Student records data migration",
      amount: input.tables.fees.migration,
    });
  }
  const sessions = Math.max(0, Math.min(10, Math.round(input.extras.trainingSessions || 0)));
  if (sessions > 0) {
    const training = sessions * input.tables.fees.trainingPerSession;
    subtotal += training;
    lines.push({
      label: `Staff training (${sessions} session${sessions > 1 ? "s" : ""})`,
      amount: training,
    });
  }

  if (discountAmount > 0) {
    lines.push({ label: discountLabel as string, amount: -discountAmount });
  }

  const total = Math.max(0, subtotal - discountAmount);

  return {
    size,
    customQuote: false,
    error: null,
    warnings,
    lines,
    subtotal,
    discountAmount,
    discountLabel,
    total,
    totalCovers,
  };
}
