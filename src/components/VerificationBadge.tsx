import { showVerificationFlags } from "@/lib/env";

/**
 * Shows a "to be confirmed" badge on feature claims that have not been
 * verified against the real applications. Hidden entirely in production
 * (NEXT_PUBLIC_SHOW_VERIFICATION_FLAGS=false) so unverified copy never
 * ships looking approved (PRD §25).
 */
export function VerificationBadge() {
  if (!showVerificationFlags) return null;
  return (
    <span className="inline-flex shrink-0 items-center rounded-full border border-accent-300 bg-accent-50 px-2 py-0.5 text-xs font-medium text-accent-800">
      To be confirmed
    </span>
  );
}
