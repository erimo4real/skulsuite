import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { LeadForm } from "@/components/LeadForm";
import { Icon } from "@/components/Icon";
import { whatsappMessages } from "@/lib/whatsapp";
import { WhatsAppButton } from "@/components/WhatsAppButton";

export const metadata: Metadata = buildMetadata({
  title: "Request a Demo",
  description:
    "Request a personalized SkulSuite demo for your school: CBT Examination System, Question Bank and School Management System.",
  path: "/demo",
});

export default function DemoPage() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
      <div className="grid gap-12 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <LeadForm />
        </div>

        <aside className="lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h2 className="font-bold text-slate-900">Prefer to talk first?</h2>
            <p className="mt-2 text-sm text-slate-600">
              Send us a WhatsApp message and we&apos;ll respond quickly — no forms
              required.
            </p>
            <div className="mt-4">
              <WhatsAppButton
                message={whatsappMessages.general}
                label="Message us on WhatsApp"
                variant="primary"
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
            <h2 className="font-bold text-slate-900">What happens next</h2>
            <ol className="mt-4 space-y-4">
              {[
                "We receive your request and reach out to schedule a time.",
                "You get a walkthrough of the product(s) you chose.",
                "We answer questions and discuss setup, training and pricing.",
              ].map((step, index) => (
                <li key={step} className="flex items-start gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                    {index + 1}
                  </span>
                  <span className="text-sm text-slate-700">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-6 flex items-start gap-3 rounded-2xl border border-brand-100 bg-brand-50 p-5 text-sm text-brand-900">
            <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={2.5} />
            <p>
              Demos are tailored to your school&apos;s level and size — primary,
              secondary, or a group of schools.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
