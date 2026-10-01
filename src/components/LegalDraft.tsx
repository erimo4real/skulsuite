import type { ReactNode } from "react";
import { SectionHeader } from "./SectionHeader";

/**
 * Shared layout for the draft legal pages (build prompt §3 and §14).
 * Every legal page is clearly marked as a DRAFT for review by a Nigerian
 * lawyer — we never present it as approved legal text, and any detail the
 * owner has not confirmed yet stays a visible placeholder.
 */

export function LegalDraftBanner() {
  return (
    <div className="mt-8 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
      <strong className="font-bold">Draft for review.</strong> This is a plain-language draft
      for our lawyer to review — it is not approved legal text yet. If anything here differs
      from what we agree with you directly, the conversation wins.
    </div>
  );
}

export function LegalPageShell({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="mx-auto max-w-3xl px-4 py-14 sm:px-6 sm:py-20">
      <SectionHeader eyebrow={eyebrow} title={title} description={description} />
      <LegalDraftBanner />
      <div className="mt-10 space-y-8 text-sm leading-6 text-slate-700 [&_h2]:mt-8 [&_h2]:text-base [&_h2]:font-bold [&_h2]:text-slate-900 [&_p]:mt-3">{children}</div>
    </section>
  );
}
