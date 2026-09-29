import type { IconName } from "@/components/Icon";

/**
 * Homepage copy. Kept in the data layer so content edits never touch UI
 * components (PRD Phase 16). Problems and benefits describe school pain
 * points and product outcomes — no fabricated customers, statistics or
 * testimonials (PRD §17).
 */
export const home = {
  hero: {
    eyebrow: "For schools of every size",
    title: "Digital solutions built for modern schools",
    description:
      "Manage your school, build your question bank and run computer-based examinations with practical software designed for schools like yours.",
  },
  problems: {
    eyebrow: "The challenges schools face",
    title: "The problems we solve",
    description:
      "Schools run on paperwork — exams, records and questions that slow everything down. SkulSuite replaces that paperwork with software that fits the way your school already works.",
    items: [
      {
        icon: "book-open" as IconName,
        title: "Exams are slow and expensive to run",
        description:
          "Printing, scheduling and marking paper exams takes weeks and costs money every term — for every single test.",
      },
      {
        icon: "users" as IconName,
        title: "Records live in files and spreadsheets",
        description:
          "Student, staff and fee records scattered across cabinets and sheets are easy to lose and hard to trust.",
      },
      {
        icon: "archive" as IconName,
        title: "Questions disappear when teachers move on",
        description:
          "Questions written in exercise books and old files can't be organised, reviewed or reused by the school.",
      },
    ],
  },
  benefits: {
    eyebrow: "Why SkulSuite",
    title: "What your school gains",
    items: [
      "Faster exam preparation and delivery",
      "Results ready in minutes, not weeks",
      "School records organised in one place",
      "Questions preserved and reusable term after term",
      "Students get comfortable with computer-based testing",
      "Clear information for better school decisions",
    ],
  },
  audience: {
    title: "Built for schools",
    items: [
      "Primary schools",
      "Secondary schools",
      "School owners & proprietors",
      "Administrators",
      "Teachers",
      "Examination officers",
    ],
  },
} as const;
