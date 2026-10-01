import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CtaBanner } from "@/components/CtaBanner";
import { LegalPageShell } from "@/components/LegalDraft";

export const metadata: Metadata = buildMetadata({
  title: "Licence Agreement",
  description:
    "Draft licence agreement for SkulSuite school software: what a termly or perpetual licence covers, and what it does not.",
  path: "/licence",
});

export default function LicencePage() {
  return (
    <>
      <LegalPageShell
        eyebrow="Legal"
        title="Licence Agreement"
        description="What your licence covers, and what it does not. Written in plain language."
      >
        <div>
          <h2>1. What a licence is</h2>
          <p>
            A licence is permission to use the SkulSuite software at one school site. It is not
            a purchase of the software itself: we keep the intellectual property of the
            software. Source code is not included; full source-code ownership is available on
            request and quoted separately.
          </p>
        </div>
        <div>
          <h2>2. Termly licence (Option A)</h2>
          <p>
            Covers one school site while the term is paid for, including updates and support
            (phone or WhatsApp on school days). It ends when the term ends unless renewed, and
            may be suspended if a termly fee is more than 14 days overdue.
          </p>
        </div>
        <div>
          <h2>3. Perpetual licence (Option B — ownership)</h2>
          <p>
            One-time purchase giving one school site the right to use the software
            permanently, at the version delivered plus the optional yearly support and updates
            plan. Payment is 50% when we agree and 50% on delivery. The offline installation
            needs no hosting fee.
          </p>
        </div>
        <div>
          <h2>4. What you may not do</h2>
          <p>
            You may not copy, share, resell or install the software outside the licensed
            school site, remove our branding, or let another school use your licence.
          </p>
        </div>
        <div>
          <h2>5. Your data stays yours</h2>
          <p>
            Everything the software stores for your school — students, staff, results — belongs
            to the school. If a licence ends, we help you export your data.
          </p>
        </div>
        <div>
          <h2>6. Changes to prices and terms</h2>
          <p>
            Prices are valid until the date shown on our price list. Renewals follow the price
            list current at renewal, and hosting is reviewed at each yearly renewal because
            providers are paid in US dollars.
          </p>
        </div>
      </LegalPageShell>

      <div className="pb-16 sm:pb-20">
        <CtaBanner
          title="Ready to license SkulSuite?"
          description="Book a demo and we will walk you through the licence, the setup and the training."
        />
      </div>
    </>
  );
}
