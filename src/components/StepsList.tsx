import type { ProductStep } from "@/data/product-types";

/**
 * Numbered steps grid. Column count adapts to the number of steps so the
 * last row is never left with a single orphan card (5 steps → 5 columns).
 * Class names are static strings so Tailwind's purge keeps them.
 */
export function StepsList({ steps }: { steps: readonly ProductStep[] }) {
  const cols =
    steps.length >= 5
      ? "sm:grid-cols-2 lg:grid-cols-5"
      : steps.length === 3
        ? "sm:grid-cols-3"
        : steps.length === 2
          ? "sm:grid-cols-2"
          : "sm:grid-cols-2 lg:grid-cols-4";

  return (
    <ol className={`grid gap-5 ${cols}`}>
      {steps.map((step, index) => (
        <li
          key={step.title}
          className="relative rounded-2xl border border-slate-200 bg-white p-5 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
        >
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
            {index + 1}
          </span>
          <h3 className="mt-3 font-semibold text-slate-900">{step.title}</h3>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
            {step.description}
          </p>
        </li>
      ))}
    </ol>
  );
}
