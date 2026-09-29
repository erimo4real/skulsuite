"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { formEndpoint, whatsappNumber } from "@/lib/env";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { Button } from "./Button";
import { WhatsAppButton } from "./WhatsAppButton";
import { Icon } from "./Icon";

export type ProductChoice = "cbt" | "question-bank" | "school-management" | "all";

const PRODUCT_OPTIONS: { value: ProductChoice; label: string }[] = [
  { value: "all", label: "All Products" },
  { value: "cbt", label: "CBT Examination System" },
  { value: "question-bank", label: "Question Bank" },
  { value: "school-management", label: "School Management System" },
];

const ROLES = [
  "Proprietor / Owner",
  "Administrator",
  "Principal / Head Teacher",
  "Teacher",
  "Examination Officer",
  "ICT Administrator",
  "Other",
];

const STUDENT_COUNTS = ["Under 100", "100 – 300", "300 – 700", "700 – 1,500", "1,500+"];

interface FormValues {
  name: string;
  school: string;
  phone: string;
  email: string;
  role: string;
  product: ProductChoice;
  students: string;
  message: string;
}

const EMPTY: FormValues = {
  name: "",
  school: "",
  phone: "",
  email: "",
  role: "",
  product: "all",
  students: "",
  message: "",
};

type Errors = Partial<Record<keyof FormValues, string>>;

function validate(values: FormValues): Errors {
  const errors: Errors = {};
  if (!values.name.trim()) errors.name = "Please enter your full name.";
  if (!values.school.trim()) errors.school = "Please enter your school's name.";
  if (!/^[+\d][\d\s-]{6,}$/.test(values.phone.trim()))
    errors.phone = "Please enter a valid phone number.";
  if (!/^\S+@\S+\.\S+$/.test(values.email.trim()))
    errors.email = "Please enter a valid email address.";
  return errors;
}

/** Human-readable summary used for the WhatsApp fallback handoff. */
function buildSummary(values: FormValues): string {
  const product =
    PRODUCT_OPTIONS.find((o) => o.value === values.product)?.label ?? "All Products";
  const lines = [
    "Hello, I would like to request a demo of your school software products.",
    "",
    `Name: ${values.name}`,
    `School: ${values.school}`,
    `Phone: ${values.phone}`,
    `Email: ${values.email}`,
    `Role: ${values.role || "—"}`,
    `Product: ${product}`,
    `Students: ${values.students || "—"}`,
  ];
  if (values.message.trim()) lines.push(`Message: ${values.message}`);
  return lines.join("\n");
}

const inputClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100";

const labelClass = "block text-sm font-medium text-slate-700";

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1.5 text-sm text-red-600">
      {message}
    </p>
  );
}

export function LeadForm({
  defaultProduct,
  title = "Request a Demo",
  description = "Tell us about your school and we'll arrange a walkthrough at a time that suits you.",
  submitLabel = "Request a Demo",
}: {
  defaultProduct?: ProductChoice;
  title?: string;
  description?: string;
  submitLabel?: string;
}) {
  const [values, setValues] = useState<FormValues>({ ...EMPTY, product: defaultProduct ?? "all" });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  // Pre-select the product from ?product= links (pricing cards → demo form).
  // Read client-side so the page stays fully static (PRD Phase 12).
  useEffect(() => {
    const param = new URLSearchParams(window.location.search).get("product");
    const valid: ProductChoice[] = ["cbt", "question-bank", "school-management", "all"];
    if (param && (valid as string[]).includes(param)) {
      setValues((v) => ({ ...v, product: param as ProductChoice }));
    }
  }, []);

  const whatsappHref = useMemo(() => buildWhatsAppLink(buildSummary(values)), [values]);
  const hasWhatsApp = Boolean(whatsappNumber);

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setValues((v) => ({ ...v, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const validation = validate(values);
    setErrors(validation);
    if (Object.keys(validation).length > 0) return;

    setStatus("loading");
    trackEvent("demo_submit", { product: values.product });

    try {
      if (formEndpoint) {
        const res = await fetch(formEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json", // required by Formspree's AJAX endpoint
          },
          body: JSON.stringify({ ...values, source: "skulsuite-website" }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        // No endpoint configured yet — simulate a brief send so the UX is real,
        // then open WhatsApp with the structured message as the handoff.
        await new Promise((r) => setTimeout(r, 600));
        if (whatsappHref) window.open(whatsappHref, "_blank", "noopener,noreferrer");
      }
      setStatus("success");
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Icon name="check" className="h-6 w-6" strokeWidth={2.5} />
        </span>
        <h3 className="mt-4 text-xl font-bold text-slate-900">
          Thank you. Your demo request has been received.
        </h3>
        <p className="mt-2 text-slate-600">
          We will contact you shortly to arrange your walkthrough.
        </p>
        <WhatsAppButton
          message={buildSummary(values)}
          label="Chat now instead"
          variant="outline"
          className="mt-5"
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-600">{description}</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="lead-name" className={labelClass}>
            Full name <span className="text-red-600">*</span>
          </label>
          <input
            id="lead-name"
            type="text"
            autoComplete="name"
            className={`${inputClass} mt-1.5`}
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            aria-invalid={Boolean(errors.name)}
            required
          />
          <FieldError message={errors.name} />
        </div>

        <div>
          <label htmlFor="lead-school" className={labelClass}>
            School name <span className="text-red-600">*</span>
          </label>
          <input
            id="lead-school"
            type="text"
            autoComplete="organization"
            className={`${inputClass} mt-1.5`}
            value={values.school}
            onChange={(e) => set("school", e.target.value)}
            aria-invalid={Boolean(errors.school)}
            required
          />
          <FieldError message={errors.school} />
        </div>

        <div>
          <label htmlFor="lead-phone" className={labelClass}>
            Phone number <span className="text-red-600">*</span>
          </label>
          <input
            id="lead-phone"
            type="tel"
            autoComplete="tel"
            placeholder="e.g. 08012345678"
            className={`${inputClass} mt-1.5`}
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            aria-invalid={Boolean(errors.phone)}
            required
          />
          <FieldError message={errors.phone} />
        </div>

        <div>
          <label htmlFor="lead-email" className={labelClass}>
            Email address <span className="text-red-600">*</span>
          </label>
          <input
            id="lead-email"
            type="email"
            autoComplete="email"
            className={`${inputClass} mt-1.5`}
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            aria-invalid={Boolean(errors.email)}
            required
          />
          <FieldError message={errors.email} />
        </div>

        <div>
          <label htmlFor="lead-role" className={labelClass}>
            Your role
          </label>
          <select
            id="lead-role"
            className={`${inputClass} mt-1.5`}
            value={values.role}
            onChange={(e) => set("role", e.target.value)}
          >
            <option value="">Select your role…</option>
            {ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="lead-students" className={labelClass}>
            Number of students
          </label>
          <select
            id="lead-students"
            className={`${inputClass} mt-1.5`}
            value={values.students}
            onChange={(e) => set("students", e.target.value)}
          >
            <option value="">Select a range…</option>
            {STUDENT_COUNTS.map((range) => (
              <option key={range} value={range}>
                {range}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <span className={labelClass}>Product interested in</span>
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          {PRODUCT_OPTIONS.map((option) => (
            <label
              key={option.value}
              className={`flex cursor-pointer items-center gap-2.5 rounded-lg border px-3.5 py-2.5 text-sm transition-colors ${
                values.product === option.value
                  ? "border-brand-500 bg-brand-50 text-brand-800"
                  : "border-slate-300 bg-white text-slate-700 hover:border-slate-400"
              }`}
            >
              <input
                type="radio"
                name="product"
                value={option.value}
                checked={values.product === option.value}
                onChange={() => set("product", option.value)}
                className="h-4 w-4 accent-brand-600"
              />
              {option.label}
            </label>
          ))}
        </div>
      </div>

      <div>
        <label htmlFor="lead-message" className={labelClass}>
          Message
        </label>
        <textarea
          id="lead-message"
          rows={4}
          placeholder="Anything specific you'd like to see in the demo?"
          className={`${inputClass} mt-1.5 resize-y`}
          value={values.message}
          onChange={(e) => set("message", e.target.value)}
        />
      </div>

      {status === "error" ? (
        <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Something went wrong sending your request. Please try again, or reach us on WhatsApp below.
        </p>
      ) : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" size="lg" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : submitLabel}
        </Button>
        {hasWhatsApp ? (
          <WhatsAppButton
            message={buildSummary(values)}
            label="Or send via WhatsApp"
            variant="outline"
            size="lg"
          />
        ) : null}
      </div>

      <p className="text-xs text-slate-500">
        We&apos;ll only use your details to arrange your demo and answer your questions — no spam, ever.
      </p>
    </form>
  );
}
