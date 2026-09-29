"use client";

import { buildWhatsAppLink } from "@/lib/whatsapp";
import { trackEvent } from "@/lib/analytics";
import { Icon } from "./Icon";
import { buttonClasses } from "./Button";
import type { Variant, SizeLike } from "./button-types";

interface WhatsAppButtonProps {
  /** Pre-filled message (see whatsappMessages in lib/whatsapp.ts). */
  message: string;
  label?: string;
  variant?: Variant;
  size?: SizeLike;
  className?: string;
}

export function WhatsAppButton({
  message,
  label = "Chat on WhatsApp",
  variant = "outline",
  size = "md",
  className = "",
}: WhatsAppButtonProps) {
  const href = buildWhatsAppLink(message);
  if (!href) return null; // Hidden until NEXT_PUBLIC_WHATSAPP_NUMBER is configured.

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${buttonClasses(variant, size)} ${className}`}
      onClick={() => trackEvent("whatsapp_click", { message })}
    >
      <Icon name="whatsapp" className="h-4 w-4" />
      {label}
    </a>
  );
}
