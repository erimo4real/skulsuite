import { whatsappNumber } from "./env";

/**
 * Builds a wa.me deep link with a pre-filled message.
 * Returns null when no WhatsApp number is configured so callers can hide CTAs.
 */
export function buildWhatsAppLink(
  message: string,
  number: string = whatsappNumber,
): string | null {
  const digits = number.replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}

/** Pre-filled messages per context (PRD §14). */
export const whatsappMessages = {
  general:
    "Hello, I would like to request a demo of your school software products.",
  cbt: "Hello, I am interested in your CBT Examination System and would like to request a demo.",
  questionBank:
    "Hello, I am interested in your Question Bank and would like to request a demo.",
  schoolManagement:
    "Hello, I am interested in your School Management System and would like to request a demo.",
  pricing:
    "Hello, I would like to discuss pricing for your school software products.",
};
