/**
 * Public configuration values. All come from environment variables so
 * nothing deployment-specific is hardcoded (PRD §19 / Master Prompt Phase 19).
 * See .env.example for documentation.
 */

export const siteUrl = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"
).replace(/\/$/, "");

/** International format, digits only (e.g. 2348012345678). Empty hides WhatsApp CTAs. */
export const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";

export const contactEmail = process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? "";

export const contactPhone = process.env.NEXT_PUBLIC_CONTACT_PHONE ?? "";

/** Optional form endpoint (e.g. Formspree). Empty falls back to WhatsApp handoff. */
export const formEndpoint = process.env.NEXT_PUBLIC_FORM_ENDPOINT ?? "";

export const gaId = process.env.NEXT_PUBLIC_GA_ID ?? "";

/** Show "needs verification" badges on unconfirmed feature claims while auditing. */
export const showVerificationFlags =
  process.env.NEXT_PUBLIC_SHOW_VERIFICATION_FLAGS === "true";
