import type { Metadata } from "next";
import Link from "next/link";
import {
  editionComparison,
  offlineRequirements,
  costStructure,
  offlineFaqs,
} from "@/data/offline";
import { naira } from "@/data/pricing-table";
import { buildMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/SectionHeader";
import { FaqList } from "@/components/FaqList";
import { CtaBanner } from "@/components/CtaBanner";
import { ViewTracker } from "@/components/ViewTracker";
import { Icon } from "@/components/Icon";

export const metadata: Metadata = buildMetadata({
  title: "Offline vs Online — which edition fits your school?",
  description:
    "SkulSuite runs with or without internet: the offline edition runs on your school's own network with no monthly hosting, while the online edition lets parents and staff connect from anywhere. Compare both editions.",
  path: "/offline",
});

export default function OfflinePage() {
  return (
    <>
      <ViewTracker event="offline_view" />

      {/* ── Hero ── */}
      <section className="mx-auto max-w-6xl px-4 pb-10 pt-14 sm:px-6 sm:pt-20">
        <SectionHeader
          eyebrow="Offline & online editions"
          title="No internet? No problem."
          description="SkulSuite runs two ways: on your school's own network with no internet at all, or in the cloud so parents and staff can connect from anywhere. Same products, same exams, same results — you choose where the data lives."
        />
        <div className="mx-auto mt-8 grid max-w-3xl gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
              <Icon name="monitor" className="h-5 w-5 text-brand-600" />
              The offline edition
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Runs on the school&apos;s own network — one server computer plus
              the router the school already has. Exams, attendance, records and
              report cards all work with zero internet. A short phone-hotspot
              session about once a month handles updates, licence checks and
              backups.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card">
            <h3 className="flex items-center gap-2 font-bold text-slate-900">
              <Icon name="users" className="h-5 w-5 text-brand-600" />
              The online edition
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              Runs on managed cloud servers. Staff, students and parents connect
              from anywhere — results on parents&apos; phones, teachers from
              home — while backups and server maintenance are handled
              professionally.
            </p>
          </div>
        </div>
      </section>

      {/* ── Side-by-side comparison ── */}
      <section
        className="mx-auto max-w-6xl px-4 py-10 sm:px-6"
        aria-labelledby="compare-heading"
      >
        <SectionHeader
          eyebrow="Side by side"
          title="How the two editions differ"
          description="Every row below is about the same products — the difference is where the software runs and where the data lives."
        />
        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3.5 font-semibold">Feature</th>
                  <th className="px-5 py-3.5 font-semibold text-brand-700">
                    Offline edition
                  </th>
                  <th className="px-5 py-3.5 font-semibold text-brand-700">
                    Online edition
                  </th>
                </tr>
              </thead>
              <tbody>
                {editionComparison.map((row, i) => (
                  <tr
                    key={row.feature}
                    className={i % 2 === 1 ? "bg-slate-50/60" : ""}
                  >
                    <td className="px-5 py-4 align-top font-semibold text-slate-900">
                      {row.feature}
                    </td>
                    <td className="px-5 py-4 align-top leading-relaxed text-slate-600">
                      {row.offline}
                    </td>
                    <td className="px-5 py-4 align-top leading-relaxed text-slate-600">
                      {row.online}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <p className="mt-4 text-sm text-slate-500">
          Not sure which fits? The demo covers both —{" "}
          <Link
            href="/demo"
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            request one
          </Link>{" "}
          and we&apos;ll walk your school through each edition.
        </p>
      </section>

      {/* ── What a school needs (offline) ── */}
      <section
        className="border-y border-slate-100 bg-slate-50"
        aria-labelledby="requirements-heading"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <SectionHeader
            eyebrow="Offline edition"
            title="What your school needs"
            description="Less than most schools expect — and none of it is an internet subscription."
          />
          <ol className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {offlineRequirements.map((req, i) => (
              <li
                key={req.item}
                className="rounded-2xl border border-slate-200 bg-white p-5 shadow-card"
              >
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {i + 1}
                </span>
                <h3 className="mt-3 font-semibold text-slate-900">{req.item}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-600">
                  {req.detail}
                </p>
              </li>
            ))}
            <li className="rounded-2xl border border-brand-200 bg-brand-50 p-5">
              <h3 className="font-semibold text-brand-900">
                We handle the rest
              </h3>
              <p className="mt-1.5 text-sm leading-relaxed text-brand-800">
                Installation, configuration, moving your existing records and
                staff training are all part of setup — see the one-time fees on
                the{" "}
                <Link
                  href="/pricing"
                  className="font-semibold underline hover:text-brand-900"
                >
                  pricing page
                </Link>
                .
              </p>
            </li>
          </ol>
        </div>
      </section>

      {/* ── Cost structure ── */}
      <section
        className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16"
        aria-labelledby="cost-heading"
      >
        <SectionHeader
          eyebrow="Cost structure"
          title="How the costs differ"
          description="The software licence price is the same either way. What changes is the line around it — taken straight from our official price list."
        />
        <div className="mt-10 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-card">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                  <th className="px-5 py-3.5 font-semibold">Cost line</th>
                  <th className="px-5 py-3.5 font-semibold text-brand-700">
                    Offline edition
                  </th>
                  <th className="px-5 py-3.5 font-semibold text-brand-700">
                    Online edition
                  </th>
                </tr>
              </thead>
              <tbody>
                {costStructure.map((line, i) => (
                  <tr
                    key={line.item}
                    className={i % 2 === 1 ? "bg-slate-50/60" : ""}
                  >
                    <td className="px-5 py-4 align-top">
                      <span className="font-semibold text-slate-900">
                        {line.item}
                      </span>
                      {line.note ? (
                        <span className="mt-0.5 block text-xs text-slate-500">
                          {line.note}
                        </span>
                      ) : null}
                    </td>
                    <td className="px-5 py-4 align-top font-medium text-slate-900">
                      {line.offline}
                    </td>
                    <td className="px-5 py-4 align-top font-medium text-slate-900">
                      {line.online}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-slate-100 px-5 py-3 text-xs text-slate-500">
            All figures from the official price list (valid until 29 October
            2026) — see the{" "}
            <Link
              href="/pricing"
              className="font-semibold text-brand-700 hover:text-brand-800"
            >
              full pricing page
            </Link>{" "}
            for exact licence prices, discounts and terms. The online edition's
            hosting line is the one that follows the dollar (servers are billed
            in USD) — today's dollar-vs-Naira comparison is shown in the{" "}
            <Link
              href="/pricing"
              className="font-semibold text-brand-700 hover:text-brand-800"
            >
              Dollar check panel
            </Link>
            . Going offline means that risk is simply gone.
          </p>
        </div>
        <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <p className="text-sm leading-relaxed text-slate-600">
            <strong className="font-semibold text-slate-900">
              Simple way to remember it:
            </strong>{" "}
            going offline removes the yearly cloud hosting and domain fees (
            {naira(130000)}–{naira(525000)} + {naira(40000)} a year) and adds
            the one-time {naira(50000)} setup and offline installation fee.
            Licence prices never change between editions.
          </p>
        </div>
      </section>

      {/* ── Which edition fits which school ── */}
      <section
        className="border-y border-slate-100 bg-slate-50"
        aria-labelledby="fit-heading"
      >
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-16">
          <SectionHeader
            eyebrow="Choosing"
            title="Which edition fits your school?"
          />
          <div className="mt-10 grid gap-6 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Icon name="monitor" className="h-5 w-5 text-brand-600" />
                Choose offline when…
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Internet in your area is unreliable or too costly",
                  "Exams must never stop because of a network outage",
                  "You want the school's records kept inside the school",
                  "You'd rather avoid yearly hosting and domain fees",
                ].map((reason) => (
                  <li
                    key={reason}
                    className="flex items-start gap-2.5 text-sm text-slate-600"
                  >
                    <Icon
                      name="check"
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                      strokeWidth={2.5}
                    />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <Icon name="users" className="h-5 w-5 text-brand-600" />
                Choose online when…
              </h3>
              <ul className="mt-4 space-y-2.5">
                {[
                  "Parents should follow results from home, on their phones",
                  "Teachers need to work from outside the school",
                  "You want backups and server care handled for you",
                  "You plan to add online fee payments later",
                ].map((reason) => (
                  <li
                    key={reason}
                    className="flex items-start gap-2.5 text-sm text-slate-600"
                  >
                    <Icon
                      name="check"
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                      strokeWidth={2.5}
                    />
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mx-auto mt-8 max-w-2xl text-center text-sm text-slate-600">
            And you can change later: schools often start offline and move
            online when ready — your records come along, and we handle the
            migration.
          </p>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section
        className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-16"
        aria-labelledby="faq-heading"
      >
        <SectionHeader
          eyebrow="FAQ"
          title="Offline edition questions"
          description="The questions school owners ask most about running SkulSuite without internet."
        />
        <div className="mt-10">
          <FaqList items={offlineFaqs} />
        </div>
        <p className="mt-8 text-center text-sm text-slate-600">
          Still unsure which edition suits your school?{" "}
          <Link
            href="/contact"
            className="font-semibold text-brand-700 hover:text-brand-800"
          >
            Talk to us
          </Link>{" "}
          — we&apos;ll ask a few questions and recommend honestly.
        </p>
      </section>

      <div className="pb-16 sm:pb-20">
        <CtaBanner
          title="See both editions working"
          description="A demo shows the offline edition running on a school network and the online edition in the cloud — book yours and decide with real screens in front of you."
        />
      </div>
    </>
  );
}
