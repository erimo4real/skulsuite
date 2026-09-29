# LEAD CAPTURE SETUP — SkulSuite

Two things make the demo funnel live: a form endpoint (leads reach you) and a
WhatsApp number (instant contact everywhere on the site). Both take ~5 minutes.

---

## 1. Connect a form endpoint (Formspree)

The demo + contact forms POST JSON to `NEXT_PUBLIC_FORM_ENDPOINT`. If it's
empty, submissions fall back to the WhatsApp handoff — so this step is what
gives you a real inbox of leads.

### Steps

1. Create a free account at <https://formspree.io> (free tier: 50 submissions/month).
2. Click **New form** → name it e.g. "SkulSuite Leads" → copy your endpoint:
   `https://formspree.io/f/xxxxxxxx`
3. Add it to `.env.local` in this project:

   ```bash
   NEXT_PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx
   ```

4. Restart the dev server / rebuild — the form now sends real submissions.
5. Formspree emails you every submission **and** shows them in a dashboard.
6. (Recommended) In Formspree's settings, turn on reCAPTCHA spam protection.

> The form already sends the `Accept: application/json` header Formspree's
> AJAX endpoint requires, and posts fields named `name`, `school`, `phone`,
> `email`, `role`, `product`, `students`, `message`, `source` — they'll appear
> in Formspree exactly like that.

### Alternatives

- **Getform / Basin / Web3Forms** — same idea; any endpoint that accepts a
  JSON POST works. Update `.env.local` only.
- **Your own endpoint later** — when the ERP or another backend can receive
  leads, point the same variable at it. No component changes needed.

### Test it

1. `npm run dev` → open `/demo`
2. Fill and submit the form
3. Check your Formspree dashboard / email for the lead.

---

## 2. Configure the WhatsApp number

Every WhatsApp button builds a `wa.me` deep link with a pre-filled, contextual
message (general on the navbar/footer/pricing; product-specific on product
pages). The number comes from env — buttons **hide automatically** until it's
set.

1. Use a WhatsApp-enabled number you control (the one sales should answer).
2. Convert to international format, digits only — e.g. Nigerian `0801 234 5678`
   becomes `2348012345678`.
3. Add to `.env.local`:

   ```bash
   NEXT_PUBLIC_WHATSAPP_NUMBER=2348012345678
   ```

4. Restart/rebuild. WhatsApp buttons appear in the navbar, hero, product pages,
   pricing, demo, contact and footer.

### Where messages come from

Pre-filled text lives in `src/lib/whatsapp.ts` (`whatsappMessages`). Edit them
any time — e.g. to add "via the website" or working hours.

> ⚠️ The number is public (it's in a link a visitor clicks). Don't use a
> personal number you don't want customers messaging.

---

## 3. Other env values to set before launch

| Variable | Why |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Your live domain — makes canonical URLs + sitemap correct |
| `NEXT_PUBLIC_CONTACT_EMAIL` / `NEXT_PUBLIC_CONTACT_PHONE` | Shown on `/contact` and footer |
| `NEXT_PUBLIC_GA_ID` | Analytics events (page_view, demo_submit, whatsapp_click…) |
| `NEXT_PUBLIC_SHOW_VERIFICATION_FLAGS` | Keep `false` — audit is complete, claims are verified |

After setting values: `npm run build` and redeploy (static export in `out/`).
