import type { Metadata } from "next";
import { pricing, customPackageNote } from "@/data/pricing";
import { buildMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/SectionHeader";
import { PricingCard } from "@/components/PricingCard";
import { CtaBanner } from "@/components/CtaBanner";
import { ButtonLink } from "@/components/Button";
import { ViewTracker } from "@/components/ViewTracker";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description:
    "SkulSuite pricing for the CBT Examination System, Question Bank and School Management System. Plans for every school size — request a demo for a tailored package.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <>
      <ViewTracker event="pricing_view" />

      <section className="mx-auto max-w-6xl px-4 pb-8 pt-14 sm:px-6 sm:pt-20">
        <SectionHeader
          eyebrow="Pricing"
          title="Plans sized to your school"
          description="We don't publish fixed prices because every school is different — number of students, staff and products all matter. Request a demo and we'll put together the right package, clearly confirmed before anything is installed."
        />
      </section>

      {pricing.map((product) => (
        <section
          key={product.productId}
          className="mx-auto max-w-6xl px-4 py-10 sm:px-6"
          aria-labelledby={`pricing-${product.productId}`}
        >
          <div className="mb-6 max-w-2xl">
            <h2
              id={`pricing-${product.productId}`}
              className="text-2xl font-bold tracking-tight text-slate-900"
            >
              {product.productName}
            </h2>
            <p className="mt-2 text-slate-600">{product.blurb}</p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {product.plans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>
        </section>
      ))}

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8 text-center">
          <h2 className="text-xl font-bold text-slate-900">
            {customPackageNote.title}
          </h2>
          <p className="mx-auto mt-2 max-w-xl text-slate-600">
            {customPackageNote.description}
          </p>
          <ButtonLink href={customPackageNote.ctaHref} variant="outline" className="mt-5">
            {customPackageNote.cta}
          </ButtonLink>
        </div>
      </section>

      <div className="pb-16 pt-4">
        <CtaBanner
          title="See the products before you decide"
          description="A demo is the fastest way to see what your school gets — and what it costs."
        />
      </div>
    </>
  );
}
