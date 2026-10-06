"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  calculateQuote,
  type PricingTables,
  type PriceRow,
  type ProductKey,
  type PurchaseOption,
  type QuoteInput,
  type QuoteResult,
  type SchoolSize,
} from "@/lib/pricing-engine";
import {
  oneTimeFees,
  ownershipPrices,
  termlyPrices,
  naira,
} from "@/data/pricing-table";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { Icon, type IconName } from "./Icon";

/**
 * "Find my package" wizard — build prompt v5 §4 (fast path for busy visitors):
 * one question per screen, big tap buttons, progress indicator, Back button,
 * finished in under 60 seconds. Results come from the pricing engine
 * (test F4: they must match pricing tests T1–T15). Answers persist in
 * sessionStorage so the wizard resumes after a refresh (test F7).
 */

type Need = "cbt" | "sms" | "qbank" | "all";
type Mode = "offline" | "online" | "unsure";
type Buy = "termly" | "ownership" | "unsure";

interface Answers {
  students: number | null; // representative student count per band
  need: Need | null;
  mode: Mode | null;
  buy: Buy | null;
}

const EMPTY: Answers = { students: null, need: null, mode: null, buy: null };

const STORAGE_KEY = "skulsuite-package-finder";

/** Representative count per size band (engine needs a number; band drives the tier). */
const STUDENT_BANDS: { label: string; range: string; value: number; icon: IconName }[] = [
  { label: "Small", range: "up to 99 students", value: 60, icon: "users" },
  { label: "Medium", range: "100 – 299 students", value: 150, icon: "users" },
  { label: "Large", range: "300 – 600 students", value: 400, icon: "users" },
  { label: "Over 600", range: "custom quote only", value: 700, icon: "school" },
];

const NEEDS: { value: Need; label: string; hint: string; icon: IconName }[] = [
  { value: "all", label: "All three", hint: "The complete suite", icon: "book-open" },
  { value: "cbt", label: "Exams on computer", hint: "CBT Examination System", icon: "monitor" },
  { value: "sms", label: "Records and results", hint: "School Management System", icon: "school" },
  { value: "qbank", label: "Question bank", hint: "Question Bank", icon: "database" },
];

const MODES: { value: Mode; label: string; hint: string; icon: IconName }[] = [
  {
    value: "offline",
    label: "Offline edition",
    hint: "Runs on the school's own network — no internet day-to-day, no yearly hosting fee",
    icon: "monitor",
  },
  {
    value: "online",
    label: "Online edition",
    hint: "Cloud servers — parents and staff connect from anywhere",
    icon: "users",
  },
  {
    value: "unsure",
    label: "Not sure — recommend for me",
    hint: "We'll recommend honestly based on your answers",
    icon: "check",
  },
];

const BUY_OPTIONS: { value: Buy; label: string; hint: string }[] = [
  { value: "termly", label: "Pay per term", hint: "Lower start-up cost; includes support while active" },
  { value: "ownership", label: "Own it", hint: "One-time purchase; no termly fees after" },
  { value: "unsure", label: "Not sure — show both", hint: "See both prices side by side" },
];

const PRODUCT_LABELS: Record<Need, string> = {
  all: "all three products",
  cbt: "the CBT Examination System",
  sms: "the School Management System",
  qbank: "the Question Bank",
};

const DEMO_PRODUCT: Record<Need, string> = {
  all: "all",
  cbt: "cbt",
  sms: "school-management",
  qbank: "question-bank",
};

function rowMap(
  rows: { key: string; amounts: [number, number, number] }[],
): Record<ProductKey | "bundle", PriceRow> {
  const map = {} as Record<ProductKey | "bundle", PriceRow>;
  for (const r of rows) {
    map[r.key as ProductKey | "bundle"] = r.amounts;
  }
  return map;
}

/** F4: every price on the result screen comes from this engine call — nothing is hand-computed. */
function buildInput(a: Answers, buy: PurchaseOption, hosting: Record<SchoolSize, number>, domain: number): QuoteInput {
  const offline = a.mode !== "online"; // "unsure" is recommended as offline
  return {
    students: a.students ?? 0,
    option: buy,
    products: (a.need === "all" ? ["sms", "cbt", "qbank"] : [a.need as ProductKey]) as ProductKey[],
    online: !offline,
    extras: {
      setup: offline, // setup + offline installation fee applies to the offline edition
      migration: false,
      trainingSessions: 0,
    },
    discounts: { earlyAdopter: false, upfront: false },
    supportPlan: false,
    tables: {
      termly: rowMap(termlyPrices),
      ownership: rowMap(ownershipPrices),
      hosting,
      domain,
      fees: {
        setup: oneTimeFees[0].amount,
        migration: oneTimeFees[1].amount,
        trainingPerSession: oneTimeFees[2].amount,
      },
    },
  };
}

function reasonText(a: Answers, buy: PurchaseOption): string {
  const band = STUDENT_BANDS.find((b) => b.value === a.students);
  const offline = a.mode !== "online";
  const parts: string[] = [];
  parts.push(
    `We sized your school as ${band?.label ?? "our"} (${band?.range ?? "band"}).`,
  );
  if (offline) {
    parts.push(
      "The offline edition runs on your school's own network — exams and records work without internet, and there's no yearly hosting fee. A short monthly hotspot session handles updates and backups.",
    );
  } else {
    parts.push(
      "The online edition runs on managed cloud servers, so parents and staff can connect from anywhere — hosting and your web address are billed yearly.",
    );
  }
  parts.push(
    buy === "termly"
      ? "The termly licence keeps start-up costs low, and software updates plus WhatsApp support are included while your licence is active."
      : "Ownership is a one-time purchase for one school site — no termly licence fees after, with an optional yearly support plan.",
  );
  return parts.join(" ");
}

function QuoteCard({
  quote,
  buy,
  reason,
  whatsappHref,
  demoHref,
}: {
  quote: QuoteResult;
  buy: PurchaseOption;
  reason: string;
  whatsappHref: string | null;
  demoHref: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-brand-600">
        {buy === "termly" ? "Option A — pay per term" : "Option B — own the app"}
      </h3>
      {quote.customQuote ? (
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          Schools with more than 600 students get a custom quote — request a
          demo and we&apos;ll put the right package together for you.
        </p>
      ) : (
        <>
          <ul className="mt-4 divide-y divide-slate-100 text-sm">
            {quote.lines.map((line) => (
              <li key={line.label} className="flex items-start justify-between gap-3 py-2.5">
                <span className="text-slate-600">
                  {line.label}
                  {line.note ? (
                    <span className="block text-xs text-slate-400">{line.note}</span>
                  ) : null}
                </span>
                <span className={`font-semibold tabular-nums ${line.amount < 0 ? "text-emerald-600" : "text-slate-900"}`}>
                  {line.amount < 0 ? `− ${naira(-line.amount)}` : naira(line.amount)}
                </span>
              </li>
            ))}
          </ul>
          <div className="mt-4 rounded-xl bg-brand-50 px-4 py-3">
            <div className="flex items-baseline justify-between">
              <span className="text-sm font-semibold text-brand-900">Total</span>
              <span className="text-2xl font-bold tabular-nums text-brand-700">
                {naira(quote.total ?? 0)}
              </span>
            </div>
            <p className="mt-1 text-xs text-brand-800">
              For {quote.totalCovers}.
              {buy === "termly"
                ? " The early-adopter discount (50% off your first term) is available — ask in your demo."
                : ""}
            </p>
          </div>
        </>
      )}
      <p className="mt-4 text-sm leading-relaxed text-slate-600">{reason}</p>
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <Link
          href={demoHref}
          className="inline-flex min-h-[44px] flex-1 items-center justify-center rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          Book a demo with this package
        </Link>
        {whatsappHref ? (
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-[44px] flex-1 items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-brand-400 hover:text-brand-700"
          >
            <Icon name="whatsapp" className="h-4 w-4 text-[#25D366]" strokeWidth={2} />
            Send to my WhatsApp
          </a>
        ) : null}
      </div>
    </div>
  );
}

export function PackageFinder({
  hosting,
  domain,
}: {
  hosting: Record<SchoolSize, number>;
  domain: number;
}) {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>(EMPTY);
  const [restored, setRestored] = useState(false);

  // F7: resume after a refresh — restore saved answers (validity-checked).
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const saved = JSON.parse(raw) as { answers?: Answers; step?: number };
      if (saved.answers && typeof saved.answers === "object") {
        const a = saved.answers;
        const ok =
          STUDENT_BANDS.some((b) => b.value === a.students) &&
          NEEDS.some((n) => n.value === a.need) &&
          MODES.some((m) => m.value === a.mode) &&
          BUY_OPTIONS.some((b) => b.value === a.buy);
        if (ok) {
          setAnswers(a as Answers);
          setStep(Math.min(Math.max(saved.step ?? 0, 0), 4));
          setRestored(true);
        }
      }
    } catch {
      // ignore malformed storage
    }
  }, []);

  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ answers, step }));
    } catch {
      // storage unavailable — the wizard still works without persistence
    }
  }, [answers, step]);

  const answer = <K extends keyof Answers>(key: K, value: Answers[K]) => {
    trackEvent("cta_click", { location: `package_finder_q${step + 1}` });
    setAnswers((a) => ({ ...a, [key]: value }));
    setStep((s) => s + 1);
  };

  const isResult = step >= 4 && answers.students !== null && answers.need !== null;

  const termlyQuote = useMemo(
    () => (isResult ? calculateQuote(buildInput(answers, "termly", hosting, domain)) : null),
    [isResult, answers, hosting, domain],
  );
  const ownershipQuote = useMemo(
    () => (isResult ? calculateQuote(buildInput(answers, "ownership", hosting, domain)) : null),
    [isResult, answers, hosting, domain],
  );

  const whatsappHref = useMemo(() => {
    if (!isResult || termlyQuote === null) return null;
    const buy = answers.buy === "ownership" ? "ownership" : "termly";
    const quote = buy === "termly" ? termlyQuote : ownershipQuote;
    const band = STUDENT_BANDS.find((b) => b.value === answers.students);
    const mode =
      answers.mode === "online" ? "Online edition" : answers.mode === "offline" ? "Offline edition" : "Recommended: offline edition";
    const message = [
      "Hello! I used the package finder on your website.",
      "",
      `School size: ${band?.label ?? "—"} (${band?.range ?? "—"})`,
      `Needs: ${answers.need ? PRODUCT_LABELS[answers.need] : "—"}`,
      `Edition: ${mode}`,
      `Budget option: ${buy === "termly" ? "Pay per term" : "Own the app"}`,
      quote && quote.total !== null
        ? `Website quote: ${naira(quote.total)} for ${quote.totalCovers}`
        : "Custom quote requested (over 600 students)",
      "",
      "I'd like to discuss this or book a demo.",
    ].join("\n");
    return buildWhatsAppLink(message);
  }, [isResult, answers, termlyQuote, ownershipQuote]);

  function startOver() {
    setAnswers(EMPTY);
    setStep(0);
    setRestored(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  const progress = Math.min(step, 4);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
      {/* Progress bar + back */}
      <div className="border-b border-slate-100 bg-slate-50 px-5 py-3.5">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-2" aria-hidden="true">
            {[0, 1, 2, 3].map((i) => (
              <span
                key={i}
                className={`h-2 w-8 rounded-full transition-colors ${i < progress ? "bg-brand-600" : "bg-slate-200"}`}
              />
            ))}
            <span className="ml-2 text-xs font-medium text-slate-500">
              {isResult ? "Result" : `Question ${progress + 1} of 4`}
            </span>
          </div>
          <div className="flex items-center gap-2">
            {restored && !isResult ? (
              <span className="text-xs text-slate-400">Resumed from your last visit</span>
            ) : null}
            {step > 0 && !isResult ? (
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(0, s - 1))}
                className="inline-flex min-h-[36px] items-center rounded-lg border border-slate-200 bg-white px-3 text-xs font-semibold text-slate-600 hover:border-brand-300 hover:text-brand-700"
              >
                ← Back
              </button>
            ) : null}
            {step > 0 ? (
              <button
                type="button"
                onClick={startOver}
                className="inline-flex min-h-[36px] items-center rounded-lg px-2 text-xs font-medium text-slate-400 hover:text-slate-700"
              >
                Start over
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <div className="px-5 py-8 sm:px-8 sm:py-10">
        {/* ── Q1: students ── */}
        {step === 0 ? (
          <fieldset>
            <legend className="text-xl font-bold text-slate-900 sm:text-2xl">
              How many students does your school have?
            </legend>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {STUDENT_BANDS.map((band) => (
                <button
                  key={band.label}
                  type="button"
                  onClick={() => answer("students", band.value)}
                  className="flex min-h-[64px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-colors hover:border-brand-400 hover:bg-brand-50"
                >
                  <Icon name={band.icon} className="h-5 w-5 shrink-0 text-brand-600" />
                  <span>
                    <span className="block font-semibold text-slate-900">{band.label}</span>
                    <span className="block text-sm text-slate-500">{band.range}</span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        {/* ── Q2: need ── */}
        {step === 1 ? (
          <fieldset>
            <legend className="text-xl font-bold text-slate-900 sm:text-2xl">
              What do you need?
            </legend>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {NEEDS.map((n) => (
                <button
                  key={n.value}
                  type="button"
                  onClick={() => answer("need", n.value)}
                  className="flex min-h-[64px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-colors hover:border-brand-400 hover:bg-brand-50"
                >
                  <Icon name={n.icon} className="h-5 w-5 shrink-0 text-brand-600" />
                  <span>
                    <span className="block font-semibold text-slate-900">{n.label}</span>
                    <span className="block text-sm text-slate-500">{n.hint}</span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        {/* ── Q3: online or offline ── */}
        {step === 2 ? (
          <fieldset>
            <legend className="text-xl font-bold text-slate-900 sm:text-2xl">
              How do you want to run it?
            </legend>
            <div className="mt-6 grid gap-3">
              {MODES.map((m) => (
                <button
                  key={m.value}
                  type="button"
                  onClick={() => answer("mode", m.value)}
                  className="flex min-h-[64px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-colors hover:border-brand-400 hover:bg-brand-50"
                >
                  <Icon name={m.icon} className="h-5 w-5 shrink-0 text-brand-600" />
                  <span>
                    <span className="block font-semibold text-slate-900">{m.label}</span>
                    <span className="block text-sm text-slate-500">{m.hint}</span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        {/* ── Q4: buy option ── */}
        {step === 3 ? (
          <fieldset>
            <legend className="text-xl font-bold text-slate-900 sm:text-2xl">
              Pay per term, or own it?
            </legend>
            <div className="mt-6 grid gap-3">
              {BUY_OPTIONS.map((b) => (
                <button
                  key={b.value}
                  type="button"
                  onClick={() => answer("buy", b.value)}
                  className="flex min-h-[64px] items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-left transition-colors hover:border-brand-400 hover:bg-brand-50"
                >
                  <Icon name="check" className="h-5 w-5 shrink-0 text-brand-600" strokeWidth={2.5} />
                  <span>
                    <span className="block font-semibold text-slate-900">{b.label}</span>
                    <span className="block text-sm text-slate-500">{b.hint}</span>
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
        ) : null}

        {/* ── Result ── */}
        {isResult ? (
          <div>
            <h2 className="text-xl font-bold text-slate-900 sm:text-2xl">
              {answers.mode === "online"
                ? "Your recommended package (online)"
                : answers.mode === "unsure"
                  ? "We recommend the offline edition for you"
                  : "Your recommended package (offline)"}
            </h2>
            {answers.mode === "unsure" ? (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                You&apos;re not sure how to run it, so we recommended the offline
                edition: exams and records keep working without internet and
                there&apos;s no yearly hosting fee. You can move online later —
                your records come with you.
              </p>
            ) : null}
            <div className={`mt-6 grid gap-4 ${answers.buy === "unsure" ? "lg:grid-cols-2" : "max-w-2xl"}`}>
              {answers.buy !== "ownership" && termlyQuote ? (
                <QuoteCard
                  quote={termlyQuote}
                  buy="termly"
                  reason={reasonText(answers, "termly")}
                  whatsappHref={whatsappHref}
                  demoHref={`/demo?product=${DEMO_PRODUCT[answers.need as Need]}`}
                />
              ) : null}
              {answers.buy !== "termly" && ownershipQuote ? (
                <QuoteCard
                  quote={ownershipQuote}
                  buy="ownership"
                  reason={reasonText(answers, "ownership")}
                  whatsappHref={whatsappHref}
                  demoHref={`/demo?product=${DEMO_PRODUCT[answers.need as Need]}`}
                />
              ) : null}
            </div>
            <p className="mt-6 text-xs text-slate-500">
              Prices come straight from our official price list via the same
              calculator the pricing page uses — the total is the price you&apos;ll
              be quoted. We confirm every package before anything is installed.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
