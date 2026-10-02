import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

import { site } from "@/data/site";
import { defaultPalette } from "@/data/theme";
import { siteUrl, gaId } from "@/lib/env";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { RevealScript } from "@/components/RevealScript";
import { CookieConsent } from "@/components/CookieConsent";
import { AnalyticsGate } from "@/components/AnalyticsGate";
import { MobileActionBar } from "@/components/MobileActionBar";
import { EroAssistant } from "@/components/EroAssistant";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${site.name} — ${site.tagline}`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  openGraph: {
    siteName: site.name,
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#2563eb",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={inter.variable} data-palette={defaultPalette}>
      <body className="flex min-h-screen flex-col bg-white font-sans text-slate-900 antialiased">
        {/* If JS is off, scroll-reveal must never hide content. */}
        <noscript>
          <style>{`[data-reveal]{opacity:1 !important;transform:none !important}`}</style>
        </noscript>
        {/* Google Analytics loads only after cookie consent (privacy policy §3). */}
        {gaId ? <AnalyticsGate gaId={gaId} /> : null}
        <CookieConsent />
        <RevealScript />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <MobileActionBar />
        <EroAssistant />
      </body>
    </html>
  );
}
