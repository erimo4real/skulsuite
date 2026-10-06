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
 * - Green check  "Safe — price stays"      — price-list price ≥ USD cost.
 * - Amber note   "Dollar up — under review" — USD cost at today's rate has
 *   passed the listed price, the same condition the daily job watches before
 *   a tier's price actually changes.
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

/** "2026-09-30" → "30 September 2026" — dates a proprietor can read at a glance. */
function longDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];
  return Number.isFinite(y) && months[m - 1]
    ? `${d} ${months[m - 1]} ${y}`
    : iso;
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
            Dollar check — how hosting follows the dollar
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            The online edition runs on servers we rent from US companies, and
            they bill us in dollars. So the hosting line follows the exchange
            rate — we check it automatically every morning. Your software
            licence, setup and training prices are fixed in Naira and never
            move with the dollar.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-xs uppercase tracking-wide text-slate-500">
                <th className="px-6 py-3 font-semibold">School size</th>
                <th className="px-6 py-3 font-semibold">
                  What the server costs us (dollars / year)
                </th>
                <th className="px-6 py-3 font-semibold">
                  That cost in Naira today
                </th>
                <th className="px-6 py-3 font-semibold">
                  What you pay (per year)
                </th>
                <th className="px-6 py-3 font-semibold">What it means</th>
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
                        Dollar up — under review
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        <span aria-hidden="true">✓</span>
                        Safe — price stays
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
            Last checked:{" "}
            <strong className="font-semibold text-slate-900">
              {longDate(live.updated)}
            </strong>{" "}
            — $1 = {" "}
            <strong className="font-semibold tabular-nums text-slate-900">
              ₦{live.rate.toLocaleString("en-NG", { maximumFractionDigits: 2 })}
            </strong>
            . When your prices were set (29 Sep 2026), $1 = ₦1,330 — so the
            dollar is {rateUpVsBaseline} since then. The price you pay is{" "}
            {anyUnderWater
              ? "unchanged for now while we review the tier marked above"
              : "exactly as published"}
            ; if it ever changes, the new price and its date appear right here
            first — you will never be charged a new price silently.
          </p>
          {anyUnderWater ? (
            <p className="mt-2 rounded-lg bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <strong className="font-semibold">Heads up:</strong> at today&apos;s
              rate, the dollar cost of the tier marked above is now higher than
              the price listed. The listed price still stands for now — every
              hosting price has room built in for the dollar up to ₦1,400 (that
              covers bank charges on dollar payments and small movements). If
              the dollar stays above what the listed price can cover, we update
              that price — the daily check does it automatically — and this
              page shows the new price and the date it changed.
            </p>
          ) : (
            <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-900">
              <strong className="font-semibold">All good:</strong> at today&apos;s
              rate, every hosting tier still costs us less than the price you
              pay for it. Hosting prices only move if the dollar climbs past
              the room built into the price (we plan up to $1 = ₦1,400) — and
              if that day comes, the daily check raises the price and announces
              it here the same day.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
