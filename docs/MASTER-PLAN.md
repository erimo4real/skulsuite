# SkulSuite — Master Plan

_Last updated: 29 Sep 2026. This file records every agreed decision so any future
session (or the owner) can pick up exactly where we left off. It is the source of
truth for what to build next and why._

---

## 1. What this site is

A static Next.js 15 marketing website (`output: "export"`) for three school software
products — CBT Examination System, Question Bank, School Management System — plus a
growing resources/downloads area. All marketing claims are audit-verified against the
real products (`docs/PRODUCT-AUDIT.md`); nothing invented, no fake testimonials/stats.

## 2. The real assets behind the products (discovered & inspected)

| Product | Real assets found |
|---|---|
| Question Bank | **QBank desktop app** (portable Windows, offline, Python-based, 171MB with `_internal/`), CSV question import, PDF paper export, AI assistant (Groq/OpenAI or fully local), demo video `brag.mp4` (7.5MB, 1080p) + poster `brag.jpg` + voiceover script, 2 decks generated with python-pptx (28-slide walkthrough + 9-slide AI deck, dark theme `#0D0D0D` / accent `#10A37F`), 14-section user guide (default login `admin@qbank.com` / `admin123`) |
| CBT | **Standalone Django 6 + React 19 platform** (`Documents/projects/cbt`): courses, exams with instant scoring, certificates, practice mode, exam PINs/OTP, analytics, AI features, 3D exam UI, 59/59 tests green, render.yaml. Has **no video and no deck yet**. |
| School Management | The Next.js ERP (QA + screenshot pipeline exists; production-mode orchestrator hardened). |

## 3. Agreed decisions (chronological)

1. **QBank demo video** → self-hosted MP4 on the site (poster + click-to-play), Question Bank page.
2. **PowerPoint decks** → published as PDF (primary) + original PPTX (secondary). Owner converts PDFs in PowerPoint for best fidelity.
3. **Sample download** → "Trial Kit": sample questions CSV (uses QBank's real CSV import) + 15-minute try-it guide + one-page overview. Safe, no source exposure.
4. **Lead capture** → email-gated downloads via Formspree (light gate; reversible).
5. **QBank desktop download** → shown as its own clearly-labeled "QBank Desktop — free offline edition" card (Option A), not blended into the suite description.
6. **CBT platform** → no re-audit, no feature copy changes. Show **demo video + presentation only** (owner's explicit choice). Video: I record it (browser recorder) after running the app locally — owner approved running it for this. Deck: I generate it with python-pptx in the QBank dark theme from code-verified features only.
7. **CBT page** → ship now with placeholder video/deck cards ("coming soon") wired like QBank's, so files go live the moment they exist.
8. **Pricing** → real price list received (`Documents/School_Software_Price_List_FINAL.pdf`, valid until 29 Oct 2026). Decision: **full static pricing page** + "from ₦X/term" hints on product pages + price list PDF as a download. Numbers typed in exactly from the PDF — never invented.
9. **Big Build-Prompt platform** (`Website_Build_Prompt.pdf`: payments, licences, admin, quote/invoice PDFs — Django recommended) → **separate future project**, not merged into this brochure. Excellent spec; revisit after current queue.
10. **Live price tracking** → licence prices stay fixed; hosting/domain line tracks reality: daily USD→NGN fetch, recompute hosting tiers with the PDF's own formula (USD × planning rate, rounded to nearest ₦5,000), auto-update site + visible note ("Updated {date} — dollar up X% since 29 Sep"). Provider USD prices: manual file, reviewed ~quarterly. Change detection → fully automatic rebuild (owner approved auto; revisit if >10% jumps should need approval).
11. **Hosting** → **Netlify** (owner has GitHub; picked Netlify for free deploy hooks + free form handling which can replace Formspree). Daily job runs on **GitHub Actions** (free, runs while PC is off): fetch rate → recompute → update data → rebuild → call Netlify deploy hook.
12. **Honesty rules** → unchanged: never invent features/stats/testimonials; prices only from the real price list; placeholders clearly marked as coming soon.

## 4. Build queue (approved, in order)

1. **CBT deck** — `CBT-Presentation.pptx`, ~10 slides, QBank dark theme, verified features only. Owner reviews in PowerPoint.
2. **Website batch** (one build):
   - Pricing page (both options, 3 tiers, bundle discount, hosting table, discounts, terms, valid-until date)
   - "From ₦X per term" hints on the 3 product pages
   - `/resources` page + download cards (price list PDF first real download; slots for decks, Trial Kit, CBT deck)
   - QBank video section (click-to-play, `public/` video + poster copied from Desktop QBank folder)
   - CBT placeholder video/deck sections
   - lint → typecheck → build → restart 4321 preview for owner review
3. **CBT demo video** — run CBT app locally (green-lit), rehearse, record 60–90s take, shut down, wire into CBT page, rebuild.
4. **Trial Kit** — CSV (matching QBank's real import format) + 15-min guide; owner approves content.
5. **Deployment** — GitHub repo + Netlify site + deploy hook; move lead capture to Netlify Forms (drop Formspree if so).
6. **Daily price job** — GitHub Actions workflow + rate API + recompute script + commit/hook pipeline.
7. **Later:** Django sales platform (Build Prompt project), QBank installer (NSIS script exists in QBank repo), hosted live demos.

## 5. Daily price-check design (for step 6)

- Data: `src/data/pricing.ts` (fixed licence prices) + `src/data/hosting-usd.json` (provider USD prices, manual review).
- Script (Node): fetch USD→NGN from a free API (primary + fallback sources), compute tiers = USD × planning rate, round to ₦5,000, compare to current, write `src/data/hosting-live.json` + `updated` note fields, exit nonzero to skip deploy when nothing changed.
- Note format on site: "Hosting prices updated {date} — the dollar is up/down X% since prices were set (29 Sep 2026)."
- Workflow: cron ~06:00 UTC → script → if data changed: commit → build → Netlify deploy hook.
- Terms from the PDF stay on the page verbatim (valid-until date included).

## 6. Open items / small notes

- Owner to supply: PDF conversions of the 2 QBank decks (owner prefers converting in PowerPoint).
- Price list "valid until 29 Oct 2026" needs a human bump when it expires.
- ERP QA run still pending owner execution (`node scripts/orchestrate-qa.mjs` — see ERP `web/` docs); screenshots feed the site galleries.
- Launch checklist items remain: WhatsApp number, email/phone, Formspree (or Netlify Forms) endpoint, `.env.local`.
