/**
 * Generates public/ero-knowledge.json — the ONLY source Ero's AI may answer
 * from (build prompt §12: "answers ONLY from the approved knowledge base").
 *
 * Content is taken from the audited site data files (products, FAQ, pricing
 * rules, how-it-works) plus the real price table. Re-run after any content
 * change:  node scripts/generate-ero-kb.mjs
 *
 * Prices in the KB are FOR APPROXIMATE TALK ONLY ("from ₦15,000 per term").
 * Exact amounts must always come from the pricing engine, which the server
 * function calls; the prompt tells Ero to route price math there.
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { pathToFileURL } from "node:url";
import path from "node:path";

const root = process.cwd();
const importFrom = async (rel) => await import(pathToFileURL(path.join(root, rel)).href);

const { products } = await importFrom("src/data/products.ts");
const { generalFaqs } = await importFrom("src/data/faq.ts");
const { howItWorksSteps } = await importFrom("src/data/how-it-works.ts");
const {
  offlineFaqs,
  editionComparison,
  offlineRequirements,
} = await importFrom("src/data/offline.ts");
const {
  termlyPrices,
  ownershipPrices,
  oneTimeFees,
  hostingTiers,
  discounts,
  pricingTerms,
  PRICE_LIST_VERSION,
} = await importFrom("src/data/pricing-table.ts");
const { site } = await importFrom("src/data/site.ts");

const kb = {
  business: {
    name: site.name,
    tagline: site.tagline,
    description: site.description,
  },
  products: products.map((p) => ({
    name: p.name,
    shortName: p.shortName,
    summary: p.summary,
    slug: p.slug,
    url: `/products/${p.slug}`,
    features: p.features.map((f) => f.title),
  })),
  pricing: {
    priceListVersion: PRICE_LIST_VERSION,
    tiers: "Small: up to 99 students. Medium: 100-299. Large: 300-600. Over 600 students: custom quote only.",
    termlyPerTerm: termlyPrices.map((r) => ({
      product: r.name,
      small: r.amounts[0],
      medium: r.amounts[1],
      large: r.amounts[2],
      note: r.note ?? null,
    })),
    ownershipOneTime: ownershipPrices.map((r) => ({
      product: r.name,
      small: r.amounts[0],
      medium: r.amounts[1],
      large: r.amounts[2],
      note: r.note ?? null,
    })),
    oneTimeFees,
    yearlyHostingAndDomain: hostingTiers.map((t) => ({
      size: t.size,
      hosting: t.hosting,
      domain: t.domain,
    })),
    discounts,
    terms: pricingTerms,
    rules: [
      "Never calculate prices yourself. For any exact or combined price, tell the visitor to use the calculator on /pricing or request a demo — the website computes totals with its pricing engine.",
      "Quote only the per-size prices listed here, with 'from ₦X' phrasing when unsure of the school size.",
      "Never invent discounts. Only the discounts in this knowledge base exist, and early-adopter + upfront cannot be combined.",
      "Never apply discounts to hosting, domain or one-time fees.",
    ],
  },
  faq: generalFaqs,
  offlineEdition: {
    summary:
      "SkulSuite runs with or without internet. The offline edition runs on the school's own network (one server computer + the school's router; no internet day-to-day; a short phone-hotspot session about once a month handles updates, licence checks and backups). The online edition runs on cloud servers so parents and staff connect from anywhere. Licence prices are the same in both editions; offline removes yearly hosting and domain fees and adds the one-time ₦50,000 setup and offline installation fee.",
    comparison: editionComparison,
    requirements: offlineRequirements,
    faqs: offlineFaqs,
    page: "/offline",
  },
  howItWorks: howItWorksSteps.map((s) => ({ title: s.title, description: s.description })),
  navigation: {
    home: "/",
    products: "/products",
    pricing: "/pricing",
    resources: "/resources",
    howItWorks: "/how-it-works",
    faq: "/faq",
    contact: "/contact",
    demo: "/demo",
  },
  personality: [
    "You are Ero, a friendly robot-teacher mascot for SkulSuite. You always say you are an AI assistant — never pretend to be human.",
    "You help school owners, principals and ICT teachers find the right product, understand pricing, and book a demo.",
    "Speak in short, warm, plain sentences (Nigerian-friendly English). Simple Pidgin is fine if the visitor uses it first.",
    "If you are unsure or the question goes beyond this knowledge base, say so honestly and offer the WhatsApp human handoff.",
    "Never invent schools, testimonials, statistics, awards or approvals. Never promise delivery dates or prices not in this file.",
    "You cannot see anything outside this website and cannot read the visitor's email or other apps.",
  ],
};

mkdirSync(path.join(root, "public"), { recursive: true });
const out = path.join(root, "public", "ero-knowledge.json");
writeFileSync(out, JSON.stringify(kb, null, 2));
console.log(`Wrote ${out} (${(JSON.stringify(kb).length / 1024).toFixed(1)} KB)`);
