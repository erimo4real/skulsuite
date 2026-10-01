"use client";

import { useMemo, useState } from "react";
import { termlyPrices, ownershipPrices, naira } from "@/data/pricing-table";
import {
  calculateQuote,
  type PricingTables,
  type ProductKey,
  type PurchaseOption,
  type SchoolSize,
} from "@/lib/pricing-engine";
import { ButtonLink } from "./Button";
import { Icon } from "./Icon";

/**
 * Interactive price calculator (build prompt §3).
 * Every calculation goes through the shared pricing engine — the UI never
 * does its own arithmetic. Hosting/domain values arrive as props because
 * they come from the daily price job via server code.
 */

const rowMap = (rows: { key: string; amounts: [number, number, number] }[]) =>
  Object.fromEntries(rows.map((r) => [r.key, r.amounts])) as Record<
    ProductKey | "bundle",
    [number, number, number]
  >;

const PRODUCT_OPTIONS: { key: ProductKey; label: string }[] = [
  { key: "sms", label: "School Management System" },
  { key: "cbt", label: "CBT (Computer-Based Testing)" },
  { key: "qbank", label: "Question Bank" },
];

const SIZE_OPTIONS: { value: string; label: string }[] = [
  { value: "small", label: "Small (up to 99 students)" },
  { value: "medium", label: "Medium (100–299 students)" },
  { value: "large", label: "Large (300–600 students)" },
  { value: "custom", label: "Over 600 students (custom quote)" },
];

const selectClass =
  "w-full appearance-none rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30";

const checkClass =
  "h-[18px] w-[18px] rounded border-slate-300 text-brand-600 focus:ring-brand-500/30";

function sizeFromStudents(students: number): SchoolSize | "custom" | null {
  if (!Number.isFinite(students) || students <= 0) return null;
  if (students <= 99) return "small";
  if (students <= 299) return "medium";
  if (students <= 600) return "large";
  return "custom";
}

export function PriceCalculator({
  hosting,
  domain,
}: {
  hosting: Record<SchoolSize, number>;
  domain: number;
}) {
  const [students, setStudents] = useState("150");
  const [option, setOption] = useState<PurchaseOption>("termly");
  const [products, setProducts] = useState<Set<ProductKey>>(new Set(["sms"]));
  const [online, setOnline] = useState(false);
  const [setup, setSetup] = useState(false);
  const [migration, setMigration] = useState(false);
  const [trainingSessions, setTrainingSessions] = useState("0");
  const [earlyAdopter, setEarlyAdopter] = useState(false);
  const [upfront, setUpfront] = useState(false);
  const [supportPlan, setSupportPlan] = useState(false);

  const tables: PricingTables = useMemo(
    () => ({
      termly: rowMap(termlyPrices),
      ownership: rowMap(ownershipPrices),
      hosting,
      domain,
      fees: { setup: 50000, migration: 30000, trainingPerSession: 20000 },
    }),
    [hosting, domain],
  );

  const studentCount = Number.parseInt(students, 10);
  const size = sizeFromStudents(studentCount);
  const training = Math.max(0, Math.min(10, Math.round(Number(trainingSessions) || 0)));

  const result = useMemo(() => {
    if (size === null || size === "custom") return null;
    return calculateQuote({
      students: studentCount,
      option,
      products: Array.from(products),
      online,
      extras: { setup, migration, trainingSessions: training },
      discounts: { earlyAdopter, upfront },
      supportPlan,
      tables,
    });
  }, [
    size,
    studentCount,
    option,
    products,
    online,
    setup,
    migration,
    training,
    earlyAdopter,
    upfront,
    supportPlan,
    tables,
  ]);

  const toggleProduct = (key: ProductKey) => {
    setProducts((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      return next;
    });
  };

  const demoHref = "/demo";

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
        <h2 className="text-lg font-bold text-slate-900">Price calculator</h2>
        <p className="mt-1 text-sm text-slate-600">
          Choose your school&apos;s size and the products you want — the total updates as you
          go. What you see here is what we quote.
        </p>
      </div>

      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.2fr_1fr]">
        {/* ── Controls ── */}
        <div className="space-y-6">
          <div>
            <label htmlFor="calc-students" className="block text-sm font-semibold text-slate-900">
              Number of students
            </label>
            <input
              id="calc-students"
              type="number"
              min={1}
              inputMode="numeric"
              value={students}
              onChange={(e) => setStudents(e.target.value)}
              placeholder="e.g. 240"
              className="mt-2 w-full rounded-lg border border-slate-300 px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
            />
            <div className="mt-2">
              <label htmlFor="calc-size-hint" className="sr-only">
                Size tier for this student count
              </label>
              <select
                id="calc-size-hint"
                value={size ?? ""}
                onChange={(e) => {
                  const v = e.target.value;
                  if (v === "custom") {
                    setStudents("601");
                  } else if (v === "small") {
                    setStudents("90");
                  } else if (v === "medium") {
                    setStudents("200");
                  } else {
                    setStudents("400");
                  }
                }}
                className={selectClass}
              >
                {size === null ? <option value="">Enter a student number</option> : null}
                {SIZE_OPTIONS.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-900">Products</legend>
            <div className="mt-2 space-y-2">
              {PRODUCT_OPTIONS.map((p) => (
                <label
                  key={p.key}
                  className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm hover:border-brand-300"
                >
                  <input
                    type="checkbox"
                    checked={products.has(p.key)}
                    onChange={() => toggleProduct(p.key)}
                    className={checkClass}
                  />
                  <span className="text-slate-700">{p.label}</span>
                </label>
              ))}
            </div>
            <p className="mt-2 text-xs text-slate-500">
              Pick all three to get the 15% bundle discount (already in the bundle price).
            </p>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-900">How do you want to buy?</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {(
                [
                  { value: "termly", label: "Termly licence", hint: "Pay per term" },
                  { value: "ownership", label: "Own the app", hint: "One-time purchase" },
                ] as const
              ).map((o) => (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => {
                    setOption(o.value);
                    if (o.value === "ownership") {
                      setEarlyAdopter(false);
                      setUpfront(false);
                    }
                  }}
                  aria-pressed={option === o.value}
                  className={`min-h-[44px] rounded-lg border px-3.5 py-2.5 text-left text-sm transition-colors ${
                    option === o.value
                      ? "border-brand-500 bg-brand-50 text-brand-800"
                      : "border-slate-200 text-slate-700 hover:border-brand-300"
                  }`}
                >
                  <span className="block font-semibold">{o.label}</span>
                  <span className="block text-xs text-slate-500">{o.hint}</span>
                </button>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="text-sm font-semibold text-slate-900">Extras</legend>
            <div className="mt-2 space-y-2">
              <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm hover:border-brand-300">
                <input
                  type="checkbox"
                  checked={online}
                  onChange={(e) => setOnline(e.target.checked)}
                  className={checkClass}
                />
                <span className="text-slate-700">
                  Online version (adds yearly cloud hosting and domain)
                </span>
              </label>
              <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm hover:border-brand-300">
                <input
                  type="checkbox"
                  checked={setup}
                  onChange={(e) => setSetup(e.target.checked)}
                  className={checkClass}
                />
                <span className="text-slate-700">Setup and offline installation (₦50,000)</span>
              </label>
              <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm hover:border-brand-300">
                <input
                  type="checkbox"
                  checked={migration}
                  onChange={(e) => setMigration(e.target.checked)}
                  className={checkClass}
                />
                <span className="text-slate-700">Student records data migration (₦30,000)</span>
              </label>
              <div className="flex min-h-[44px] items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm">
                <label htmlFor="calc-training" className="text-slate-700">
                  Staff training sessions (₦20,000 each)
                </label>
                <input
                  id="calc-training"
                  type="number"
                  min={0}
                  max={10}
                  value={trainingSessions}
                  onChange={(e) => setTrainingSessions(e.target.value)}
                  className="ml-auto w-20 rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/30"
                />
              </div>
            </div>
          </fieldset>

          {option === "termly" ? (
            <fieldset>
              <legend className="text-sm font-semibold text-slate-900">Discounts (optional)</legend>
              <div className="mt-2 space-y-2">
                <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm hover:border-brand-300">
                  <input
                    type="checkbox"
                    checked={earlyAdopter}
                    onChange={(e) => setEarlyAdopter(e.target.checked)}
                    className={checkClass}
                  />
                  <span className="text-slate-700">Early adopter — 50% off the first term</span>
                </label>
                <label className="flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm hover:border-brand-300">
                  <input
                    type="checkbox"
                    checked={upfront}
                    onChange={(e) => setUpfront(e.target.checked)}
                    className={checkClass}
                  />
                  <span className="text-slate-700">
                    Pay all three terms upfront — 10% off the yearly licence
                  </span>
                </label>
              </div>
              <p className="mt-2 text-xs text-slate-500">
                These two discounts cannot be combined, and neither applies to hosting, domain
                or one-time fees.
              </p>
            </fieldset>
          ) : (
            <fieldset>
              <legend className="text-sm font-semibold text-slate-900">Support plan (optional)</legend>
              <label className="mt-2 flex min-h-[44px] cursor-pointer items-center gap-3 rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm hover:border-brand-300">
                <input
                  type="checkbox"
                  checked={supportPlan}
                  onChange={(e) => setSupportPlan(e.target.checked)}
                  className={checkClass}
                />
                <span className="text-slate-700">
                  Yearly support and updates plan (20% of the purchase price per year)
                </span>
              </label>
            </fieldset>
          )}
        </div>

        {/* ── Summary ── */}
        <div aria-live="polite">
          <div className="rounded-xl border border-brand-100 bg-brand-50/60 p-5">
            <h3 className="text-sm font-bold uppercase tracking-wide text-brand-800">
              Your quote
            </h3>

            {size === null ? (
              <p className="mt-3 text-sm text-slate-600">
                Enter your number of students to see a price.
              </p>
            ) : size === "custom" ? (
              <div className="mt-3">
                <p className="text-sm font-semibold text-slate-900">
                  Over 600 students = custom quote
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  Bigger schools get a package put together just for them — no online price.
                </p>
                <ButtonLink href={demoHref} className="mt-4 w-full">
                  Request a quote
                </ButtonLink>
              </div>
            ) : result?.error ? (
              <p className="mt-3 text-sm font-medium text-red-700">{result.error}</p>
            ) : result ? (
              <>
                <ul className="mt-3 space-y-2 text-sm">
                  {result.lines.map((line) => (
                    <li key={line.label} className="flex items-start justify-between gap-3">
                      <span className="text-slate-700">
                        {line.label}
                        {line.note ? (
                          <span className="block text-xs text-slate-500">{line.note}</span>
                        ) : null}
                      </span>
                      <span
                        className={`shrink-0 font-semibold tabular-nums ${
                          line.amount < 0 ? "text-green-700" : "text-slate-900"
                        }`}
                      >
                        {line.amount < 0 ? `− ${naira(-line.amount)}` : naira(line.amount)}
                      </span>
                    </li>
                  ))}
                </ul>

                <div className="mt-4 border-t border-brand-200/70 pt-3">
                  <div className="flex items-end justify-between gap-3">
                    <span className="text-sm font-bold text-slate-900">Total</span>
                    <span className="text-2xl font-extrabold tabular-nums text-brand-800">
                      {naira(result.total ?? 0)}
                    </span>
                  </div>
                  <p className="mt-1 text-right text-xs text-slate-500">
                    for {result.totalCovers}
                    {result.discountAmount > 0 ? " · discount applied" : ""}
                  </p>
                </div>

                {result.warnings.map((w) => (
                  <p
                    key={w}
                    className="mt-3 rounded-lg bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800"
                  >
                    {w}
                  </p>
                ))}

                <ButtonLink href={demoHref} className="mt-4 w-full">
                  Request a demo with this quote
                </ButtonLink>
                <p className="mt-2 text-center text-xs text-slate-500">
                  We confirm every quote before anything is installed.
                </p>
              </>
            ) : null}
          </div>

          <p className="mt-3 flex items-start gap-2 text-xs text-slate-500">
            <Icon name="check" className="mt-0.5 h-3.5 w-3.5 shrink-0 text-brand-600" strokeWidth={2.5} />
            Prices come straight from our official price list — no hidden charges. Taxes extra
            where applicable.
          </p>
        </div>
      </div>
    </div>
  );
}
