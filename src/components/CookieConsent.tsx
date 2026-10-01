"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Cookie consent gate (build prompt §13: privacy-friendly analytics).
 * Google Analytics loads ONLY after the visitor accepts. Declining leaves
 * the site fully usable with zero tracking. The choice is remembered in
 * localStorage; a footer link lets people change their mind later.
 */

const STORAGE_KEY = "skulsuite-consent";
export const CONSENT_EVENT = "skulsuite-consent-changed";

export type ConsentChoice = "accepted" | "declined" | null;

function readConsent(): ConsentChoice {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    return v === "accepted" || v === "declined" ? v : null;
  } catch {
    return null;
  }
}

function clearConsent() {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
  window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: null }));
}

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Show the banner shortly after load so it never flashes on first paint,
    // and only when no choice has been made yet.
    const t = setTimeout(() => {
      if (readConsent() === null) setVisible(true);
    }, 600);
    return () => clearTimeout(t);
  }, []);

  const decide = useCallback((c: "accepted" | "declined") => {
    try {
      window.localStorage.setItem(STORAGE_KEY, c);
    } catch {
      // Private mode: still honour the choice for this visit.
    }
    setVisible(false);
    window.dispatchEvent(new CustomEvent(CONSENT_EVENT, { detail: c }));
  }, []);

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed inset-x-3 bottom-3 z-50 mx-auto max-w-xl rounded-xl border border-slate-200 bg-white p-4 shadow-lg sm:inset-x-6"
    >
      <p className="text-sm text-slate-700">
        We use cookies to count anonymous page visits so we know which pages help schools
        most. No ads, no tracking of what you type. You can say no — the site works either
        way. See our{" "}
        <a href="/privacy" className="font-semibold text-brand-700 underline">
          privacy policy
        </a>
        .
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => decide("accepted")}
          className="inline-flex min-h-[44px] items-center rounded-lg bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          Accept cookies
        </button>
        <button
          type="button"
          onClick={() => decide("declined")}
          className="inline-flex min-h-[44px] items-center rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-brand-400"
        >
          No thanks
        </button>
      </div>
    </div>
  );
}

/** Footer affordance to reopen the notice. Renders nothing until a choice exists. */
export function CookieSettings() {
  const [choice, setChoice] = useState<ConsentChoice>(null);

  useEffect(() => {
    setChoice(readConsent());
    const onChange = (e: Event) => setChoice((e as CustomEvent).detail as ConsentChoice);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  if (choice === null) return null;

  return (
    <button
      type="button"
      onClick={() => {
        clearConsent();
        window.location.reload();
      }}
      className="hover:text-brand-700 hover:underline"
    >
      Cookie settings
    </button>
  );
}
