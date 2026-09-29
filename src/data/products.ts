import type { Product } from "./product-types";

/**
 * ✅ AUDITED CONTENT (docs/PRODUCT-AUDIT.md, September 2026).
 * Every feature below was verified in the product source code
 * (Next.js ERP: cbt/*, question-bank/*, students/fees/attendance/exams modules).
 * New claims must go through the same audit before being added.
 */
export const products: Product[] = [
  {
    id: "cbt",
    slug: "cbt",
    name: "CBT Examination System",
    shortName: "CBT",
    icon: "monitor",
    accent: "brand",
    tagline:
      "Conduct school examinations on computer — with controlled timing, automatic marking and results the moment students submit.",
    summary:
      "A computer-based testing platform for schools: schedule exams, seat students at computers or phones, and collect scores without the delays of paper.",
    problem: [
      "Paper exams cost money and preparation time for every single test.",
      "Manual marking delays results by days or weeks after the exam.",
      "Question papers circulate before exam day, and timing is hard to keep fair.",
    ],
    solution:
      "The CBT system moves your examinations onto computers — or students' phones. Questions come straight from your Question Bank, each exam runs on its own countdown that submits itself when time is up, objective questions are scored instantly, and teachers grade theory answers in a simple queue. Exam week runs calmer and results come out the same day.",
    features: [
      {
        title: "Student exam interface",
        description:
          "A focused question-by-question screen with answers saved automatically as students work — even on unreliable connections.",
        verification: "verified",
      },
      {
        title: "MCQ, True/False & Theory",
        description:
          "Objective questions are scored the moment an exam is submitted; theory answers go to teachers for grading.",
        verification: "verified",
      },
      {
        title: "Countdown with auto-submit",
        description:
          "Every exam runs on its own timer. When time is up, the exam submits itself — no disputes, no extra time.",
        verification: "verified",
      },
      {
        title: "Scheduled exam windows",
        description:
          "Set exactly when an exam opens and closes, so every class sits the exam under the same conditions.",
        verification: "verified",
      },
      {
        title: "Shuffled questions per student",
        description:
          "Optionally shuffle question order for each student, making answer copying far harder.",
        verification: "verified",
      },
      {
        title: "Duration & pass marks",
        description:
          "Configure each exam's duration and pass mark — from a 5-minute quiz to a 5-hour paper.",
        verification: "verified",
      },
      {
        title: "Theory grading queue",
        description:
          "Teachers grade written answers in one organised screen and final scores update automatically.",
        verification: "verified",
      },
      {
        title: "Instant results",
        description:
          "Objective scores appear as soon as a student submits — students see their result immediately.",
        verification: "verified",
      },
      {
        title: "Works on phones too",
        description:
          "A mobile exam mode means schools without a full computer lab can still run CBT.",
        verification: "verified",
      },
    ],
    howItWorks: [
      {
        title: "Pick questions from the bank",
        description:
          "Choose MCQ, True/False and theory questions from your Question Bank for the exam.",
      },
      {
        title: "Configure the exam",
        description:
          "Set the duration, pass mark, question shuffling and the opening window.",
      },
      {
        title: "Students take the exam",
        description:
          "On computers or phones, answers save automatically as students type.",
      },
      {
        title: "Scored on submit",
        description:
          "Objectives are marked instantly; teachers grade theory in the queue.",
      },
    ],
    benefits: [
      "Cut printing and logistics costs for every test",
      "Results the same day — objectives scored instantly",
      "Shuffled questions and timed windows keep exams fair",
      "Students practise for external computer-based exams",
      "Phones work too — no computer lab required",
    ],
    audience: [
      "Primary schools",
      "Secondary schools",
      "Examination officers",
      "Proprietors & administrators",
      "Colleges & tutorial centres",
    ],
    faq: [
      {
        question: "How does CBT work in practice?",
        answer:
          "Staff pick questions from the Question Bank and set the duration, pass mark and exam window. Students sign in on a computer or phone, answer on screen with autosave, and submit — objective questions are scored instantly.",
      },
      {
        question: "Do we need a computer lab?",
        answer:
          "No — there's a mobile exam mode, so students can take CBT exams on phones. Schools with labs can use those; schools without them aren't excluded.",
      },
      {
        question: "What happens if the internet drops mid-exam?",
        answer:
          "Answers are saved automatically as students work, and the screen warns clearly if a save fails so the student can retry — an interruption doesn't lose their work.",
      },
      {
        question: "How are theory questions marked?",
        answer:
          "Written answers go to a grading queue where teachers score them; final totals combine the instant objective scores with teacher-graded theory marks.",
      },
      {
        question: "Can exams be scheduled in advance?",
        answer:
          "Yes — each exam has an opening and closing window, and a countdown that auto-submits at zero, so every student gets the same conditions.",
      },
    ],
    seo: {
      title: "CBT Examination System for Schools",
      description:
        "Run school exams on computer or phone with SkulSuite CBT: timed exams with auto-submit, per-student shuffling, instant objective scoring and a theory grading queue.",
    },
  },
  {
    id: "question-bank",
    slug: "question-bank",
    name: "Question Bank",
    shortName: "Question Bank",
    icon: "database",
    accent: "violet",
    tagline:
      "Build, organise and reuse your school's examination questions — all in one place.",
    summary:
      "A question bank for teachers: create questions once with topics, difficulty and marks, organise them by subject and class, and reuse them in CBT exams and printed papers.",
    problem: [
      "Questions live in teachers' heads, exercise books and old files.",
      "Every teacher rebuilds the same questions from scratch each term.",
      "There's no way to see question quality or coverage across a subject.",
    ],
    solution:
      "The Question Bank gives your school one organised home for its questions. Teachers create MCQ, True/False and theory questions tagged with subject, class, topic and difficulty — then pull them straight into CBT exams or printable exam papers whenever they're needed.",
    features: [
      {
        title: "Create & edit questions",
        description:
          "A purpose-built editor for every question — refine and improve them over time.",
        verification: "verified",
      },
      {
        title: "MCQ, True/False & Theory",
        description:
          "Multiple-choice with flagged correct answers, true/false, and written theory questions.",
        verification: "verified",
      },
      {
        title: "Organised by subject & class",
        description:
          "Every question belongs to a subject and class, so anyone can find what they need.",
        verification: "verified",
      },
      {
        title: "Topics & difficulty",
        description:
          "Tag questions by topic and difficulty to see coverage across a subject.",
        verification: "verified",
      },
      {
        title: "Marks & explanations",
        description:
          "Assign marks per question and store model explanations for revision.",
        verification: "verified",
      },
      {
        title: "Feeds straight into CBT",
        description:
          "Questions from the bank are selected directly when building CBT exams.",
        verification: "verified",
      },
      {
        title: "Printable exam papers",
        description:
          "Compose exam papers from bank questions and print them when paper is still needed.",
        verification: "verified",
      },
    ],
    howItWorks: [
      {
        title: "Add questions",
        description:
          "Teachers create questions with options, correct answers, marks and explanations.",
      },
      {
        title: "Organise them",
        description:
          "Questions are tagged by subject, class, topic and difficulty automatically.",
      },
      {
        title: "Review & improve",
        description:
          "Anyone with access can open and refine a question — nothing is locked in files.",
      },
      {
        title: "Reuse everywhere",
        description:
          "Pull questions into CBT exams or compose printable exam papers from the bank.",
      },
    ],
    benefits: [
      "Your school's questions stay with the school",
      "Exam preparation gets faster every term",
      "Topic and difficulty tags reveal coverage gaps",
      "The same bank powers CBT exams and printed papers",
    ],
    audience: [
      "Subject teachers",
      "Heads of department",
      "Examination officers",
      "Primary & secondary schools",
    ],
    faq: [
      {
        question: "Who adds questions to the bank?",
        answer:
          "The Question Bank is built for teachers — each teacher can add and edit questions for their subjects through a simple editor.",
      },
      {
        question: "Does it work with the CBT system?",
        answer:
          "Yes — CBT exams are built by selecting questions directly from the bank. They're designed as one workflow, not two separate products.",
      },
      {
        question: "Can we still print paper exams?",
        answer:
          "Yes — there's a paper builder that composes printable exam papers from bank questions, with a print-ready layout.",
      },
      {
        question: "What question types are supported?",
        answer:
          "Multiple-choice with flagged correct answers, True/False, and theory questions with model explanations — each with configurable marks.",
      },
    ],
    seo: {
      title: "School Question Bank",
      description:
        "SkulSuite Question Bank lets teachers create, organise and reuse MCQ, True/False and theory questions by subject, class, topic and difficulty — feeding CBT exams and printable papers.",
    },
  },
  {
    id: "school-management",
    slug: "school-management",
    name: "School Management System",
    shortName: "School Management",
    icon: "school",
    accent: "emerald",
    tagline:
      "One system for students, staff, classes, attendance, results, fees and school records.",
    summary:
      "A school management system that keeps administrative and academic operations digital — from admission and attendance to results, fees and report cards.",
    problem: [
      "Student and staff records are scattered across files and spreadsheets.",
      "Compiling results and report cards takes weeks at the end of every term.",
      "Fees, attendance and academic records are hard to reconcile.",
    ],
    solution:
      "The School Management System keeps your school's core operations in one place — student and staff records, classes and subjects, timetables, attendance, exams and marks, fees and notices — with printable report cards and a parent portal, so the whole school runs on accurate, up-to-date information instead of paperwork.",
    features: [
      {
        title: "Student records",
        description:
          "One organised record per student — profile, class and full history in the system.",
        verification: "verified",
      },
      {
        title: "Staff directory",
        description:
          "Teacher and non-teaching staff information in the same system.",
        verification: "verified",
      },
      {
        title: "Classes, subjects & sessions",
        description:
          "Your school's structure: classes, sections, subjects and academic sessions.",
        verification: "verified",
      },
      {
        title: "Timetable",
        description:
          "A digital timetable so everyone knows where and when learning happens.",
        verification: "verified",
      },
      {
        title: "Attendance",
        description:
          "Mark and review attendance digitally — including from teachers' phones.",
        verification: "verified",
      },
      {
        title: "Exams & marks",
        description:
          "Record per-subject marks, control publishing, and compute results automatically.",
        verification: "verified",
      },
      {
        title: "Printable report cards",
        description:
          "Generate and print a student's report card when results are published.",
        verification: "verified",
      },
      {
        title: "Fees",
        description:
          "Set up fee types, record payments, and see who owes what at any time.",
        verification: "verified",
      },
      {
        title: "Notices",
        description:
          "Publish school notices that staff and parents see in their own portals.",
        verification: "verified",
      },
      {
        title: "Parent portal",
        description:
          "Parents follow their children's results, attendance and school notices.",
        verification: "verified",
      },
      {
        title: "Roles & audit trail",
        description:
          "Role-based access for staff, with an audit log of changes to records.",
        verification: "verified",
      },
    ],
    howItWorks: [
      {
        title: "Set up your school",
        description:
          "Configure sessions, classes, sections, subjects and staff in the system.",
      },
      {
        title: "Enrol students",
        description:
          "Move your records in so everything starts from one source of truth.",
      },
      {
        title: "Run daily operations",
        description:
          "Attendance, marks and fee payments are recorded as school work happens.",
      },
      {
        title: "Report & publish",
        description:
          "Publish results, print report cards, and keep parents in the loop.",
      },
    ],
    benefits: [
      "One source of truth for the whole school",
      "Report cards printed in minutes at term end",
      "Fee status always visible — no end-of-term surprises",
      "Parents follow their children's progress themselves",
      "Every change to records is logged",
    ],
    audience: [
      "School owners & proprietors",
      "Administrators & bursars",
      "Principals & head teachers",
      "Class teachers",
      "Parents (via the portal)",
    ],
    faq: [
      {
        question: "Which parts of the school does it cover?",
        answer:
          "Student and staff records, classes and subjects, timetables, attendance, exams and marks, fees, notices, and printable report cards — plus a parent portal and an audit log.",
      },
      {
        question: "Do we have to use every module?",
        answer:
          "No — schools adopt the parts they need first (most start with students, attendance and exams) and expand to fees, library and the rest later.",
      },
      {
        question: "Can parents see their children's results?",
        answer:
          "Yes — there's a parent portal where parents follow their children's results, attendance and school notices.",
      },
      {
        question: "Who in the school can access it?",
        answer:
          "Access is role-based — administrators, teachers and bursars see what their work requires, and changes to records are written to an audit log.",
      },
      {
        question: "Does it work with the CBT system?",
        answer:
          "Yes — it's one platform: the same students, classes and subjects flow straight into CBT examinations.",
      },
    ],
    seo: {
      title: "School Management System",
      description:
        "SkulSuite School Management System keeps students, staff, classes, timetables, attendance, exams, fees, notices and printable report cards digital in one place — with a parent portal.",
    },
  },
];

export function getProduct(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}
