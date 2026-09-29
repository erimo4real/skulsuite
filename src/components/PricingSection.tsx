import Link from "next/link";
import { pricing } from "@/data/pricing";
import { SectionHeader } from "./SectionHeader";
import { ButtonLink } from "./Button";
import { Icon } from "./Icon";
import { accentChipClass } from "./accent";

export function PricingSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
      <SectionHeader
        eyebrow="Pricing"
        title="Simple plans for every school"
        description="Every product starts with a demo, and pricing is confirmed for your school's size — no surprises, no invented packages."
      />

      <div className="mt-10 grid gap-6 md:grid-cols-3">
        {pricing.map((product) => (
          <div
            key={product.productId}
            className="flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
          >
            <span
              className={`inline-flex self-start rounded-full px-2.5 py-0.5 text-xs font-semibold ${accentChipClass(
                product.productId === "cbt"
                  ? "brand"
                  : product.productId === "question-bank"
                    ? "violet"
                    : "emerald",
              )}`}
            >
              {product.productName}
            </span>
            <p className="mt-4 text-lg font-bold text-slate-900">
              {product.plans[0]?.price ?? "Contact us for pricing"}
            </p>
            <p className="mt-2 flex-1 text-sm text-slate-600">{product.blurb}</p>
            <Link
              href="/pricing"
              className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700 hover:text-brand-800"
            >
              View plans
              <Icon name="arrow-right" className="h-4 w-4" />
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <ButtonLink href="/pricing" variant="outline" size="lg">
          See full pricing
        </ButtonLink>
      </div>
    </section>
  );
}
