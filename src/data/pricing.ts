import type { ProductId } from "./product-types";
import {
  termlyPrices,
  ownershipPrices,
  naira,
  fromPrice,
  PRICE_LIST_VERSION,
  type PriceRow,
} from "./pricing-table";

export interface PricingPlan {
  name: string;
  /** Real prices from the official price list (no invented numbers). */
  price: string;
  priceNote: string;
  description: string;
  features: string[];
  highlighted?: boolean;
  /** Query param that pre-selects the product on the demo form. */
  demoHref: string;
}

export interface ProductPricing {
  productId: ProductId;
  productName: string;
  blurb: string;
  plans: PricingPlan[];
}

/**
 * Build each product's pricing cards from the official price list.
 * The "Starter" card shows the termly prices per school size, the "Standard"
 * card is highlighted and shows the ownership prices, and a bundle card
 * advertises the 15% bundle discount.
 */
function plansFor(
  productId: ProductId,
  productName: string,
  key: "sms" | "cbt" | "qbank",
  blurb: string,
): ProductPricing {
  const termly = termlyPrices.find((r) => r.key === key) as PriceRow;
  const ownership = ownershipPrices.find((r) => r.key === key) as PriceRow;
  const bundleTermly = termlyPrices.find((r) => r.key === "bundle") as PriceRow;
  const bundleOwnership = ownershipPrices.find((r) => r.key === "bundle") as PriceRow;
  const demoHref = `/demo?product=${productId}`;

  const sizeLabels = ["Small", "Medium", "Large"];

  return {
    productId,
    productName,
    blurb,
    plans: [
      {
        name: "Termly licence",
        price: `from ${naira(fromPrice(termly))} / term`,
        priceNote: `${sizeLabels.map((s, i) => `${s} ${naira(termly.amounts[i])}`).join(" · ")}`,
        description:
          "Pay per term. Includes software updates and support (phone or WhatsApp on school days) while your licence is active.",
        features: [
          `All ${productName} features`,
          "Software updates included",
          "Phone or WhatsApp support on school days",
          "Cancel by simply not renewing",
        ],
        demoHref,
      },
      {
        name: "Own the app",
        price: `from ${naira(fromPrice(ownership))} once`,
        priceNote: `${sizeLabels.map((s, i) => `${s} ${naira(ownership.amounts[i])}`).join(" · ")}`,
        description:
          "Pay once, use it permanently at one school site — no termly fees. Source code is not included; 50% when we agree, 50% on delivery.",
        features: [
          `All ${productName} features`,
          "No termly licence fees",
          "Optional yearly support plan (20%/yr)",
          "Source-code ownership on request",
        ],
        highlighted: true,
        demoHref,
      },
      {
        name: "Bundle & save 15%",
        price: `from ${naira(fromPrice(bundleTermly))} / term`,
        priceNote: `${sizeLabels.map((s, i) => `${s} ${naira(bundleTermly.amounts[i])}`).join(" · ")}`,
        description:
          "All three products together. Bundle prices already include the 15% discount — termly or ownership.",
        features: [
          "School Management System",
          "CBT Examination System",
          "Question Bank",
          `Ownership bundle from ${naira(bundleOwnership.amounts[0])} once`,
        ],
        demoHref,
      },
    ],
  };
}

export const pricing: ProductPricing[] = [
  plansFor(
    "cbt",
    "CBT Examination System",
    "cbt",
    "Pricing follows your school's size. Take exams on computers or students' phones — every plan starts with a demo so you see exactly what you're paying for.",
  ),
  plansFor(
    "question-bank",
    "Question Bank",
    "qbank",
    "Pricing follows your school's size. Store every question once and reuse it forever — every plan starts with a demo so you see exactly what you're paying for.",
  ),
  plansFor(
    "school-management",
    "School Management System",
    "sms",
    "Pricing follows your school's size. Students, staff, attendance, fees, exams and report cards in one place — every plan starts with a demo so you see exactly what you're paying for.",
  ),
];

export const customPackageNote = {
  title: "Over 600 students, or something custom?",
  description:
    "Over 600 students: custom quote — request a demo and we'll put the right package together. The early-adopter discount (50% off your first term) and the 3-terms-upfront discount (10% off the yearly licence) are also available on termly licences.",
  cta: "Request a demo",
  ctaHref: "/demo",
};

/** Where the numbers came from — shown on the pricing page for honesty. */
export const priceSource = {
  version: PRICE_LIST_VERSION,
  validUntil: "29 October 2026",
  fileName: "School-Software-Price-List.pdf",
  filePath: "/downloads/School-Software-Price-List.pdf",
};
