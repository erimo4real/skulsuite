import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";
import { CtaBanner } from "@/components/CtaBanner";
import { LegalPageShell } from "@/components/LegalDraft";

export const metadata: Metadata = buildMetadata({
  title: "Privacy Policy",
  description:
    "Draft privacy policy for SkulSuite: what we collect on this website, cookie use, the Ero assistant and how school data is treated.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <>
      <LegalPageShell
        eyebrow="Legal"
        title="Privacy Policy"
        description="What we collect, why, and what we never do. Written in plain language."
      >
        <div>
          <h2>1. What we collect on this website</h2>
          <p>
            Only what you type into our forms: the school name, your name and role, phone,
            email, number of students, products of interest and any message you send us. We use
            it to reply to your request — nothing else.
          </p>
        </div>
        <div>
          <h2>2. What we never collect</h2>
          <p>
            We do not collect or store student records, exam results or any school data on this
            website. This site is for information and requests only. We do not buy or sell
            personal data, and we do not use fingerprinting.
          </p>
        </div>
        <div>
          <h2>3. Cookies and analytics</h2>
          <p>
            With your consent, we count anonymous page visits (for example how many people
            viewed the pricing page) using Google Analytics. We track events like page views and
            button clicks — never the text you type. You can say no and still use the whole
            site. Change your choice any time with the cookie button in the footer.
          </p>
        </div>
        <div>
          <h2>4. WhatsApp and email</h2>
          <p>
            When you message us on WhatsApp or by email, those conversations happen on those
            services under their own privacy rules. We keep your messages so we can follow up on
            your request.
          </p>
        </div>
        <div>
          <h2>5. Ero, the AI assistant</h2>
          <p>
            Ero is our AI helper, styled as a robot mascot. It answers questions about our
            products and prices using information from this website only. What you type to Ero
            is sent to our AI service to generate a reply and is <strong>not stored</strong> by
            us after the reply is sent. Ero can only react to actions on this website — it
            cannot read your email, other apps, or anything outside this site. It always says
            it is an AI, and you can close it at any time.
          </p>
        </div>
        <div>
          <h2>6. Data protection law</h2>
          <p>
            We follow the Nigeria Data Protection Act. You can ask what we hold about you, ask
            us to correct or delete it, or withdraw consent for analytics — just contact us.
          </p>
        </div>
      </LegalPageShell>

      <div className="pb-16 sm:pb-20">
        <CtaBanner
          title="Want something deleted?"
          description="Contact us and we will handle it — we keep only what we need to serve you."
        />
      </div>
    </>
  );
}
