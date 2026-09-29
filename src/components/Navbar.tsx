"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { nav, cta } from "@/data/site";
import { whatsappMessages } from "@/lib/whatsapp";
import { ButtonLink } from "./Button";
import { WhatsAppButton } from "./WhatsAppButton";
import { Icon } from "./Icon";
import { Logo } from "./Logo";

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

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
          className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-slate-700 hover:bg-slate-100 md:hidden"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <Icon name={open ? "close" : "menu"} className="h-5 w-5" />
        </button>
      </div>

      {/* Mobile menu */}
      {open ? (
        <nav
          aria-label="Mobile"
          className="border-t border-slate-200 bg-white px-4 pb-6 pt-2 md:hidden"
        >
          {nav.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`block rounded-lg px-3 py-2.5 text-base font-medium ${
                isActive(link.href)
                  ? "bg-brand-50 text-brand-700"
                  : "text-slate-700 hover:bg-slate-50"
              }`}
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-4 flex flex-col gap-2">
            <WhatsAppButton
              message={whatsappMessages.general}
              variant="outline"
              className="w-full"
            />
            <ButtonLink
              href={cta.demoHref}
              className="w-full"
              onClick={() => setOpen(false)}
            >
              {cta.demo}
            </ButtonLink>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
