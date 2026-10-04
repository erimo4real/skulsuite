/**
 * Offline vs Online editions — visitor-facing content for /offline.
 *
 * Honesty rules (docs/MASTER-PLAN.md §3 #12): every capability named here is
 * an audited product fact (docs/PRODUCT-AUDIT.md), and every Naira figure
 * comes verbatim from the official price list (src/data/pricing-table.ts).
 * Nothing about the offline edition is invented or promised.
 */

export interface EditionFeature {
  /** Plain capability, e.g. "CBT exams". */
  feature: string;
  /** What it looks like on the offline edition. */
  offline: string;
  /** What it looks like on the online (hosted) edition. */
  online: string;
}

/** Side-by-side comparison — the core of the page. */
export const editionComparison: EditionFeature[] = [
  {
    feature: "CBT exams",
    offline:
      "Runs on the school's own network — exam computers (and phones) talk to a server computer inside the school. No internet needed on exam day.",
    online:
      "Runs on cloud servers. Students can take exams from anywhere with internet, and nothing is stored on school computers.",
  },
  {
    feature: "Question Bank",
    offline:
      "Stored on the school's own server computer. Teachers add and organise questions exactly the same way.",
    online:
      "Stored in the cloud and reachable from anywhere, including from teachers' homes.",
  },
  {
    feature: "School records & report cards",
    offline:
      "Kept on the school's server computer, with daily backups to an external drive that the school keeps.",
    online:
      "Kept on cloud servers with professional backups — safe even if school computers fail.",
  },
  {
    feature: "Parents' portal",
    offline:
      "Parents view results on the school's network only (for example, when visiting the school).",
    online:
      "Parents follow results, attendance and notices from anywhere, on their phones.",
  },
  {
    feature: "Fees & payments",
    offline:
      "Fee records are kept in the system on the school's server; money itself is handled by the school as usual.",
    online:
      "The same fee records, plus the school can be paid and confirmed digitally as its processes allow.",
  },
  {
    feature: "Internet needed",
    offline:
      "None for day-to-day use. A short phone-hotspot session (about once a month) handles updates, licence checks and backups.",
    online:
      "Yes — staff, students and parents need internet whenever they use the system.",
  },
  {
    feature: "Works during network outages",
    offline:
      "Yes — exams, attendance and records keep working while the internet is down.",
    online:
      "No — when the internet is down, the system is unreachable until it returns.",
  },
  {
    feature: "Where the data lives",
    offline:
      "Inside the school, on its own server computer — the school holds it physically.",
    online:
      "On managed cloud servers, reachable from anywhere and professionally maintained.",
  },
];

/** What a school needs for the offline edition — plain-language requirements. */
export interface OfflineRequirement {
  item: string;
  detail: string;
}

export const offlineRequirements: OfflineRequirement[] = [
  {
    item: "One server computer",
    detail:
      "A single dedicated computer (even a normal desktop) holds the software and the school's data. It does not need to be powerful or new.",
  },
  {
    item: "A router or network switch",
    detail:
      "The same Wi-Fi router or network switch many schools already own connects the exam computers and phones to the server. No internet subscription is involved.",
  },
  {
    item: "Power backup for the server",
    detail:
      "A small UPS or inverter on the server computer keeps an exam from stopping mid-way when power cuts. This matters more offline than anything else.",
  },
  {
    item: "One monthly hotspot session",
    detail:
      "About once a month, someone connects the server to a phone hotspot for a few minutes — that handles software updates, licence checks and an off-site backup copy.",
  },
  {
    item: "An external backup drive",
    detail:
      "A cheap external drive kept in the school office holds a daily backup copy, so records survive even a failed computer.",
  },
];

/**
 * Cost structure — real figures from the official price list only.
 * The offline edition removes hosting/domain (hostingTiers are labelled
 * "online version only" in the price list) and adds setup, which is already
 * a listed fee ("Setup and offline installation — one school site").
 */
export interface OfflineCostLine {
  item: string;
  offline: string;
  online: string;
  note?: string;
}

export const costStructure: OfflineCostLine[] = [
  {
    item: "Software licence",
    offline: "Same as the online version — per size, termly or one-time ownership",
    online: "Same as the offline version",
    note: "Licence prices are identical; only the delivery differs.",
  },
  {
    item: "Setup & offline installation (one school site)",
    offline: "₦50,000 one-time",
    online: "Included in online setup",
    note: "Official price list, one-time fees.",
  },
  {
    item: "Student records data migration",
    offline: "₦30,000 one-time (if needed)",
    online: "₦30,000 one-time (if needed)",
    note: "Official price list, one-time fees.",
  },
  {
    item: "Staff training session",
    offline: "₦20,000 one-time",
    online: "₦20,000 one-time",
    note: "Official price list, one-time fees.",
  },
  {
    item: "Yearly cloud hosting",
    offline: "None — needs no hosting",
    online: "₦130,000 – ₦525,000 / year by size",
    note: "Official price list marks hosting 'online version only'; rates follow the dollar and are updated on the pricing page.",
  },
  {
    item: "Domain name (yearly)",
    offline: "None — no web address needed",
    online: "₦40,000 / year",
    note: "Official price list.",
  },
  {
    item: "Optional yearly support & updates (ownership purchase)",
    offline: "20% of the purchase price per year",
    online: "20% of the purchase price per year",
    note: "Official price list, ownership terms. Termly licences include support while active.",
  },
];

/** Frequently asked questions about the offline edition (also fed to Ero). */
export const offlineFaqs: { question: string; answer: string }[] = [
  {
    question: "Can SkulSuite really run without internet?",
    answer:
      "Yes. The offline edition runs on the school's own network: one server computer plus the router the school already has. Exams, attendance, records and report cards all work without any internet. About once a month, a short phone-hotspot session handles updates, licence checks and backups.",
  },
  {
    question: "How do CBT exams work offline on exam day?",
    answer:
      "The exam computers and phones connect to the school's server through the school's own network — no internet involved. Students answer on screen with autosave, questions can be shuffled per student, and objective scores appear the moment each student submits, exactly as on the online edition.",
  },
  {
    question: "If there's no internet, how do parents see results?",
    answer:
      "On the offline edition, parents see results when they visit the school, and the school prints report cards as usual. If parents following results from home is important to your school, the online edition (or moving online later) is the better fit.",
  },
  {
    question: "What happens if we start offline and want to go online later?",
    answer:
      "Your records move with you. Both editions are the same products — the offline edition simply keeps the data on a school server instead of cloud servers. Schools often start offline and add the online edition when they're ready; we migrate the data during setup.",
  },
  {
    question: "Does the offline edition cost less?",
    answer:
      "It removes the yearly cloud hosting and domain fees (₦130,000–₦525,000 + ₦40,000 a year online), and adds the one-time ₦50,000 setup and offline installation fee. Software licence prices are the same. See the cost comparison above for the full picture.",
  },
  {
    question: "What does the school need to provide?",
    answer:
      "One computer to act as the server, the router or switch the school likely already owns, power backup (a small UPS) for that server, and an external drive for daily backups. We handle installation, configuration and staff training.",
  },
  {
    question: "Who installs and trains our staff?",
    answer:
      "We do — that's what the setup and offline installation fee covers, at one school site. A staff training session (₦20,000) gets your teachers confident from day one.",
  },
  {
    question: "Is our data safe on one computer?",
    answer:
      "It's protected two ways: the system keeps a daily backup copy on an external drive the school holds, and the monthly hotspot session also sends an off-site backup copy. The school owns its data in both editions.",
  },
];
