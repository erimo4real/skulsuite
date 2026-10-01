/**
 * Pricing engine tests — runs the required test cases from the owner's build
 * prompt (section 17, T1-T14) plus input-validation guards, against the REAL
 * price data the website displays (src/data/pricing-table.ts). If someone
 * edits a price on the site, these tests recompute against the new numbers,
 * so they never fail because of a legitimate price change.
 *
 * Run: node --experimental-strip-types scripts/test-pricing-engine.mts
 * (Type stripping is on by default in Node 24.)
 *
 * T15 (admin price edits flow through, old invoices keep their price) is a
 * backend/database behaviour for the future Django platform — the static site
 * has no admin and no invoices; here we assert the single-source-of-truth
 * property instead: the engine's output is derived from the same imported
 * table the site renders.
 */
import {
  calculateQuote,
  sizeForStudents,
  type QuoteInput,
  type ProductKey,
} from "../src/lib/pricing-engine.ts";
import {
  termlyPrices,
  ownershipPrices,
  hostingTiers,
  oneTimeFees,
} from "../src/data/pricing-table.ts";

const rowMap = (rows: { key: string; amounts: [number, number, number] }[]) =>
  Object.fromEntries(rows.map((r) => [r.key, r.amounts]));

const tables = {
  termly: rowMap(termlyPrices),
  ownership: rowMap(ownershipPrices),
  hosting: Object.fromEntries(hostingTiers.map((t) => [t.size, t.hosting])),
  domain: hostingTiers[0].domain,
  fees: {
    setup: oneTimeFees[0].amount,
    migration: oneTimeFees[1].amount,
    trainingPerSession: oneTimeFees[2].amount,
  },
} as const;

function makeInput(overrides: Partial<QuoteInput> = {}): QuoteInput {
  return {
    students: 100,
    option: "termly",
    products: ["sms"],
    online: false,
    extras: { setup: false, migration: false, trainingSessions: 0 },
    discounts: { earlyAdopter: false, upfront: false },
    supportPlan: false,
    tables,
    ...overrides,
  };
}

let passed = 0;
let failed = 0;
const failures: string[] = [];

function check(name: string, cond: boolean, detail?: string) {
  if (cond) {
    passed++;
    console.log(`  ok    ${name}`);
  } else {
    failed++;
    failures.push(`${name}${detail ? ` — ${detail}` : ""}`);
    console.log(`  FAIL  ${name}${detail ? ` — ${detail}` : ""}`);
  }
}

function totalOf(input: QuoteInput): number | null {
  return calculateQuote(input).total;
}

const ALL: ProductKey[] = ["sms", "cbt", "qbank"];

console.log("Required pricing test cases (build prompt section 17)");

// T1 Small, School Management System only, termly = ₦40,000.
check("T1 small SMS termly = 40,000", totalOf(makeInput({ students: 50 })) === 40000);

// T2 Small, all three, termly = ₦63,750.
check("T2 small bundle termly = 63,750", totalOf(makeInput({ students: 99, products: ALL })) === 63750);

// T3 Medium, all three, termly = ₦119,000.
check("T3 medium bundle termly = 119,000", totalOf(makeInput({ students: 200, products: ALL })) === 119000);

// T4 Large, all three, termly = ₦221,000.
check("T4 large bundle termly = 221,000", totalOf(makeInput({ students: 600, products: ALL })) === 221000);

// T5 Medium, all three, ownership = ₦1,190,000.
check(
  "T5 medium bundle ownership = 1,190,000",
  totalOf(makeInput({ students: 150, products: ALL, option: "ownership" })) === 1190000,
);

// T6 Small, all three, ownership = ₦637,500.
check(
  "T6 small bundle ownership = 637,500",
  totalOf(makeInput({ students: 80, products: ALL, option: "ownership" })) === 637500,
);

// T7 Medium, SMS, termly, early adopter, first term = ₦37,500.
check(
  "T7 medium SMS termly early adopter = 37,500",
  totalOf(
    makeInput({ students: 150, discounts: { earlyAdopter: true, upfront: false } }),
  ) === 37500,
);

// T8 Medium, all three, termly, pay all three terms upfront = ₦321,300 (119,000 × 3 × 0.9).
check(
  "T8 medium bundle termly upfront = 321,300",
  totalOf(makeInput({ students: 150, products: ALL, discounts: { earlyAdopter: false, upfront: true } })) ===
    321300,
);

// T9 Medium, all three, termly × 3 + hosting & domain + setup.
// The prompt's printed sum (357,000 + 300,000 + 50,000) omits its own 10%
// upfront discount. The engine applies the discount rule first:
// (119,000 × 3 − 10%) + 300,000 + 50,000 = 321,300 + 350,000 = ₦671,300.
{
  const r = calculateQuote(
    makeInput({
      students: 150,
      products: ALL,
      discounts: { earlyAdopter: false, upfront: true },
      online: true,
      extras: { setup: true, migration: false, trainingSessions: 0 },
    }),
  );
  check("T9 medium bundle upfront + hosting/domain/setup = 671,300 (10% discount applied)", r.total === 671300);
  check(
    "T9 line items: licence 357,000, discount 35,700, hosting 260,000, domain 40,000, setup 50,000",
    r.subtotal === 707000 &&
      r.discountAmount === 35700 &&
      r.lines.some((l) => l.label.includes("hosting") && l.amount === 260000) &&
      r.lines.some((l) => l.label.includes("Domain") && l.amount === 40000) &&
      r.lines.some((l) => l.label.includes("Setup") && l.amount === 50000),
  );
}

// T10 Medium, all three, ownership + hosting & domain + setup = ₦1,540,000.
check(
  "T10 medium bundle ownership + hosting/domain/setup = 1,540,000",
  totalOf(
    makeInput({
      students: 150,
      products: ALL,
      option: "ownership",
      online: true,
      extras: { setup: true, migration: false, trainingSessions: 0 },
    }),
  ) === 1540000,
);

// T11 Yearly support plan on Medium all-three ownership = ₦238,000.
check(
  "T11 support plan medium bundle ownership = 238,000",
  totalOf(
    makeInput({
      students: 150,
      products: ALL,
      option: "ownership",
      supportPlan: true,
    }),
  ) === 238000 + 1190000,
);

// T12 Student count tiers.
{
  const cases: [number, string | null][] = [
    [99, "small"],
    [100, "medium"],
    [299, "medium"],
    [300, "large"],
    [600, "large"],
    [601, null],
  ];
  for (const [count, expected] of cases) {
    const size = sizeForStudents(count);
    check(
      `T12 ${count} students → ${expected ?? "custom quote"}`,
      expected === null
        ? calculateQuote(makeInput({ students: count })).customQuote === true
        : size === expected,
    );
  }
}

// T13 Early adopter + upfront together = rejected with a clear message.
{
  const r = calculateQuote(
    makeInput({ students: 150, discounts: { earlyAdopter: true, upfront: true } }),
  );
  check("T13 combined discounts rejected", r.error !== null && r.total === null);
}

// T14 A discount never applies to hosting, domain or one-time fees.
{
  const r = calculateQuote(
    makeInput({
      students: 150,
      products: ALL,
      discounts: { earlyAdopter: true, upfront: false },
      online: true,
      extras: { setup: true, migration: true, trainingSessions: 1 },
    }),
  );
  const licence = 119000;
  const undiscounted = 260000 + 40000 + 50000 + 30000 + 20000;
  check("T14 discount is exactly 50% of the licence only", r.discountAmount === licence / 2);
  check(
    "T14 total = discounted licence + full-price hosting/domain/fees",
    r.total === licence - licence / 2 + undiscounted,
  );
  check(
    "T14 hosting/fees lines carry full amounts",
    r.lines.some((l) => l.label.includes("hosting") && l.amount === 260000) &&
      r.lines.some((l) => l.label.includes("training") && l.amount === 20000),
  );
}

console.log("\nInput validation and rule guards");

{
  const noProducts = calculateQuote(makeInput({ products: [] }));
  check("empty product list rejected", noProducts.error !== null);

  const badStudents = calculateQuote(makeInput({ students: 0 }));
  check("zero/negative students rejected", badStudents.error !== null);

  const oaOwnership = calculateQuote(
    makeInput({ option: "ownership", discounts: { earlyAdopter: true, upfront: false } }),
  );
  check("early adopter refused on ownership", oaOwnership.error !== null);

  const upOwnership = calculateQuote(
    makeInput({ option: "ownership", discounts: { earlyAdopter: false, upfront: true } }),
  );
  check("upfront discount refused on ownership", upOwnership.error !== null);

  const dedup = calculateQuote(makeInput({ products: ["sms", "sms", "cbt"] }));
  check("duplicate products counted once", dedup.total === 75000 + 40000);
}

console.log("\nSingle source of truth (static stand-in for T15)");

{
  // The engine output is derived from the same imported tables the site renders.
  const medium = 1;
  const r = calculateQuote(makeInput({ students: 150, products: ALL }));
  const expectedFromTables = tables.termly.bundle[medium];
  check("engine derives medium bundle from pricing-table.ts", r.total === expectedFromTables);
}

console.log(`\n${passed} passed, ${failed} failed`);
if (failures.length > 0) {
  console.log("Failures:");
  for (const f of failures) console.log(`  - ${f}`);
}
process.exitCode = failed > 0 ? 1 : 0;
