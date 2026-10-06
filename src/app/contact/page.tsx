import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LeadForm } from "@/components/LeadForm";
import { CallbackForm } from "@/components/CallbackForm";
import { Icon } from "@/components/Icon";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { whatsappMessages } from "@/lib/whatsapp";
import { contactEmail, contactPhone, whatsappNumber } from "@/lib/env";

export const metadata: Metadata = buildMetadata({
  title: "Contact Us",
  description:
    "Contact SkulSuite — reach us on WhatsApp, email or phone, or send a message and we'll get back to you quickly.",
  path: "/contact",
});

export default function ContactPage() {
  const hasAny =
    Boolean(whatsappNumber) || Boolean(contactEmail) || Boolean(contactPhone);

  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <LeadForm
            title="Send us a message"
            description="Tell us what you need — a demo, pricing details or a question about any product."
            submitLabel="Send Message"
          />
        </div>

        <aside className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="font-bold text-slate-900">Reach us directly</h2>
            <ul className="mt-4 space-y-3">
              {whatsappNumber ? (
                <li>
                  <WhatsAppButton
                    message={whatsappMessages.general}
                    label="Chat on WhatsApp"
                    variant="primary"
                    className="w-full"
                  />
                </li>
              ) : null}
              {contactEmail ? (
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 hover:border-brand-300"
                  >
                    <Icon name="mail" className="h-4 w-4 text-brand-600" />
                    {contactEmail}
                  </a>
                </li>
              ) : null}
              {contactPhone ? (
                <li>
                  <a
                    href={`tel:${contactPhone}`}
                    className="flex items-center gap-2.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 hover:border-brand-300"
                  >
                    <Icon name="phone" className="h-4 w-4 text-brand-600" />
                    {contactPhone}
                  </a>
                </li>
              ) : null}
              {!hasAny ? (
                <li className="rounded-lg border border-dashed border-slate-300 bg-white px-3.5 py-3 text-sm text-slate-500">
                  Direct contact details are being set up. Use the form and
                  we&apos;ll get back to you.
                </li>
              ) : null}
            </ul>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-bold text-slate-900">Response time</h2>
            <p className="mt-2 text-sm text-slate-600">
              We typically reply within one working day. For the fastest
              response, message us on WhatsApp.
            </p>
          </div>
        </aside>
      </div>

      {/* Build prompt v5 §4: short "call me back" form — name + phone only */}
      <div className="mx-auto mt-10 max-w-3xl">
        <CallbackForm />
      </div>
    </section>
  );
}
