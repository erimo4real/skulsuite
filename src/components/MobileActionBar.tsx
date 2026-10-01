"use client";

import { usePathname } from "next/navigation";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { Icon } from "./Icon";

/**
 * Mobile-only floating action bar (build prompt §3: "A floating WhatsApp
 * button on every page. A visible sticky 'Request a demo' button on
 * mobile." + §11 sticky bottom bar). Phone pattern from the owner's
 * mobile-design video: floating bubble + sticky bottom action.
 *
 * - The WhatsApp bubble is a circular floating button above the bar
 *   (44px+ tap target, aria-labelled, tracks whatsapp_click).
 * - The bar holds the primary demo CTA; safe-area padding for iPhones.
 * - Hidden on demo/contact pages to never cover forms (E2-style rule).
 * - Renders nothing until NEXT_PUBLIC_WHATSAPP_NUMBER is configured,
 *   so the current build shows the demo bar only.
 */
export function MobileActionBar() {
  const pathname = usePathname();
  const onFormPage = pathname === "/demo" || pathname === "/contact";
  const whatsappHref = buildWhatsAppLink(
    "Hello! I'd like to see how SkulSuite works for my school."
  );

  if (onFormPage) return null;

  return (
    <>
      {whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat with us on WhatsApp"
          className="fixed bottom-20 right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-emerald-500/30 transition-transform hover:scale-105 sm:hidden"
          onClick={() => trackEvent("whatsapp_click", { location: "mobile_bar" })}
        >
          <Icon name="whatsapp" className="h-7 w-7" strokeWidth={2} />
        </a>
      ) : null}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-slate-200 bg-white/95 px-4 py-3 backdrop-blur sm:hidden [padding-bottom:calc(0.75rem+env(safe-area-inset-bottom))]">
        <a
          href="/demo"
          className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-brand-700"
        >
          Request a Demo
        </a>
      </div>
    </>
  );
}
