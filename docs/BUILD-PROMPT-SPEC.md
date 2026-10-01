# Build-Prompt Platform Spec — distilled (for the future Django project)

Source: `Website_Build_Prompt.pdf` + `Website_Build_Prompt1.pdf` (v1.1 = adds Ero
classroom chat styling + sound rules E13–E15; otherwise identical). Full extracted
text: `docs/build-prompt-extracted.txt`. Status: **parked** per master-plan decision
#9/#10 — this is the spec for the separate Django sales-and-management platform,
NOT part of the static Netlify brochure site.

What the static site already implements today is marked ✅.

## 1. Business context
- Three products, each online + offline: School Management System, CBT, Question Bank. ✅ (site)
- Two ways to buy: A) termly licence, B) ownership (perpetual, one school site, no source
  code; source sold by separate quote). ✅ (site content)
- Online versions need yearly hosting + domain; offline needs none. ✅ (site content)

## 2. Pricing (admin-editable later; kobo integers in the platform)
- Tiers: Small 1–99, Medium 100–299, Large 300–600, 601+ custom quote. ✅ engine
- Termly: SMS 40k/75k/150k, CBT 20k/40k/70k, QBank 15k/25k/40k; bundle −15%: 63,750/119,000/221,000. ✅
- Ownership: SMS 400k/750k/1.5M, CBT 200k/400k/700k, QBank 150k/250k/400k; bundle: 637.5k/1.19M/2.21M. ✅
- Support plan 20%/yr (ownership). 50/50 payment schedule. ✅ engine
- One-time: setup 50k, migration 30k, training 20k/session. Hosting 130k/260k/525k + domain 40k. ✅
- Discounts: early adopter 50% first term; upfront 10% (3 terms); cannot combine; never on
  hosting/domain/fees. ✅ engine (T1–T14 green, 28/28)
- Terms text shown verbatim incl. valid-until date. ✅
- ONE server-side pricing function; never trust browser prices. ✅ engine (client-safe module;
  platform must re-home it server-side)

## 3. Public pages
Home ✅, product pages ✅, pricing + calculator ✅, demo/quote form ✅ (DB+email pending
platform), downloads ✅ (marketing files only), FAQ/About/Contact ✅, legal drafts ✅,
floating WhatsApp ✅ (after owner supplies number), sticky mobile demo bar ✅.

## 4. Buying flow (platform)
Order statuses: quote_requested → quoted → awaiting_payment → part_paid → paid → delivered →
active → expired / cancelled; log every change. Ownership = 2 milestone payments (50/50);
licence + downloads unlock only on confirmed payment. Standard orders pay online; ownership
and custom quotes go quote → invoice → bank transfer.

## 5. Payments (platform)
Paystack primary, Flutterwave optional, manual bank transfer with proof upload. Server-created
transactions (kobo, unique refs), verify via API AND webhook, verify webhook signatures,
idempotent handlers, never store card data, .env.example, email receipts, manual refunds.

## 6. School portal (platform)
School accounts, password reset, dashboard: licences, keys, expiry, renewal dates, invoices/
receipts PDF, order history, private downloads, support requests. Strict per-school isolation.

## 7. Licences & protected downloads (platform)
Keys XXXX-XXXX-XXXX-XXXX (CSPRNG), termly (expiry + grace) and perpetual; admin issue/renew/
suspend/revoke. Signed offline licence files (private key server-only). Private installer
storage + 15-minute signed links, download logging, changelogs. Public downloads = marketing
files only. ✅ (rule already respected by static site)

## 8. PDFs (platform)
Quote/invoice/receipt PDFs, numbering QUO/INV/RCT-YYYY-NNNN, Naira font, logo, bank details;
admin-updatable price-list PDF with version + valid-until. ✅ (static site ships the official
price-list PDF manually)

## 9. Admin dashboard (platform)
Edit prices/tiers/discounts/coupons/hosting/rate/terms/FAQ/content/testimonials/valid-until
without code; leads/CRM, schools, quotes, invoices, orders, payments, licences, downloads,
tickets; renewals tracker (provider, date, USD cost, rate, NGN; reminders 30/14/7 days);
reports (revenue by month/term/product, outstanding invoices, renewals, leads); roles + 2FA
for owner; audit log; CSV export.

## 10. Emails (platform)
Demo received, quote, invoice, payment, licence, renewals, overdue, reset. WhatsApp = click-to-
chat only in v1. ✅ (site links)

## 11. Design (done on site ✅)
Hero benefit headline, trust strip (real numbers or "Now onboarding pilot schools" ✅),
benefit cards, product cards, how-it-works, before/after, demo video ✅ (CBT video), try-live-
demo (future: hosted CBT demo), pricing preview ✅, worry-answers ✅ (FAQ), final CTA ✅.
Mobile-first, sticky bottom bar ✅, 44px targets ✅, Lighthouse ≥90, WebP, reduced-motion ✅.

## 12. Ero assistant (platform; Phase 1 scripted version could ship earlier)
Robot-teacher mascot (grad cap, tablet, pencil, chest screen), always says it is an AI.
Page-aware greetings (admin-editable), confusion signals (idle 20–30s, bounce, fast scroll,
dead clicks, repeated pricing visits, form abandon, exit intent), politeness rules (max 1
proactive popup/visit, ≥60s between prompts, never over forms/payments, 7-day dismissal
memory, obvious close, no sound by default), quick-reply buttons, can navigate/pre-fill forms
with consent, reactions (form success → celebrate; payment fail → calm help + bank transfer;
download → thanks; exit → wave), chat button always available. v1.1 adds: classroom chalkboard
chat panel (chalk-writing replies, "Ero is writing…" animation, paper-note user messages,
history for the visit, clear button) + sound cues (soft double-knock on appear/open, chalk
sound only while writing; no audio before first interaction, speaker mute toggle remembered,
visual twin for every cue). AI brain server-side (LLM key never in browser), answers only from
approved KB, prices ONLY via pricing engine, refuses injection/free-licence/price-change
attempts, lead capture with consent + storage notice, monthly AI budget cap + per-session
limits + scripted fallback. Test cases E1–E15 (E13–E15 = sound rules).

## 13. SEO/analytics ✅ (titles/descriptions/sitemap/robots/JSON-LD/OG; GA now consent-gated ✅)

## 14. Security (platform)
HTTPS, secure cookies, hashed passwords, CSRF, validation, rate limiting, safe uploads, no
secrets in code, no student/exam data on the sales site, NDPA-aligned draft policies ✅
(shipped as DRAFT), daily off-server backups + tested restore.

## 15. Stack (platform, recommended)
Django + PostgreSQL, server-rendered + Tailwind + minimal JS, custom dashboard (Django admin
as base only), PDF lib with custom fonts, background jobs, Nginx/Gunicorn/small VPS, pinned
deps, .env.example, seed data, README (run/deploy/backup/restore/change prices/add product),
third-party account checklist.

## 16. Phases
P1 launch (public pages, engine+calculator, forms, WhatsApp, price PDF, admin for content,
legal drafts, SEO, scripted Ero) — static site now covers most of P1's public surface.
P2 selling (portal, PDFs, Paystack + transfer, orders, licences, protected downloads, AI Ero).
P3 operations (renewals, reports, coupons, tickets, backups, CSV, audit, Ero analytics).

## 17. Pricing tests T1–T15 — ✅ T1–T14 implemented and green (28/28). T15 = admin-edit flow
(platform; the static engine's single-source-of-truth test stands in).

## 18–19. Quality protocol & owner-supplied items (never fake)
Business details, logo, colours, testimonials, bank details, Paystack/Flutterwave keys, email
account, domain/server, lawyer-approved legal text — placeholders only until the owner
supplies them.
