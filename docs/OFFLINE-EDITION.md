# Offline Edition — Requirements & Planning (Decision #11)

_Created October 2026 after the owner asked: "what if the school doesn't want
online and wants to run it offline?" Discussion happened in chat; nothing was
coded against the products. This file is the planning record and the source
for the visitor-facing `/offline` page._

Owner's choice: **the hybrid model (Option B)** — offline day-to-day, monthly
hotspot sync. Recorded in `docs/MASTER-PLAN.md` §7 as decision #11.

---

## 1. The two models that were considered

| | Option A — Fully offline | Option B — Hybrid (CHOSEN) |
|---|---|---|
| Day-to-day use | School LAN only, no internet ever | School LAN only, no internet needed |
| Updates & licence checks | Flash drive or support visit | Monthly phone-hotspot session (~10 min) |
| Backups | Local external drive only | External drive **+** monthly off-site copy |
| Parent portal / remote results | Not available | Available during sync windows (future) |
| Visibility for SkulSuite support | None between visits | Sync session reports usage/health |
| Piracy / licence risk | Highest — no check-in possible | Controlled — monthly licence check |
| Fits future Django platform | Poorly | Naturally ("portable edition") |

Why B won: it keeps licence income protected, keeps a support channel, keeps
the future portal path open, and matches how most Nigerian school software
survives in practice. Power — not internet — is the bigger offline risk, so
the UPS requirement is non-negotiable in sales conversations.

## 2. What works offline vs what needs internet

**Offline-friendly (green):**
- CBT exams — the ideal offline workload. Exam computers/phones talk to the
  school server over the school's own router/switch (same as JAMB centres).
- Question Bank — stored locally, practised forever.
- Records, attendance, results, printable report cards.

**Needs internet (red):**
- Parents viewing results from home (portal).
- Payments / fee reconciliation beyond local records.
- SMS/WhatsApp result slips to parents.
- Software updates, fixes, licence checks.
- Remote support sessions.

## 3. Requirements checklist for a school (sales & install doc)

1. **One server PC** — a dedicated normal desktop (e.g. Core i5, 8GB RAM, SSD
   is plenty). Nothing exotic; it does not need to be new.
2. **Network gear** — the school's existing Wi-Fi router or a switch + cables.
   No internet subscription involved.
3. **Power backup** ⚡ — UPS/inverter on the server at minimum so an exam
   doesn't die at question 40. **Power is the bigger offline risk, not
   internet.**
4. **Licence key locked to the school's server** — offline is the highest
   piracy-risk mode, so the key must be machine-locked. (Platform work item —
   see §6.)
5. **One-click installer + auto-backup** — setup completable in one
   afternoon; daily backup to an external drive kept in the school office.
6. **Training + on-site setup** — a real cost line (the price list already has
   "Setup and offline installation (one school site) — ₦50,000" and "Staff
   training session — ₦20,000").
7. **Update plan** — monthly hotspot session (chosen), or flash-drive updates
   for schools that refuse even that.

## 4. Cost structure (price list only — no invented numbers)

| Line | Offline edition | Online edition |
|---|---|---|
| Software licence | Same as online (per size, termly or ownership) | Same |
| Setup & offline installation (one site) | ₦50,000 one-time | Included in online setup |
| Student records data migration | ₦30,000 one-time (if needed) | Same |
| Staff training session | ₦20,000 one-time | Same |
| Yearly cloud hosting | **None** | ₦130,000–₦525,000/yr by size |
| Domain name | **None** | ₦40,000/yr |
| Optional yearly support (ownership) | 20% of purchase price/yr | Same |

Pricing questions still open (owner to decide — NOT yet promised anywhere):
- Whether offline schools get a support retainer beyond the 20%/yr plan.
- Travel/transport costs for on-site setup outside the school's city.
- Whether the ₦50,000 setup fee covers multi-campus schools (currently
  "one school site" — a second campus is a new quote).

## 5. Visitor page

`/offline` (src/app/offline/page.tsx + src/data/offline.ts) explains:
- Side-by-side offline vs online comparison (8 rows).
- What the school needs (5 requirements, plain language).
- Cost structure table (price-list figures only).
- Offline FAQs (also fed to Ero's knowledge base via generate-ero-kb.mjs).
- Honest framing: which edition fits which school; start-offline-move-online
  path; report cards and in-school portal visits as the offline parent story.

## 6. Future platform impact (Django, BUILD-PROMPT-SPEC)

- "Portable edition" of the same products — one codebase, two deployment
  modes (cloud / school-server).
- Machine-locked offline licence keys (online activation once, then a signed
  offline token that the monthly sync refreshes).
- Sync protocol over the monthly hotspot window: backups out, updates +
  licence token in, usage/health report out.
- Ero-style assistant is an online-edition feature; offline schools get the
  built-in guides instead.

## 7. Open items

- [ ] Owner: decide pricing stance for travel/retainer (§4 open questions).
- [ ] Platform: licence-token design when Django work starts.
- [ ] Marketing: add "offline available" badge to product pages later if
      owner wants it (not done yet — keep page count changes deliberate).
