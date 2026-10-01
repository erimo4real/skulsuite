"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { CONSENT_EVENT, type ConsentChoice } from "./CookieConsent";

/**
 * Loads Google Analytics only when the visitor has accepted cookies
 * (build prompt §13: privacy-friendly analytics with a cookie notice).
 * The server renders nothing when no GA id is configured.
 */
export function AnalyticsGate({ gaId }: { gaId: string }) {
  const [consent, setConsent] = useState<ConsentChoice>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const v = window.localStorage.getItem("skulsuite-consent");
      setConsent(v === "accepted" || v === "declined" ? v : null);
    } catch {
      // ignore
    }
    setReady(true);
    const onChange = (e: Event) => setConsent((e as CustomEvent).detail as ConsentChoice);
    window.addEventListener(CONSENT_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_EVENT, onChange);
  }, []);

  useEffect(() => {
    if (consent === "declined") {
      // If GA loaded in a previous visit, stop measurement now.
      (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = true;
    } else if (consent === "accepted") {
      (window as unknown as Record<string, unknown>)[`ga-disable-${gaId}`] = false;
    }
  }, [consent, gaId]);

  if (!ready || consent !== "accepted") return null;

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`} strategy="afterInteractive" />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
