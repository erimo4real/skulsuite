# SkulSuite

Marketing website for **SkulSuite** — a suite of school software products:

1. **CBT Examination System** — run school exams on computer with timed exams and automatic marking of objectives.
2. **Question Bank** — create, organise and reuse your school's exam questions.
3. **School Management System** — students, staff, classes, attendance, results and fees in one place.

The site is the marketing/sales layer only: it explains the products, presents
pricing and captures demo requests (form + WhatsApp). The products themselves
exist separately and are **not** part of this codebase.

## Tech stack

- **Next.js 15** (App Router, fully static export) + **TypeScript**
- **Tailwind CSS 3** with a brand/accent token theme
- Zero extra runtime dependencies — icons are inline SVG, GA is optional
- Deployable anywhere static files run (Vercel, Netlify, cPanel/shared hosting)

## Getting started

```bash
npm install
cp .env.example .env.local   # optional — sensible defaults work without it
npm run dev                  # http://localhost:3000
```

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build → static site in `out/` |
| `npm run lint` | ESLint (Next.js core-web-vitals + TS) |
| `npm run typecheck` | `tsc --noEmit` |

## Environment variables

Copy `.env.example` to `.env.local` and fill in what you have. Everything is
optional; missing values degrade gracefully (e.g. WhatsApp buttons hide when no
number is configured).

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production URL for canonical/sitemap/OG |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | International format, digits only (`2348012345678`) |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `NEXT_PUBLIC_CONTACT_PHONE` | Contact page + footer |
| `NEXT_PUBLIC_FORM_ENDPOINT` | Lead-capture endpoint (e.g. Formspree). Empty → WhatsApp fallback |
| `NEXT_PUBLIC_GA_ID` | Google Analytics measurement ID |
| `NEXT_PUBLIC_SHOW_VERIFICATION_FLAGS` | `true` while auditing: badge unconfirmed features |

## Content & docs

- [`docs/CONTENT-GUIDE.md`](docs/CONTENT-GUIDE.md) — how to change copy, pricing, FAQs (no code needed)
- [`docs/PRODUCT-AUDIT.md`](docs/PRODUCT-AUDIT.md) — ✅ code-level audit of the three products; all marketing claims verified against the ERP source
- [`docs/LEAD-CAPTURE-SETUP.md`](docs/LEAD-CAPTURE-SETUP.md) — connect Formspree + WhatsApp number (5 minutes)
- [`docs/WEBSITE-STRUCTURE.md`](docs/WEBSITE-STRUCTURE.md) — routes, architecture, design system

## Deployment

```bash
npm run build
```

Static output lands in `out/`:

- **Vercel / Netlify** — import the repo, build command `npm run build`.
- **cPanel / shared hosting** — upload the contents of `out/` to `public_html`.

After your first deploy, set `NEXT_PUBLIC_SITE_URL` to the live domain and
rebuild so the sitemap and canonical URLs point at the right place.

## Launch checklist

- [x] Audit the three products → features verified in code (`docs/PRODUCT-AUDIT.md`)
- [x] Screenshot galleries wired (drop images into `public/screenshots/<product>/`)
- [ ] Runtime QA pass on the ERP (create exam → take → grade → results)
- [ ] Confirm pricing → `src/data/pricing.ts`
- [ ] Set WhatsApp number, email, phone in env (`docs/LEAD-CAPTURE-SETUP.md`)
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the production domain
- [ ] Configure `NEXT_PUBLIC_FORM_ENDPOINT` for lead capture
- [ ] Add real screenshots to `public/screenshots/`
- [ ] `npm run build` passes, then deploy
