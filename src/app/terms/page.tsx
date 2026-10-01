import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CtaBanner } from "@/components/CtaBanner";
import { LegalPageShell } from "@/components/LegalDraft";

export const metadata: Metadata = buildMetadata({
  title: "Terms of Service",
  description:
    "Draft terms of service for SkulSuite school software: licences, payments, renewals, data ownership and support.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <>
      <LegalPageShell
        eyebrow="Legal"
        title="Terms of Service"
        description="The rules for buying and using SkulSuite software. Written in plain language."
      >
        <div>
          <h2>1. Prices and payment</h2>
          <p>
            All prices are in Nigerian Naira and exclude any applicable taxes. Termly fees are
            due at the start of each term. Hosting and domain fees are due yearly, upfront.
            Ownership purchases follow the 50% / 50% schedule: half when we agree, half on
            delivery.
          </p>
        </div>
        <div>
          <h2>2. Licences</h2>
          <p>
            A termly licence covers one school site for the paid term. An ownership purchase
            gives one school site a perpetual licence to use the software; the source code stays
            our intellectual property unless separately agreed and quoted. A licence may be
            suspended if a termly fee is more than 14 days overdue.
          </p>
        </div>
        <div>
          <h2>3. Hosting and renewals</h2>
          <p>
            The online version runs on cloud servers billed yearly. If hosting is not renewed,
            the online version may go offline until payment is received. Hosting fees are
            reviewed at each renewal because providers are paid in US dollars.
          </p>
        </div>
        <div>
          <h2>4. Your data</h2>
          <p>
            The school owns its data. If you end your licence, we help you export your records.
            We do not sell or share school data.
          </p>
        </div>
        <div>
          <h2>5. Support</h2>
          <p>
            Termly licences include software updates and support (phone or WhatsApp on school
            days) while the licence is active. Ownership customers can take the optional yearly
            support and updates plan.
          </p>
        </div>
        <div>
          <h2>6. Fair use</h2>
          <p>
            Each licence covers one school site. Sharing, reselling or installing the software
            outside the licensed site is not allowed.
          </p>
        </div>
      </LegalPageShell>

      <div className="pb-16 sm:pb-20">
        <CtaBanner
          title="Questions about the terms?"
          description="Ask us anything before you buy — we would rather over-explain than surprise you."
        />
      </div>
    </>
  );
}
