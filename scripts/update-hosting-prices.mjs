/**
 * Daily USD→NGN price check.
 *
 * What it does
 *   1. Fetch the current USD→NGN rate (primary + fallback free APIs).
 *   2. Re-derive the yearly hosting tiers with the price list's own formula
 *      (USD base × planning rate, rounded to the nearest ₦5,000).
 *   3. Apply the owner's pricing policy and write src/data/hosting-live.json.
 *
 * Pricing policy (matches the official list, v1.0 Final, 29 Sep 2026)
 *   - The printed tiers (₦130k / ₦260k / ₦525k) embed the owner's judgment:
 *     they cover provider cost PLUS setup, backups, monitoring and buffer.
 *     They are therefore the FLOOR and the starting point.
 *   - A tier rises only when the formula at today's rate exceeds the printed
 *     value's next ₦5,000 boundary — i.e. the dollar has genuinely risen hard
 *     enough that the printed price no longer covers provider cost.
 *   - Tiers never move DOWN automatically; the owner revises the list.
 *   - Licence prices are never touched by this job.
 *
 * Exit codes for the workflow:
 *   0  = hosting-live.json updated (tiers changed) → commit + deploy
 *   33 = nothing to do (rate stable / tiers unchanged) → skip deploy
 *   1  = error
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.join(import.meta.dirname, "..");
const USD_FILE = path.join(ROOT, "src", "data", "hosting-usd.json");
const LIVE_FILE = path.join(ROOT, "src", "data", "hosting-live.json");
const ROUND_TO = 5_000;
// Ignore daily noise: act only when spot moves ≥0.5% since the last check.
const RATE_MOVE_GATE = 0.005;

// Printed tiers in the official price list (v1.0 Final, 29 Sep 2026).
const PUBLISHED = { small: 130_000, medium: 260_000, large: 525_000 };
// Official rate on the day prices were set (the PDF states ~₦1,330).
const LIST_BASELINE_RATE = 1330;

function readJson(file) {
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

function roundTo(n, step) {
  return Math.round(n / step) * step;
}

async function fetchRate() {
  const sources = [
    {
      name: "open.er-api.com",
      url: "https://open.er-api.com/v6/latest/USD",
      pick: (j) => j?.rates?.NGN,
    },
    {
      name: "frankfurter",
      url: "https://api.frankfurter.dev/v1/latest?base=USD&symbols=NGN",
      pick: (j) => j?.rates?.NGN,
    },
    {
      name: "exchangerate.host",
      url: "https://api.exchangerate.host/latest?base=USD&symbols=NGN",
      pick: (j) => j?.rates?.NGN,
    },
  ];
  for (const s of sources) {
    try {
      const res = await fetch(s.url, { signal: AbortSignal.timeout(20_000) });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const j = await res.json();
      const rate = s.pick(j);
      if (typeof rate === "number" && rate > 100 && rate < 10_000) {
        return { rate, source: s.name };
      }
      throw new Error(`implausible rate: ${rate}`);
    } catch (e) {
      console.error(`  source ${s.name} failed: ${e.message}`);
    }
  }
  throw new Error("all rate sources failed");
}

const usd = readJson(USD_FILE);
const planningRate = Number(usd.planning_rate_ngn_per_usd ?? 1400);
const today = new Date().toISOString().slice(0, 10);

let live = null;
try {
  live = readJson(LIVE_FILE);
} catch {
  /* first run */
}

console.log("fetching USD→NGN…");
const { rate, source } = await fetchRate();
console.log(`  rate: ${rate} (from ${source})`);

// Daily-noise gate vs the last rate we actually recorded.
if (live?.rate && Math.abs(rate - live.rate) / live.rate < RATE_MOVE_GATE) {
  console.log(`rate moved <0.5% vs recorded rate ${live.rate} — nothing to do`);
  process.exitCode = 33;
  process.exit(33);
}

// Policy in action:
//   official rate ≤ planning rate (₦1,400) → the printed prices still cover
//   provider cost + card charges, so every tier stays exactly as printed.
//   official rate > planning rate → the buffer is exhausted; recompute each
//   tier at the planning rate, never below the printed value.
const bufferExhausted = rate > planningRate;

const tiers = {};
for (const size of Object.keys(PUBLISHED)) {
  const recomputed = roundTo(usd.tiers[size].usd_per_year * planningRate, ROUND_TO);
  tiers[size] = {
    label: usd.tiers[size].label,
    hosting: bufferExhausted ? Math.max(recomputed, PUBLISHED[size]) : PUBLISHED[size],
  };
}

const atBaseline = !bufferExhausted;

const changed =
  !live ||
  Object.keys(PUBLISHED).some(
    (s) => (live.tiers?.[s]?.hosting ?? 0) !== tiers[s].hosting,
  );

const pctVsBaseline = ((rate - LIST_BASELINE_RATE) / LIST_BASELINE_RATE) * 100;
const pctWord = pctVsBaseline >= 0 ? "up" : "down";
const pctText = `${Math.abs(pctVsBaseline).toFixed(1)}%`;

const note = atBaseline
  ? `Hosting prices as published (29 Sep 2026). Checked ${today}: the dollar is ${pctWord} ${pctText} against the official rate used when prices were set — no change needed. Licence prices are unaffected.`
  : `Hosting prices updated ${today} — the dollar is ${pctWord} ${pctText} against the official rate used when prices were set (29 Sep 2026), so the hosting line moved to cover provider cost. Licence prices are unaffected.`;

const next = {
  updated: today,
  rate: Math.round(rate * 100) / 100,
  rate_source: source,
  planning_rate_ngn_per_usd: planningRate,
  list_baseline_rate_ngn_per_usd: LIST_BASELINE_RATE,
  published_baseline: PUBLISHED,
  tiers,
  note,
};

if (!changed && live) {
  // Rate wiggled but every tier stayed put — record the rate, skip deploy.
  live.rate = next.rate;
  live.rate_source = source;
  live.note = note;
  fs.writeFileSync(LIVE_FILE, JSON.stringify(live, null, 2) + "\n");
  console.log("tiers unchanged — rate recorded, no deploy");
  process.exitCode = 33;
} else {
  fs.writeFileSync(LIVE_FILE, JSON.stringify(next, null, 2) + "\n");
  console.log(`tiers: ${JSON.stringify(Object.fromEntries(
    Object.entries(tiers).map(([k, v]) => [k, v.hosting]),
  ))}`);
  console.log(`note: ${note}`);
  process.exitCode = 0;
}
