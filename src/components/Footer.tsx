import Link from "next/link";
import { nav, site, cta } from "@/data/site";
import { products } from "@/data/products";
import { contactEmail, contactPhone, whatsappNumber } from "@/lib/env";
import { buildWhatsAppLink } from "@/lib/whatsapp";
import { Icon } from "./Icon";
import { LogoMark } from "./Logo";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="flex items-center gap-2.5 font-bold text-slate-900">
              <LogoMark className="h-8 w-8" />
              <span className="text-lg">{site.name}</span>
            </div>
            <p className="mt-3 text-sm text-slate-600">{site.tagline}.</p>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">Products</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {products.map((p) => (
                <li key={p.id}>
                  <Link
                    href={`/products/${p.slug}`}
                    className="text-slate-600 hover:text-brand-700"
                  >
                    {p.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">Company</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {nav.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-600 hover:text-brand-700"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href={cta.demoHref}
                  className="text-slate-600 hover:text-brand-700"
                >
                  {cta.demo}
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">Contact</h2>
            <ul className="mt-3 space-y-2 text-sm">
              {contactEmail ? (
                <li>
                  <a
                    href={`mailto:${contactEmail}`}
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-700"
                  >
                    <Icon name="mail" className="h-4 w-4" />
                    {contactEmail}
                  </a>
                </li>
              ) : null}
              {contactPhone ? (
                <li>
                  <a
                    href={`tel:${contactPhone}`}
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-700"
                  >
                    <Icon name="phone" className="h-4 w-4" />
                    {contactPhone}
                  </a>
                </li>
              ) : null}
              {whatsappNumber ? (
                <li>
                  <a
                    href={
                      buildWhatsAppLink(
                        "Hello, I would like to talk about your school software products.",
                      ) ?? undefined
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-slate-600 hover:text-brand-700"
                  >
                    <Icon name="whatsapp" className="h-4 w-4" />
                    WhatsApp us
                  </a>
                </li>
              ) : null}
              {!contactEmail && !contactPhone && !whatsappNumber ? (
                <li className="text-slate-500">
                  Contact details coming soon — use the{" "}
                  <Link href={cta.demoHref} className="text-brand-700 underline">
                    demo form
                  </Link>
                  .
                </li>
              ) : null}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-slate-200 pt-6 text-sm text-slate-500">
          © {year} {site.name}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
