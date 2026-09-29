/**
 * Product content types. Every feature carries a verification status so the
 * site can never silently advertise an unconfirmed capability (PRD §25).
 */

export type ProductId = "cbt" | "question-bank" | "school-management";

export type Verification = "verified" | "needs-verification";

export interface ProductFeature {
  title: string;
  description: string;
  verification: Verification;
}

export interface ProductFaq {
  question: string;
  answer: string;
}

export interface ProductStep {
  title: string;
  description: string;
}

export interface Product {
  id: ProductId;
  name: string;
  shortName: string;
  /** Route slug under /products */
  slug: string;
  /** One-sentence value proposition. */
  tagline: string;
  /** 1-2 sentence description used on cards and overview pages. */
  summary: string;
  icon: "monitor" | "database" | "school";
  /** Visual accent used across cards and product pages. */
  accent: "brand" | "violet" | "emerald";
  /** Real-world problem the product solves (PRD Phase 5). */
  problem: string[];
  solution: string;
  features: ProductFeature[];
  howItWorks: ProductStep[];
  /** School-level outcomes, not technical claims. */
  benefits: string[];
  audience: string[];
  faq: ProductFaq[];
  seo: { title: string; description: string };
}

export const VERIFICATION_LABEL: Record<Verification, string> = {
  verified: "Verified",
  "needs-verification": "To be confirmed",
};
