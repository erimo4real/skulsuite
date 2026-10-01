import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CtaBanner } from "@/components/CtaBanner";
import { LegalPageShell } from "@/components/LegalDraft";

export const metadata: Metadata = buildMetadata({
  title: "Refund and Cancellation Policy",
  description:
    "Draft refund and cancellation policy for SkulSuite: termly licences, ownership purchases, hosting fees and how to cancel.",
  path: "/refund-policy",
});

export default function RefundPolicyPage() {
  return (
    <>
      <LegalPageShell
        eyebrow="Legal"
        title="Refund and Cancellation Policy"
        description="When money comes back, and how to cancel or pause. Written in plain language."
      >
        <div>
          <h2>1. Before delivery</h2>
          <p>
            Cancel any time before your setup or delivery date and we refund everything you
            have paid, minus work already done (for example setup or data migration completed
            at your request).
          </p>
        </div>
        <div>
          <h2>2. Termly licences</h2>
          <p>
            Termly fees are due at the start of each term and are refundable in the first 14
            days of a term if the software does not work for you and we cannot fix it. After
            that, a term is not refunded, but you are never charged for a term you did not
            use — just tell us before the next term starts and we stop billing.
          </p>
        </div>
        <div>
          <h2>3. Ownership purchases</h2>
          <p>
            Ownership follows the 50% / 50% schedule. If you cancel after paying the first 50%
            and before delivery, we refund it minus work already done. After delivery, the
            licence is permanent and the payment is not refundable — that is why delivery
            includes training and a handover.
          </p>
        </div>
        <div>
          <h2>4. Hosting, domain and one-time fees</h2>
          <p>
            Hosting and domain are paid yearly to providers on your behalf, so they are
            refunded only before the service is provisioned. Setup, migration and training
            fees are refundable until the work is done.
          </p>
        </div>
        <div>
          <h2>5. How refunds are paid</h2>
          <p>
            Refunds go back to the account that paid, by bank transfer. Allow up to 10 working
            days. Refunds are confirmed by our team — contact us to start one, and we will
            confirm in writing.
          </p>
        </div>
        <div>
          <h2>6. Cancelling or pausing</h2>
          <p>
            Email or WhatsApp us to cancel a licence, hosting renewal or the support plan. If
            hosting is not renewed, the online version may go offline until payment is
            received — your data is kept safe and waiting, not deleted.
          </p>
        </div>
      </LegalPageShell>

      <div className="pb-16 sm:pb-20">
        <CtaBanner
          title="Simple, honest terms"
          description="Ask us anything about refunds before you pay — we will answer straight."
        />
      </div>
    </>
  );
}
