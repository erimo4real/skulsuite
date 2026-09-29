import Link from "next/link";
import type { PricingPlan } from "@/data/pricing";
import { buttonClasses } from "./Button";
import { Icon } from "./Icon";

export function PricingCard({ plan }: { plan: PricingPlan }) {
  return (
    <div
      className={`flex flex-col rounded-2xl border p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg ${
        plan.highlighted
          ? "border-brand-600 ring-1 ring-brand-600"
          : "border-slate-200 bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-slate-900">{plan.name}</h3>
        {plan.highlighted ? (
          <span className="rounded-full bg-brand-50 px-2.5 py-0.5 text-xs font-semibold text-brand-700">
            Most popular
          </span>
        ) : null}
      </div>
      <p className="mt-2 text-xl font-bold leading-snug text-slate-900 sm:text-2xl">
        {plan.price}
      </p>
      <p className="mt-1 text-xs text-slate-500">{plan.priceNote}</p>
      <p className="mt-3 text-sm text-slate-600">{plan.description}</p>

      <ul className="mt-4 flex-1 space-y-2.5">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2 text-sm text-slate-700">
            <Icon
              name="check"
              className="mt-0.5 h-4 w-4 shrink-0 text-brand-600"
              strokeWidth={2.5}
            />
            {feature}
          </li>
        ))}
      </ul>

      <Link
        href={plan.demoHref}
        className={`${buttonClasses("primary")} mt-6 w-full`}
      >
        {plan.highlighted ? "Request a Demo" : "Get started"}
      </Link>
    </div>
  );
}
