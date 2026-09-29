import type { ProductFeature } from "@/data/product-types";
import { Icon } from "./Icon";
import { VerificationBadge } from "./VerificationBadge";

const iconStyles = {
  brand: "bg-brand-50 text-brand-600",
  violet: "bg-violet-50 text-violet-600",
  emerald: "bg-emerald-50 text-emerald-600",
} as const;

export type FeatureAccent = keyof typeof iconStyles;

export function FeatureCard({
  feature,
  accent = "brand",
}: {
  feature: ProductFeature;
  accent?: FeatureAccent;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="flex items-center justify-between gap-2">
        <span
          className={`inline-flex h-9 w-9 items-center justify-center rounded-lg ${iconStyles[accent]}`}
        >
          <Icon name="check" className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <VerificationBadge />
      </div>
      <h3 className="mt-3 font-semibold text-slate-900">{feature.title}</h3>
      <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
        {feature.description}
      </p>
    </div>
  );
}
