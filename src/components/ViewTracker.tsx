"use client";

import { useEffect } from "react";
import { trackEvent, type AnalyticsEvent } from "@/lib/analytics";

/** Fires one analytics event on mount (PRD §23: pricing/product views). */
export function ViewTracker({
  event,
  params = {},
}: {
  event: AnalyticsEvent;
  params?: Record<string, string>;
}) {
  const key = JSON.stringify(params);
  useEffect(() => {
    trackEvent(event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [event, key]);
  return null;
}
