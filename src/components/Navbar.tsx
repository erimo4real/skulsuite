"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { nav, cta } from "@/data/site";
import { whatsappMessages } from "@/lib/whatsapp";
import { ButtonLink } from "./Button";
import { WhatsAppButton } from "./WhatsAppButton";
import { Icon, type IconName } from "./Icon";
import { Logo } from "./Logo";

/** Icon per nav section for the mobile drawer (design brief: icon + label). */
const NAV_ICONS: Record<string, IconName> = {
  "/products": "book-open",
  "/pricing": "calculator",
  "/resources": "archive",
  "/how-it-works": "monitor",
  "/faq": "users",
  "/contact": "mail",
};

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  // Close on Escape and lock body scroll while the drawer is open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand-600"
          aria-label="SkulSuite home"
          onClick={() => setOpen(false)}
        >
          <Logo />
        </Link>

        {/* Desktop nav */}
        <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
          {nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive(link.href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <WhatsAppButton message={whatsappMessages.general} variant="ghost" />
          <ButtonLink href={cta.demoHref}>{cta.demo}</ButtonLink>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(true)}
        >
          <Icon name="menu" className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile drawer: overlay + right slide-in panel */}
      {open ? (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Menu">
          <button
            type="button"
            aria-label="Close menu"
            className="absolute inset-0 bg-slate-900/40"
            onClick={() => setOpen(false)}
          />
          <nav
            aria-label="Mobile"
            className="drawer-panel absolute inset-y-0 right-0 flex w-72 max-w-[85vw] flex-col border-l border-slate-200 bg-white shadow-xl"
          >
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <Logo />
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-900"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-3 py-3">
              {nav.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`mb-1 flex min-h-[48px] items-center gap-3 rounded-lg px-3 text-base font-medium ${
                    isActive(link.href)
                      ? "bg-brand-50 text-brand-700"
                      : "text-slate-700 hover:bg-slate-50"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <Icon
                    name={NAV_ICONS[link.href] ?? "arrow-right"}
                    className={`h-[18px] w-[18px] ${
                      isActive(link.href) ? "text-brand-600" : "text-slate-400"
                    }`}
                  />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="border-t border-slate-100 px-4 pb-6 pt-4">
              <div className="flex flex-col gap-2">
                <ButtonLink
                  href={cta.demoHref}
                  className="w-full"
                  onClick={() => setOpen(false)}
                >
                  {cta.demo}
                </ButtonLink>
                <WhatsAppButton
                  message={whatsappMessages.general}
                  variant="outline"
                  className="w-full"
                />
              </div>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
