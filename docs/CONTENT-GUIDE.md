# CONTENT GUIDE — SkulSuite

How to edit the website's content without touching UI components.
All marketing copy lives in `src/data/`; all configuration lives in `.env`.
This guide also lists what **must** be confirmed before launch.

## Quick reference

| I want to change… | Edit this file |
|---|---|
| Brand name, tagline, navigation links | `src/data/site.ts` |
| Product names, descriptions, features, FAQs | `src/data/products.ts` |
| Pricing plans and blurbs | `src/data/pricing.ts` |
| General FAQs | `src/data/faq.ts` |
| Homepage hero, problems, benefits | `src/data/home.ts` |
| How-it-works steps | `src/data/how-it-works.ts` |
| WhatsApp number, email, phone, analytics | `.env.local` (see `.env.example`) |

## Common edits

### Add a real price to a plan

Open `src/data/pricing.ts`. Every plan has:

```ts
{
  name: "Starter",
  price: "Contact us for pricing",   // ← change to e.g. "₦150,000 / term"
  priceNote: "...",                  // ← billing explanation under the price
}
```

You can also add or rename plans — each product's plan list is independent.

### Add or change a product feature (IMPORTANT)

All current features were verified against the product source code in
September 2026 (see `docs/PRODUCT-AUDIT.md`). When adding a new claim:

1. Confirm it in the real app first.
2. Add it to `src/data/products.ts` with `verification: "verified"`.
3. While auditing anything new locally, set
   `NEXT_PUBLIC_SHOW_VERIFICATION_FLAGS=true` to badge unconfirmed claims.

### Change a WhatsApp pre-filled message

`src/lib/whatsapp.ts` → `whatsappMessages`. Product pages use the matching
message; navbar/footer/pricing use the general one. The number itself comes
from `NEXT_PUBLIC_WHATSAPP_NUMBER` (international format, digits only, e.g.
`2348012345678`). If it's empty, all WhatsApp buttons hide automatically.

### Add screenshots

Product pages render whatever you drop into the screenshot folders — no code
changes needed:

1. Add images (png/jpg/webp) to `public/screenshots/cbt/`,
   `public/screenshots/question-bank/`, or `public/screenshots/school-management/`.
2. Filename order = display order, so prefix with numbers:
   `01-dashboard.png`, `02-exam-screen.png`…
3. Optional: add a `captions.json` in the same folder for alt text/captions:

   ```json
   { "01-dashboard.png": "Staff dashboard with exam overview" }
   ```

Files without captions get readable alt text from their filenames. The first
image spans full width on desktop; all images are lazy-loaded and open full
size in a new tab when clicked.

### Connect real lead capture

1. Create an endpoint (Formspree, Getform, or your own).
2. Set `NEXT_PUBLIC_FORM_ENDPOINT=https://…` in `.env.local`.
3. The form POSTs JSON: name, school, phone, email, role, product, students,
   message, source.
4. Without an endpoint, submissions still work: the form shows the success
   state and opens WhatsApp with the structured message as the handoff.

## Content rules (non-negotiable)

- **Never invent a product feature.** Only market what you verified.
- **Never fabricate** testimonials, customers, statistics, awards or partnerships.
- **Never publish invented prices.** Plans show "Contact us for pricing" until real numbers exist.
- Avoid unverifiable superlatives ("best in Nigeria", "number one").

## After editing

```bash
npm run dev      # check your changes at http://localhost:3000
npm run build    # confirm the production build still passes
```
