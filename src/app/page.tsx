import Link from "next/link";
import { home } from "@/data/home";
import { site, cta } from "@/data/site";
import { products } from "@/data/products";
import { generalFaqs } from "@/data/faq";
import { howItWorksSteps } from "@/data/how-it-works";
import { buildMetadata } from "@/lib/seo";
import { ButtonLink } from "@/components/Button";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { whatsappMessages } from "@/lib/whatsapp";
import { SectionHeader } from "@/components/SectionHeader";
import { ProductCard } from "@/components/ProductCard";
import { PricingSection } from "@/components/PricingSection";
import { FaqList } from "@/components/FaqList";
import { CtaBanner } from "@/components/CtaBanner";
import { StepsList } from "@/components/StepsList";
import { ProductIcon } from "@/components/accent";
import { LogoMark } from "@/components/Logo";
import { Icon } from "@/components/Icon";

export const metadata = buildMetadata({
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  path: "/",
});

/** Browser-frame mockup summarising the suite — pure CSS/SVG, no images. */
function HeroVisual() {
  return (
    <div className="relative mx-auto w-full max-w-lg" aria-hidden="true">
      {/* Back glow */}
      <div className="absolute -inset-8 rounded-[2.5rem] bg-gradient-to-br from-brand-100 via-brand-50 to-transparent blur-2xl" />

      <div className="relative rounded-2xl border border-slate-200 bg-white shadow-xl">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 border-b border-slate-100 px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-red-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
          <span className="ml-3 flex-1 rounded-md bg-slate-100 px-3 py-1 text-xs text-slate-500">
            app.skulsuite.com/dashboard
          </span>
        </div>

        {/* Dashboard body */}
        <div className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-3 w-32 rounded bg-slate-200" />
              <div className="mt-2 h-2.5 w-20 rounded bg-slate-100" />
            </div>
            <LogoMark className="h-9 w-9 opacity-90" />
          </div>

          {/* Stat cards */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Students", value: "1,248" },
              { label: "CBT exams", value: "32" },
              { label: "Fees collected", value: "87%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-slate-100 bg-slate-50 p-3"
              >
                <div className="text-base font-bold text-slate-900">
                  {stat.value}
                </div>
                <div className="mt-0.5 text-[11px] font-medium text-slate-500">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Live exam row */}
          <div className="rounded-xl border border-brand-100 bg-brand-50/70 p-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-400 opacity-60" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-brand-500" />
                </span>
                <div>
                  <div className="text-[13px] font-semibold text-slate-900">
                    Mathematics — Mid Term
                  </div>
                  <div className="text-[11px] text-slate-500">
                    28 students taking the exam now
                  </div>
                </div>
              </div>
              <div className="rounded-lg bg-white px-2.5 py-1 text-xs font-bold tabular-nums text-brand-700 shadow-sm">
                24:16
              </div>
            </div>
          </div>

          {/* List rows */}
          <div className="space-y-2.5">
            {[
              { color: "bg-violet-400", label: "Question Bank — 4,312 questions", w: "w-3/4" },
              { color: "bg-emerald-400", label: "Attendance marked — JSS 2A", w: "w-2/3" },
              { color: "bg-accent-400", label: "Report cards published — SS 1", w: "w-1/2" },
            ].map((row) => (
              <div key={row.label} className="flex items-center gap-3">
                <span className={`h-2 w-2 shrink-0 rounded-full ${row.color}`} />
                <div className="text-xs text-slate-600">{row.label}</div>
                <div className={`ml-auto h-1.5 rounded-full bg-slate-100 ${row.w} hidden sm:block`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating result chip */}
      <div className="absolute -bottom-5 -left-4 rounded-xl border border-slate-200 bg-white px-4 py-2.5 shadow-lg sm:-left-8">
        <div className="text-[11px] font-medium text-slate-500">CBT scored in</div>
        <div className="text-sm font-bold text-emerald-600">0.4 seconds ⚡</div>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-brand-50/60 to-white">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-2 lg:gap-12">
          <div className="text-center lg:text-left">
            <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
              {home.hero.eyebrow}
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              {home.hero.title}
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600 lg:mx-0">
              {home.hero.description}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row lg:justify-start">
              <ButtonLink href={cta.demoHref} size="lg">
                {cta.demo}
              </ButtonLink>
              <ButtonLink href={cta.exploreHref} variant="outline" size="lg">
                {cta.explore}
              </ButtonLink>
            </div>
            <div className="mt-5 flex justify-center lg:justify-start">
              <WhatsAppButton message={whatsappMessages.general} variant="ghost" />
            </div>
          </div>

          <div className="pb-6 lg:pb-0">
            <HeroVisual />
          </div>
        </div>
      </section>

      {/* ── Trust strip (build prompt §11: no fake numbers — pilot-schools message) ── */}
      <section className="border-b border-slate-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 py-6 text-center sm:px-6 lg:flex-row lg:justify-between lg:text-left">
          <div className="flex items-center gap-3">
            <span className="relative flex h-3 w-3 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-3 w-3 rounded-full bg-emerald-500" />
            </span>
            <p className="font-semibold text-slate-900">
              Now onboarding pilot schools
              <span className="block text-sm font-normal text-slate-600">
                Be among the first schools to run SkulSuite this session.
              </span>
            </p>
          </div>
          <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-slate-600">
            <li className="flex items-center gap-2">
              <Icon name="check" className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
              Live demos on the real product
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
              Official price list, valid until 29 Oct 2026
            </li>
            <li className="flex items-center gap-2">
              <Icon name="check" className="h-4 w-4 text-emerald-600" strokeWidth={2.5} />
              WhatsApp support on school days
            </li>
          </ul>
        </div>
      </section>

      {/* ── Products ──────────────────────────────────────────────── */}
      <section
        data-reveal
        className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20"
        aria-labelledby="products-heading"
      >
        <SectionHeader
          eyebrow="Products"
          title="Three tools that work together"
          description="Each product solves a real problem on its own. Together, they run your school's academic work from question to result."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ── One platform strip ────────────────────────────────────── */}
      <section data-reveal className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
          <div className="flex flex-col items-center gap-6 text-center lg:flex-row lg:justify-between lg:text-left">
            <div className="max-w-xl">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">
                One platform, not three separate systems
              </h2>
              <p className="mt-2 text-slate-600">
                Questions from the bank flow into CBT exams. Students, classes and
                subjects flow from School Management into everything. One login
                for staff, one record of truth for the school.
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3">
              {products.map((product) => (
                <Link
                  key={product.id}
                  href={`/products/${product.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-card transition-colors hover:border-brand-300 hover:text-brand-700"
                >
                  <ProductIcon icon={product.icon} accent={product.accent} className="h-4 w-4" />
                  {product.shortName}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Problems we solve ─────────────────────────────────────── */}
      <section data-reveal className="bg-white" aria-labelledby="problems-heading">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeader
            eyebrow={home.problems.eyebrow}
            title={home.problems.title}
            description={home.problems.description}
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {home.problems.items.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 text-red-600">
                  <Icon name={item.icon} />
                </span>
                <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Benefits ──────────────────────────────────────────────── */}
      <section data-reveal className="bg-white pb-16 sm:pb-20" aria-labelledby="benefits-heading">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-2">
          <div>
            <SectionHeader
              eyebrow={home.benefits.eyebrow}
              title={home.benefits.title}
              align="left"
            />
            <ul className="mt-6 space-y-3.5">
              {home.benefits.items.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <span className="text-slate-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Built-for-schools trust panel (no fabricated stats — PRD §17) */}
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8">
            <h3 className="font-bold text-slate-900">{home.audience.title}</h3>
            <div className="mt-4 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {home.audience.items.map((audience) => (
                <div
                  key={audience}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700"
                >
                  <Icon name="school" className="h-4 w-4 text-brand-600" />
                  {audience}
                </div>
              ))}
            </div>
            <p className="mt-4 text-sm text-slate-500">
              Every school starts with a walkthrough tailored to its level and size —{" "}
              <Link href={cta.demoHref} className="font-medium text-brand-700 underline">
                request yours
              </Link>
              .
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section data-reveal className="border-y border-slate-100 bg-slate-50" aria-labelledby="how-heading">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeader
            eyebrow="How it works"
            title="From first call to daily use in five steps"
          />
          <div className="mt-10">
            <StepsList steps={howItWorksSteps} />
          </div>
          <div className="mt-8 text-center">
            <ButtonLink href="/how-it-works" variant="outline">
              See the full process
              <Icon name="arrow-right" className="h-4 w-4" />
            </ButtonLink>
          </div>
        </div>
      </section>

      {/* ── Pricing preview ───────────────────────────────────────── */}
      <div data-reveal>
        <PricingSection />
      </div>

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section data-reveal className="border-y border-slate-100 bg-slate-50" aria-labelledby="faq-heading">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeader
            eyebrow="FAQ"
            title="Questions schools ask us"
            description="Can't find your answer? Send us a message — we reply quickly."
          />
          <div className="mt-10">
            <FaqList items={generalFaqs.slice(0, 6)} />
          </div>
          <div className="mt-6 text-center">
            <Link
              href="/faq"
              className="font-semibold text-brand-700 hover:text-brand-800"
            >
              View all questions
            </Link>
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────── */}
      <div className="py-16 sm:py-20">
        <CtaBanner
          title="Ready to see SkulSuite in action?"
          description="Book a demo tailored to your school. We'll walk you through the products with your school's context in mind."
        />
      </div>
    </>
  );
}
