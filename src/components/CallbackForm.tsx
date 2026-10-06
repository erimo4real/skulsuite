"use client";

import { useMemo, useState, type FormEvent } from "react";
import { formEndpoint, whatsappNumber } from "@/lib/env";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { Button } from "./Button";
import { WhatsAppButton } from "./WhatsAppButton";
import { Icon } from "./Icon";

/**
 * "Call me back" form — build prompt v5 §4: only name and phone, plus an
 * optional best time. Goes to the same form endpoint as the demo form
 * (F8: the request must reach the owner); until an endpoint is configured
 * it hands off to WhatsApp so the request is never lost.
 */

const BEST_TIMES = ["Anytime", "Morning (8am – 12pm)", "Afternoon (12pm – 4pm)", "Evening (4pm – 7pm)"];

export function CallbackForm() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [bestTime, setBestTime] = useState("Anytime");
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const whatsappHref = useMemo(
    () =>
      buildWhatsAppLink(
        [
          "Hello, please call me back about SkulSuite.",
          "",
          `Name: ${name || "—"}`,
          `Phone: ${phone || "—"}`,
          `Best time: ${bestTime}`,
        ].join("\n"),
      ),
    [name, phone, bestTime],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!/^[+\d][\d\s-]{6,}$/.test(phone.trim())) {
      setError("Please enter a valid phone number.");
      return;
    }
    setError(null);
    setStatus("loading");
    trackEvent("cta_click", { location: "callback_form" });

    try {
      if (formEndpoint) {
        const res = await fetch(formEndpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            formType: "callback",
            name,
            phone,
            bestTime,
            source: "skulsuite-website",
          }),
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
      } else {
        // No endpoint yet — never lose the request: open WhatsApp with it.
        await new Promise((r) => setTimeout(r, 500));
        if (whatsappHref) window.open(whatsappHref, "_blank", "noopener,noreferrer");
      }
      setStatus("success");
      window.dispatchEvent(new CustomEvent("ero-celebrate"));
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-6 text-center">
        <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-emerald-600 text-white">
          <Icon name="check" className="h-5 w-5" strokeWidth={2.5} />
        </span>
        <h3 className="mt-3 font-bold text-slate-900">Got it — we&apos;ll call you back.</h3>
        <p className="mt-1 text-sm text-slate-600">
          {bestTime === "Anytime"
            ? "We'll ring the number you gave us during school hours."
            : `We'll ring you in the ${bestTime.split(" (")[0].toLowerCase()}.`}{" "}
          Can&apos;t wait? Reach us first.
        </p>
        <WhatsAppButton
          message={`Hello, I asked for a callback. Name: ${name}, Phone: ${phone}.`}
          label="Chat now instead"
          variant="outline"
          className="mt-4"
        />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="rounded-2xl border border-slate-200 bg-white p-6 shadow-card">
      <h2 className="font-bold text-slate-900">Prefer we call you?</h2>
      <p className="mt-1 text-sm text-slate-600">
        Leave your name and number — we&apos;ll call you back at the time you pick.
      </p>
      <div className="mt-4 grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Your name</span>
          <input
            type="text"
            autoComplete="name"
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="e.g. Mrs Adeyemi"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(error)}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Phone number</span>
          <input
            type="tel"
            inputMode="tel"
            autoComplete="tel"
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            placeholder="e.g. 08012345678"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            aria-invalid={Boolean(error)}
          />
        </label>
        <label className="block">
          <span className="text-sm font-medium text-slate-700">Best time (optional)</span>
          <select
            className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-100"
            value={bestTime}
            onChange={(e) => setBestTime(e.target.value)}
          >
            {BEST_TIMES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </label>
      </div>
      {error ? (
        <p role="alert" className="mt-3 text-sm text-red-600">
          {error}
        </p>
      ) : null}
      {status === "error" ? (
        <p role="alert" className="mt-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          Something went wrong sending your request. Please try again, or reach us on WhatsApp.
        </p>
      ) : null}
      <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <Button type="submit" disabled={status === "loading"}>
          {status === "loading" ? "Sending…" : "Call me back"}
        </Button>
        {whatsappNumber ? (
          <WhatsAppButton
            message="Hello, I'd like to talk about SkulSuite for my school."
            label="Or chat now"
            variant="outline"
          />
        ) : null}
      </div>
    </form>
  );
}
