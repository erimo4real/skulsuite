import type { ProductId } from "./product-types";

export interface PricingPlan {
  name: string;
  /** No prices are invented: every plan shows this until real pricing is supplied. */
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

const CONTACT_PRICE = "Contact us for pricing";

function plans(productId: ProductId, productName: string): PricingPlan[] {
  const demoHref = `/demo?product=${productId}`;
  return [
    {
      name: "Starter",
      price: CONTACT_PRICE,
      priceNote: "One-off or per-term billing — confirmed during your demo",
      description: "For small schools taking their first step with digital tools.",
      features: [
        `All ${productName} features`,
        "Setup assistance",
        "Staff training",
        "WhatsApp & email support",
      ],
      demoHref,
    },
    {
      name: "Standard",
      price: CONTACT_PRICE,
      priceNote: "Scaled to your number of students",
      description: "For growing schools that need more capacity and support.",
      features: [
        `All ${productName} features`,
        "Setup assistance",
        "Staff training",
        "Priority WhatsApp & email support",
      ],
      highlighted: true,
      demoHref,
    },
    {
      name: "Large School",
      price: CONTACT_PRICE,
      priceNote: "Custom package for your size and structure",
      description: "For large schools and groups of schools.",
      features: [
        `All ${productName} features`,
        "Custom onboarding plan",
        "Staff training for every department",
        "Priority support",
      ],
      demoHref,
    },
  ];
}

export const pricing: ProductPricing[] = [
  {
    productId: "cbt",
    productName: "CBT Examination System",
    blurb:
      "Pricing is based on your school's size and how you run exams. Every plan starts with a demo so you see exactly what you're paying for.",
    plans: plans("cbt", "CBT"),
  },
  {
    productId: "question-bank",
    productName: "Question Bank",
    blurb:
      "Plans follow your number of teachers and subjects. Contact us and we'll put together the right package.",
    plans: plans("question-bank", "Question Bank"),
  },
  {
    productId: "school-management",
    productName: "School Management System",
    blurb:
      "Pricing follows your school's size and the modules you adopt. Confirmed clearly before anything is installed.",
    plans: plans("school-management", "School Management"),
  },
];

export const customPackageNote = {
  title: "Need a custom package?",
  description:
    "Every school is different. Tell us about your school — number of students, products you're interested in and how you work — and we'll build a package around you.",
  cta: "Contact Us",
  ctaHref: "/contact",
} as const;
