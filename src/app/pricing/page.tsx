import type { Metadata } from "next";
import Link from "next/link";
import {
  schoolSizes,
  termlyPrices,
  ownershipPrices,
  oneTimeFees,
  hostingTiers,
  discounts,
  pricingTerms,
  naira,
  TERMLY_NOTE,
  OWNERSHIP_NOTE,
  HOSTING_SERVER_NOTE,
} from "@/data/pricing-table";
import { priceSource } from "@/data/pricing";
import { getLiveHosting, hostingAmounts } from "@/lib/hosting-live";
import { buildMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/SectionHeader";
import { Icon } from "@/components/Icon";
import { CtaBanner } from "@/components/CtaBanner";
import { ViewTracker } from "@/components/ViewTracker";
import { PriceCalculator } from "@/components/PriceCalculator";
import { DollarRatePanel } from "@/components/DollarRatePanel";

export const metadata: Metadata = buildMetadata({
  title: "Pricing",
  description:
    "SkulSuite pricing: termly licences from ₦15,000/term, ownership from ₦150,000 once, or all three products bundled with 15% off. Hosting and one-time fees listed.",
  path: "/pricing",
});

// Hosting line tracks the USD rate via the daily job; licences never move.
const liveHosting = getLiveHosting();
const hostingAmountsFor: Record<string, number> = Object.fromEntries(
  hostingTiers.map((t) => [
    t.size,
    liveHosting?.tiers?.[t.size]?.hosting ?? t.hosting,
  ]),
);

function PriceTable({
  title,
  note,
  rows,
}: {
  title: string;
  note: string;
  rows: { name: string; amounts: [number, number, number]; note?: string }[];
}) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
        <h2 className="text-lg font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{note}</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
              <th className="px-6 py-3 font-semibold">Product</th>
              {schoolSizes.map((s) => (
                <th key={s.id} className="px-6 py-3 text-right font-semibold">
                  {s.label}
                  <span className="ml-1 font-normal normal-case">({s.range})</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
        {rows.map((row, i) => (
          <tr key={row.name} className={i % 2 === 1 ? "bg-slate-50/60" : ""}>
            <td className="px-6 py-3.5">
              <span className="font-medium text-slate-900">{row.name}</span>
              {row.note ? (
                <span className="ml-2 text-xs text-slate-500">{row.note}</span>
              ) : null}
            </td>
            {row.amounts.map((amount, j) => (
              <td key={j} className="px-6 py-3.5 text-right font-semibold text-slate-900">
                {naira(amount)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
        </table>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <>
      <ViewTracker event="pricing_view" />

      <section className="mx-auto max-w-6xl px-4 pb-8 pt-14 sm:px-6 sm:pt-20">
        <SectionHeader
          eyebrow="Pricing"
          title="Clear prices, sized to your school"
          description="Every price below comes straight from our official price list — what you see is what you'll be quoted. All three products, two ways to buy, and a 15% bundle discount."
        />
        <p className="mt-4 text-sm text-slate-500">
          {priceSource.version} · Valid until {priceSource.validUntil} ·{" "}
          <a
            href={priceSource.filePath}
            download
            className="font-semibold text-brand-700 underline hover:text-brand-800"
          >
            Download the official price list (PDF)
          </a>
        </p>
      </section>

      {/* ── Interactive calculator (engine-backed, build prompt §3) ── */}
      <section className="mx-auto max-w-6xl px-4 pb-10 sm:px-6">
        <PriceCalculator hosting={hostingAmounts()} domain={hostingTiers[0].domain} />
      </section>

      {/* ── Option A: termly ── */}
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <PriceTable
          title="Option A — Termly licence (pay per term)"
          note={TERMLY_NOTE}
          rows={termlyPrices}
        />
      </section>

      {/* ── Option B: ownership ── */}
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <PriceTable
          title="Option B — Own the app (one-time purchase)"
          note={OWNERSHIP_NOTE}
          rows={ownershipPrices}
        />
      </section>

      {/* ── One-time fees ── */}
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">One-time fees (both options)</h2>
          <ul className="mt-4 divide-y divide-slate-100">
            {oneTimeFees.map((fee) => (
              <li key={fee.service} className="flex items-center justify-between py-3 text-sm">
                <span className="text-slate-700">{fee.service}</span>
                <span className="font-semibold text-slate-900">{naira(fee.amount)}</span>
                </li>
          ))}
          </ul>
          <p className="mt-4 text-xs text-slate-500">
            The offline version installed on your school computers needs no
            hosting fee. See{" "}
            <Link
              href="/offline"
              className="font-semibold text-brand-700 underline hover:text-brand-800"
            >
              Offline or Online
            </Link>{" "}
            for how the two editions differ.
          </p>
        </div>
      </section>

      {/* ── Hosting & domain ── */}
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
            <h2 className="text-lg font-bold text-slate-900">
              Yearly hosting & domain (online version only)
            </h2>
            <p className="mt-1 text-sm text-slate-600">
              The online version runs on cloud servers with your school&apos;s own web address.
              Billed yearly, upfront. The offline version needs no hosting fee.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-6 py-3 font-semibold">Item (yearly)</th>
                  {schoolSizes.map((s) => (
                    <th key={s.id} className="px-6 py-3 text-right font-semibold">{s.label}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="px-6 py-3.5 font-medium text-slate-900">Cloud hosting and server space</td>
                  {hostingTiers.map((t) => (
                    <td key={t.size} className="px-6 py-3.5 text-right font-semibold text-slate-900">
                      {naira(hostingAmountsFor[t.size])}
                    </td>
                  ))}
                </tr>
                <tr className="bg-slate-50/60">
                  <td className="px-6 py-3.5 font-medium text-slate-900">Domain name (web address)</td>
                  {hostingTiers.map((t) => (
                    <td key={t.size} className="px-6 py-3.5 text-right font-semibold text-slate-900">
                      {naira(t.domain)}
                    </td>
                  ))}
                </tr>
                <tr>
                  <td className="px-6 py-3.5 font-bold text-slate-900">Total per year</td>
                  {hostingTiers.map((t) => (
                    <td key={t.size} className="px-6 py-3.5 text-right font-bold text-slate-900">
                      {naira(hostingAmountsFor[t.size] + t.domain)}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
          <p className="border-t border-slate-100 px-6 py-3 text-xs text-slate-500">
            {HOSTING_SERVER_NOTE}
            {liveHosting && (
              <>
                {" "}
                <em className="not-italic font-medium text-slate-600">{liveHosting.note}</em>
              </>
            )}
          </p>
        </div>
      </section>

      {/* ── Dollar check: USD cost vs Naira price per tier (daily-check data) ── */}
      <DollarRatePanel />

      {/* ── Discounts ── */}
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">Discounts</h2>
          <ul className="mt-4 space-y-3">
            {discounts.map((d) => (
              <li key={d.title} className="flex items-start gap-2.5 text-sm">
                <Icon name="check" className="mt-0.5 h-4 w-4 shrink-0 text-brand-600" strokeWidth={2.5} />
                <span className="text-slate-700">
                  <strong className="font-semibold text-slate-900">{d.title}:</strong> {d.detail}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Terms ── */}
      <section className="mx-auto max-w-6xl px-4 pb-6 sm:px-6">
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 sm:p-8">
          <h2 className="text-lg font-bold text-slate-900">Terms</h2>
          <ul className="mt-3 list-disc space-y-1.5 pl-5 text-sm text-slate-600">
            {pricingTerms.map((t) => (
              <li key={t}>{t}</li>
            ))}
          </ul>
        </div>
      </section>

      <div className="pb-16 pt-4">
        <CtaBanner
          title="Ready when you are"
          description="A demo is the fastest way to see what your school gets for these prices — and we'll confirm the exact package before anything is installed."
        />
      </div>
    </>
  );
}
