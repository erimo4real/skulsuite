import type { Metadata } from "next";
import fs from "fs";
import path from "path";
import { buildMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/SectionHeader";
import { CtaBanner } from "@/components/CtaBanner";
import { Icon, type IconName } from "@/components/Icon";
import { ViewTracker } from "@/components/ViewTracker";

export const metadata: Metadata = buildMetadata({
  title: "Resources & Downloads",
  description:
    "Download the SkulSuite price list, product presentations and trial kits for the CBT Examination System, Question Bank and School Management System.",
  path: "/resources",
});

/**
 * A file exists in public/downloads/<file> only when the owner has dropped it
 * in, so download links appear based on real files on disk — never dead links.
 */
function hasFile(file: string): boolean {
  try {
    fs.accessSync(path.join(process.cwd(), "public", "downloads", file));
    return true;
  } catch {
    return false;
  }
}

interface DownloadCard {
  title: string;
  description: string;
  files: { file: string; label: string }[];
  badge: string;
  accent: "brand" | "violet" | "emerald";
}

const cards: DownloadCard[] = [
  {
    title: "Price list (PDF)",
    description:
      "Full official price list: termly licences, ownership (one-time purchase), hosting and domain fees, discounts and terms. Valid until 29 October 2026.",
    files: [{ file: "School-Software-Price-List.pdf", label: "Download the price list (PDF)" }],
    badge: "Official",
    accent: "brand",
  },
  {
    title: "QBank presentations",
    description:
      "The Question Bank walkthrough deck (28 slides) and the AI Assistant deck (9 slides) — the same presentations used in our demos.",
    files: [
      { file: "QBank-Presentation.pdf", label: "QBank walkthrough (PDF)" },
      { file: "QBank-Presentation.pptx", label: "QBank walkthrough (PPTX)" },
      { file: "QBank-AI-Assistant.pdf", label: "AI Assistant deck (PDF)" },
      { file: "QBank-AI-Assistant.pptx", label: "AI Assistant deck (PPTX)" },
    ],
    badge: "Presentations",
    accent: "violet",
  },
  {
    title: "CBT presentation",
    description:
      "A walkthrough of the CBT Examination System: timed exams, instant scoring, theory grading, courses, practice, certificates and built-in AI.",
    files: [
      { file: "CBT-Presentation.pdf", label: "CBT walkthrough (PDF)" },
      { file: "CBT-Presentation.pptx", label: "CBT walkthrough (PPTX)" },
    ],
    badge: "Presentations",
    accent: "brand",
  },
  {
    title: "QBank Trial Kit (installable app)",
    description:
      "The real QBank app to install and try on your own Windows computer — no sign-up, works offline. Includes 12 sample questions (CSV) to import and a 15-minute quick-start guide: sign in, set up your school, import questions, build and print an exam paper.",
    files: [
      { file: "QBank-Trial-Kit.zip", label: "Download the Trial Kit — full app (ZIP, 63 MB)" },
      { file: "QBank-Sample-Questions.csv", label: "Sample questions only (CSV)" },
    ],
    badge: "Hands-on",
    accent: "emerald",
  },
];

const accentClasses: Record<DownloadCard["accent"], { chip: string; icon: string }> = {
  brand: { chip: "bg-brand-50 text-brand-700", icon: "text-brand-600" },
  violet: { chip: "bg-violet-50 text-violet-700", icon: "text-violet-600" },
  emerald: { chip: "bg-emerald-50 text-emerald-700", icon: "text-emerald-600" },
};

function cardIcon(title: string): IconName {
  if (title.includes("Trial")) return "users";
  if (title.includes("presentation") || title.includes("presentations")) return "archive";
  return "archive";
}

export default function ResourcesPage() {
  return (
    <>
      <ViewTracker event="page_view" params={{ page: "resources" }} />

      <section className="mx-auto max-w-6xl px-4 pb-8 pt-14 sm:px-6 sm:pt-20">
        <SectionHeader
          eyebrow="Resources"
          title="Downloads & guides"
          description="Everything you can take away and look at before you talk to us — prices, presentations and a hands-on trial kit. All free, no sign-up required."
        />
      </section>

      <section className="mx-auto max-w-6xl space-y-6 px-4 pb-16 sm:px-6">
        {cards.map((card) => {
          const available = card.files.filter((f) => hasFile(f.file));
          const a = accentClasses[card.accent];
          return (
            <div
              key={card.title}
              className="flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-6 shadow-card sm:flex-row sm:items-start sm:p-8"
            >
              <div
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${a.chip}`}
              >
                <Icon name={cardIcon(card.title)} className={`h-6 w-6 ${a.icon}`} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg font-bold text-slate-900">{card.title}</h2>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${a.chip}`}>
                    {card.badge}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{card.description}</p>
                <div className="mt-4 flex flex-wrap gap-2.5">
                  {available.length > 0
                    ? available.map((f) => (
                        <a
                          key={f.file}
                          href={`/downloads/${f.file}`}
                          download
                          className="inline-flex items-center gap-1.5 rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-brand-700"
                        >
                          <Icon name="check" className="h-4 w-4" strokeWidth={2.5} />
                          {f.label}
                        </a>
                      ))
                    : null}
                  {available.length === 0 ? (
                    <span className="inline-flex items-center rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-500">
                      Coming soon
                    </span>
                  ) : null}
                  {available.length > 0 && available.length < card.files.length ? (
                    <span className="inline-flex items-center rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-500">
                      More formats being added
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <div className="pb-16">
        <CtaBanner
          title="Want a guided tour instead?"
          description="A demo is the fastest way to see the products working with your school's own scenarios."
        />
      </div>
    </>
  );
}
