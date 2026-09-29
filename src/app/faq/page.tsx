import type { Metadata } from "next";
import Link from "next/link";
import { generalFaqs } from "@/data/faq";
import { buildMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/SectionHeader";
import { FaqList } from "@/components/FaqList";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = buildMetadata({
  title: "Frequently Asked Questions",
  description:
    "Answers to common questions about SkulSuite products, demos, pricing, setup and training for schools.",
  path: "/faq",
});

export default function FaqPage() {
  return (
    <>
      <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionHeader
          eyebrow="FAQ"
          title="Frequently asked questions"
          description="Everything schools usually ask before starting. Your question not covered? Contact us — we reply quickly."
        />
        <div className="mt-10">
          <FaqList items={generalFaqs} />
        </div>
        <p className="mt-8 text-center text-sm text-slate-600">
          Still have questions?{" "}
          <Link href="/contact" className="font-semibold text-brand-700 hover:text-brand-800">
            Contact us
          </Link>{" "}
          or{" "}
          <Link href="/demo" className="font-semibold text-brand-700 hover:text-brand-800">
            request a demo
          </Link>
          .
        </p>
      </section>

      <div className="pb-16 sm:pb-20">
        <CtaBanner
          title="See the answers live"
          description="A demo answers most questions faster than any FAQ — book yours now."
        />
      </div>
    </>
  );
}
