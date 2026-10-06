import type { Metadata } from "next";
import { getLiveHosting, hostingAmounts } from "@/lib/hosting-live";
import { hostingTiers } from "@/data/pricing-table";
import { buildMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/SectionHeader";
import { PackageFinder } from "@/components/PackageFinder";
import type { SchoolSize } from "@/lib/pricing-engine";

export const metadata: Metadata = buildMetadata({
  title: "Find My Package",
  description:
    "Answer 4 quick questions and get the right SkulSuite package for your school — with a real price from the official price list. Takes under a minute.",
  path: "/find-my-package",
});

export default function FindMyPackagePage() {
  // Live hosting numbers are read server-side (fs stays out of the browser).
  const liveHosting = getLiveHosting();
  const hostingAmountsFor: Record<SchoolSize, number> = Object.fromEntries(
    hostingTiers.map((t) => [
      t.size,
      liveHosting?.tiers?.[t.size]?.hosting ?? t.hosting,
    ]),
  ) as Record<SchoolSize, number>;

  return (
    <section className="mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
      <SectionHeader
        eyebrow="Find my package"
        title="The right package in under a minute"
        description="Four quick questions — no forms, no hunting. You'll see the package we recommend with the real price, straight from the official price list."
      />
      <div className="mt-10">
        <PackageFinder hosting={hostingAmountsFor} domain={hostingTiers[0].domain} />
      </div>
      <p className="mt-6 text-center text-sm text-slate-500">
        Prefer to look at everything first?{" "}
        <a href="/pricing" className="font-semibold text-brand-700 hover:text-brand-800">
          See the full pricing page
        </a>
        .
      </p>
    </section>
  );
}
