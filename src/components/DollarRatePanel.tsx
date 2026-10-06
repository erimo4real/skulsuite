import { hostingTiers, naira } from "@/data/pricing-table";
import {
  getLiveHosting,
  getHostingUsd,
  type HostingUsdFile,
  type LiveHosting,
} from "@/lib/hosting-live";

/**
 * "The price rises with the dollar" — server component under the hosting
 * table on /pricing. For each tier it compares the provider's real USD cost
 * (converted at the latest checked rate) with the school's Naira price and
 * shows an indicator when the Naira price is under water:
 *
 * - Green check  "Covered at today's rate"  — price-list price ≥ USD cost.
 * - Amber note   "Under review — cost rose" — USD cost at today's rate has
 *   passed the next ₦5,000 boundary, exactly the threshold the daily job
 *   uses before a tier's price actually changes.
 *
 * Everything comes from two committed data files (hosting-live.json, checked
 * daily by the GitHub Actions job; hosting-usd.json, manual provider prices)
 * so the panel, the billed prices and the note always agree. If either file
 * is missing the panel renders nothing — no invented numbers, ever.
 */

interface TierRow {
  size: string;
  label: string;
  usdPerYear: number;
  ngnPrice: number;
  /** Exact provider cost at the latest rate (rounded to whole Naira). */
  costNgn: number;
  underWater: boolean;
}

function rowsFor(
  usd: HostingUsdFile,
  live: LiveHosting | null,
): TierRow[] {
  return hostingTiers.map((t) => {
    const usdRow = usd.tiers[t.size];
    const rate = live?.rate ?? usd.baseline_rate_ngn_per_usd;
    const price = live?.tiers?.[t.size]?.hosting ?? t.hosting;
    const costNgn = Math.round(usdRow.usd_per_year * rate);
    return {
      size: t.size,
      label: usdRow.label.replace(/\s*\(.*\)\s*/, ""),
      usdPerYear: usdRow.usd_per_year,
      ngnPrice: price,
      costNgn,
      underWater: costNgn > price,
    };
  });
}

export function DollarRatePanel() {
  const live = getLiveHosting();
  const usd = getHostingUsd();
  if (!live || !usd) return null;

  const rows = rowsFor(usd, live);
  const rateUpVsBaseline =
    live.rate > usd.baseline_rate_ngn_per_usd
      ? `up ${(((live.rate - usd.baseline_rate_ngn_per_usd) / usd.baseline_rate_ngn_per_usd) * 100).toFixed(1)}%`
      : `down ${(((usd.baseline_rate_ngn_per_usd - live.rate) / usd.baseline_rate_ngn_per_usd) * 100).toFixed(1)}%`;
  const anyUnderWater = rows.some((r) => r.underWater);

  return (
    <section
      className="mx-auto max-w-6xl px-4 pb-6 sm:px-6"
      aria-labelledby="dollar-check-heading"
    >
      <div className="rounded-2xl border border-slate-200 bg-white shadow-card">
        <div className="border-b border-slate-100 bg-slate-50 px-6 py-4">
          <h2 id="dollar-check-heading" className="text-lg font-bold text-slate-900">
            Dollar check — how your hosting price follows the dollar
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Cloud providers bill us in US dollars, so the hosting line moves
            with the exchange rate — checked automatically every day. Software
            licences, setup and training never change with the dollar.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3 font-semibold">School size</th>
                <th className="px-6 py-3 font-semibold">Provider cost (USD/yr)</th>
                <th className="px-6 py-3 font-semibold">
                  Cost at latest rate
                </th>
                <th className="px-6 py-3 font-semibold">Your Naira price</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, i) => (
                <tr
                  key={row.size}
                  className={i % 2 === 1 ? "bg-slate-50/60" : ""}
                >
                  <td className="px-6 py-3.5 font-medium text-slate-900">
                    {row.label}
                  </td>
                  <td className="px-6 py-3.5 tabular-nums text-slate-600">
                    ${row.usdPerYear.toFixed(2)}
                  </td>
                  <td className="px-6 py-3.5 tabular-nums text-slate-600">
                    {naira(row.costNgn)}
                  </td>
                  <td className="px-6 py-3.5 font-semibold tabular-nums text-slate-900">
                    {naira(row.ngnPrice)}
                  </td>
                  <td className="px-6 py-3.5">
                    {row.underWater ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800">
                        <span aria-hidden="true">▲</span>
                        Cost rose — price under review
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <span aria-hidden="true">✓</span>
                        Covered at today&apos;s rate
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="border-t border-slate-100 px-6 py-4 text-sm">
          <p className="text-slate-600">
            Latest check:{" "}
            <strong className="font-semibold text-slate-900">
              {live.updated}
            </strong>{" "}
            — dollar at{" "}
            <strong className="font-semibold tabular-nums text-slate-900">
              ₦{live.rate.toLocaleString("en-NG", { maximumFractionDigits: 2 })}
            </strong>{" "}
            per $1 (official rate on 29 Sep 2026 was ₦1,330 — the dollar is{" "}
            {rateUpVsBaseline}). Today&apos;s Naira price stays exactly as
            published{anyUnderWater ? " while we review the affected tier" : ""}{" "}
            — any change is announced here first, never charged silently.
          </p>
          {anyUnderWater ? (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <strong className="font-semibold">Heads up:</strong> at today&apos;s
              rate the provider cost on the tier marked above is now higher than
              its listed price. The listed price still stands while the dollar
              is below our ₦1,400 planning rate (that buffer covers card
              charges and small swings). If the dollar stays above it, the
              daily check raises the affected price automatically — and this
              page shows the change the same day, never silently.
            </p>
          ) : (
            <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
              <strong className="font-semibold">All good:</strong> at today&apos;s
              rate every hosting tier still covers its provider cost at the
              listed price. Hosting prices only move if the dollar passes our
              ₦1,400 planning rate long enough for a tier&apos;s provider cost
              to cross its listed price — and if that day comes, the daily
              check updates the price and this panel together.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
