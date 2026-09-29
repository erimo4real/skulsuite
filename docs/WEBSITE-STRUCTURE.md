# WEBSITE STRUCTURE — SkulSuite

## Routes

| Route | Purpose | Notes |
|---|---|---|
| `/` | Homepage | Hero → Products → Problems → Benefits → How it works → Pricing preview → FAQ → CTA |
| `/products` | Products overview | Three cards linking to product pages |
| `/products/cbt` | CBT Examination System | Hero, problem/solution, features, how it works, screenshots, benefits, audience, pricing, FAQ, CTA |
| `/products/question-bank` | Question Bank | Same structure, unique content |
| `/products/school-management` | School Management System | Same structure, unique content |
| `/pricing` | Pricing | Plan cards per product ("Contact us for pricing") + custom package note |
| `/how-it-works` | Adoption process | Five steps + what to expect in a demo |
| `/demo` | Request a demo | Lead form (name, school, phone, email, role, product, students, message) + WhatsApp alternative |
| `/contact` | Contact | Contact form + direct channels (env-configured) |
| `/faq` | Full FAQ | All general questions |
| `/sitemap.xml` | SEO sitemap | Auto-generated from routes |
| `/robots.txt` | Crawler rules | References sitemap |
| 404 | Not found page | Helpful links back |

## Conversion funnel

```
Visitor → Hero/Products → Product page (features, screenshots)
        → Pricing → Request Demo → WhatsApp / Contact → Sale
```

Every product page, pricing card and the footer carries a **Request a Demo** CTA.
WhatsApp CTAs appear in the navbar, hero, product pages, pricing, demo page,
contact page, footer, and as a fallback handoff after form submission.

## Architecture

```
src/
  app/                  # Next.js App Router pages (all statically generated)
  components/           # Reusable UI (Navbar, Footer, ProductCard, LeadForm, …)
  data/                 # ALL marketing content lives here
    site.ts             # Brand, navigation, CTA labels
    products.ts         # Product copy + features (with verification flags)
    pricing.ts          # Plans (structure only — no invented prices)
    faq.ts              # General FAQs
    home.ts             # Homepage copy
    how-it-works.ts     # Adoption steps
    product-types.ts    # Content types
  lib/
    env.ts              # Env-var configuration (public only)
    seo.ts              # Metadata builder (titles, OG, canonical)
    whatsapp.ts         # wa.me deep links + pre-filled messages
    analytics.ts        # GA event shim (page_view, demo_submit, whatsapp_click…)
```

**Key rule:** content is edited only in `src/data/` and `.env` — no component
changes needed for copy, pricing, FAQ or contact updates (PRD Phase 16).

## Design system

- **Style:** modern education-tech — friendly, trustworthy, restrained.
- **Colors:** `brand` (blue #2563eb) primary; `accent` (amber #f59e0b) for hero CTAs; slate neutrals; per-product accents (blue / violet / emerald).
- **Type:** Inter (self-hosted via `next/font`).
- **Components:** consistent buttons, cards, section headers, badges.
- **Accessibility:** semantic HTML, labelled forms, keyboard-visible focus states, accordion FAQ with `aria-expanded`/`aria-controls`.

## Environment variables

See `.env.example` — site URL, WhatsApp number, contact email/phone, form
endpoint, GA id, verification-flag toggle. All optional with sensible fallbacks;
WhatsApp CTAs auto-hide when no number is configured.
