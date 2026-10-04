/**
 * Lightweight analytics shim. Events are forwarded to Google Analytics
 * when NEXT_PUBLIC_GA_ID is configured, and silently ignored otherwise.
 * Events map to PRD §23: page views, CTA clicks, demo submissions,
 * WhatsApp clicks, pricing views.
 */

export type AnalyticsEvent =
  | "page_view"
  | "cta_click"
  | "whatsapp_click"
  | "demo_submit"
  | "pricing_view"
  | "offline_view";

type Gtag = (...args: unknown[]) => void;

function getGtag(): Gtag | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { gtag?: Gtag; dataLayer?: unknown[] };
  // gtag may not be loaded yet; dataLayer.push is the safe primitive.
  if (typeof w.gtag === "function") return w.gtag;
  if (Array.isArray(w.dataLayer)) {
    return (...args: unknown[]) => w.dataLayer?.push(args);
  }
  return null;
}

export function trackEvent(
  event: AnalyticsEvent,
  params: Record<string, string> = {},
): void {
  getGtag()?.("event", event, params);
}
