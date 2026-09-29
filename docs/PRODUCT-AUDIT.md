# PRODUCT AUDIT — SkulSuite

> ✅ **STATUS: CODE-LEVEL AUDIT COMPLETE (September 2026).**
> The three products were located and audited in the owner's local repository:
> `../Smart School Management System  An end toend School ERP System for Every School Need/web`
> (Next.js + TypeScript + SQLite, 32-table schema, REST APIs, mobile endpoints).
>
> Every feature below was verified **in code** — file references included.
> Runtime QA (clicking through the live app) and screenshots are still the
> owner's to capture before public launch.

---

## Key finding: the products are one integrated platform

The three marketed products are modules of a single ERP:

| Marketed product | Modules found in code |
|---|---|
| CBT Examination System | `cbt/*` (create → take → grade), `/mobile/cbt/*` |
| Question Bank | `question-bank/*`, `questions` APIs, `question_bank` + `question_options` tables |
| School Management System | students, staff, academics, attendance, exams, fees, library, notices, timetable, settings |

They share one database and auth (session cookie gate in `middleware.ts`), so
the website's "works as a suite" claims are accurate.

---

## Product 1 — CBT Examination System

### ✅ Verified in code

| Feature | Evidence |
|---|---|
| Student exam interface (question-by-question, autosaved answers) | `cbt/[id]/take/take-screen.tsx` |
| MCQ, True/False **and** Theory question types | `take-screen.tsx` type union; `question-form.tsx` |
| Countdown timer with **auto-submit at zero** | `take-screen.tsx` (`deadlineMs`, submit effect) |
| Per-student question shuffling | `new-cbt-form.tsx` (`shuffle` flag) |
| Exam scheduling window (opens/closes) | `new-cbt-form.tsx` datetime fields |
| Configurable duration (5–300 min) and pass mark | `new-cbt-form.tsx` |
| Instant objective scoring on submit (`objective` / `theoryPending` / `final`) | `api/cbt/submit/route.ts`, result screen |
| Theory grading workflow for teachers | `cbt/[id]/grade/page.tsx`, `api/cbt/grade/route.ts` |
| Exam status controls (draft/publish states) | `cbt/[id]/status-buttons.tsx` |
| Debounced autosave with reconnect warning | `take-screen.tsx` (`setNetError`) |
| Mobile CBT (students can take exams on phones) | `api/mobile/cbt/*` (start/answer/submit) |

### Marketing copy now on the site (updated to match)

All CBT features in `src/data/products.ts` were rewritten from this audit and
marked `verified`. Removed: nothing — every placeholder claim existed; several
were made more specific (e.g. "True/False" added).

---

## Product 2 — Question Bank

### ✅ Verified in code

| Feature | Evidence |
|---|---|
| Create & edit questions | `question-bank/new`, `question-bank/[id]/edit`, `api/questions` (POST/PUT) |
| Question types: MCQ, True/False, Theory | `question-form.tsx` |
| Organise by subject **and** class | subject/class selects bound in `question-form.tsx` |
| Topic tags and difficulty levels | `topic`, `difficulty` fields |
| Marks per question + explanations | `marks`, `explanation` fields |
| Options with correct-answer flags | `question_options` table |
| Reuse: questions feed CBT exams | `cbt_exam_questions` table linking exams ↔ bank |
| Paper builder (printable exam papers from bank) | `papers/*`, `exam_papers` + `exam_paper_questions`, print page |

---

## Product 3 — School Management System

### ✅ Verified in code (by module)

| Module | Evidence | Notes |
|---|---|---|
| Students (records, profiles, admission) | `students/*`, `students` table | ✅ |
| Staff directory | `staff/page.tsx`, `staff` table | ✅ |
| Classes, sections, subjects, academic sessions | `academics/*`, 5 tables | ✅ |
| Timetable | `academics/timetable`, `timetable_slots` | ✅ |
| Attendance (mark + review) | `attendance/*`, `api/attendance`, `mobile/attendance` | ✅ |
| Exams & marks (per-subject, publish flow) | `exams/*`, `api/exams/*`, `marks`, `exam_results` | ✅ |
| Student report cards (printable) | `exams/[id]/report/[studentId]` + print button | ✅ |
| Fees (setup, collection, dues tracking) | `fees/*`, `api/fees/payments`, 4 tables | ✅ |
| Library (catalog, issue/return) | `library/*`, books tables | ✅ (not yet marketed — add later if desired) |
| Notices | `notices/page.tsx`, `mobile/notices` | ✅ |
| Parent/student portal ("my") | `my/page.tsx`, `api/mobile/children` | ✅ |
| Role-based auth + audit log | `middleware.ts`, `users`, `audit_logs` | ✅ |

---

## ⚠️ Not yet done (owner actions before launch)

1. **Runtime QA** — the audit verified code, not a live run. Click through:
   create exam → take as student → grade theory → results.
2. **Screenshots** — folders are ready:
   - `public/screenshots/cbt/`
   - `public/screenshots/question-bank/`
   - `public/screenshots/school-management/`
   Drop PNGs in (filename order = display order) + optional `captions.json`
   for alt text. Galleries render automatically at build.
3. **Pricing** — still "Contact us for pricing" (correct until confirmed).
4. **Contacts** — WhatsApp number / email / phone not yet configured.
5. **Deployment story** — confirm cloud vs. school-server hosting per school
   (the app is self-hostable Next.js + SQLite).

## Content rules enforced

- All marketing features in `src/data/products.ts` now carry
  `verification: "verified"` **only** where evidence exists above; anything
  new must go through the same audit before being added.
- No testimonials/stats/customers are claimed anywhere.
