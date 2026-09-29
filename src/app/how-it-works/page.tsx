import type { Metadata } from "next";
import { howItWorksSteps, demoExpectations } from "@/data/how-it-works";
import { buildMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/SectionHeader";
import { StepsList } from "@/components/StepsList";
import { CtaBanner } from "@/components/CtaBanner";
import { Icon } from "@/components/Icon";
import { cta } from "@/data/site";
import { ButtonLink } from "@/components/Button";

export const metadata: Metadata = buildMetadata({
  title: "How It Works",
  description:
    "How schools start with SkulSuite: choose a solution, request a demo, set up your school, train your staff and start using the system.",
  path: "/how-it-works",
});

export default function HowItWorksPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionHeader
          eyebrow="How it works"
          title="From first call to daily use, in five steps"
          description="No long procurement maze — a clear path from choosing a product to running your school on it."
        />
        <div className="mt-10">
          <StepsList steps={howItWorksSteps} />
        </div>
        <div className="mt-10 text-center">
          <ButtonLink href={cta.demoHref} size="lg">
            {cta.demo}
          </ButtonLink>
        </div>
      </section>

      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeader
            eyebrow="Your demo"
            title="What to expect in a demo"
          />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {demoExpectations.map((item) => (
              <div
                key={item.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                  <Icon name="check" strokeWidth={2.5} />
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

      <div className="py-16 sm:py-20">
        <CtaBanner
          title="Start with step two"
          description="Request a demo today — we'll handle the rest with you, one step at a time."
        />
      </div>
    </>
  );
}
