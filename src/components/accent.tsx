import { Icon, type IconName } from "./Icon";

/** Tailwind classes per product accent, kept in one place. */
const accents = {
  brand: {
    icon: "bg-brand-50 text-brand-600",
    chip: "bg-brand-50 text-brand-700",
    border: "hover:border-brand-300",
  },
  violet: {
    icon: "bg-violet-50 text-violet-600",
    chip: "bg-violet-50 text-violet-700",
    border: "hover:border-violet-300",
  },
  emerald: {
    icon: "bg-emerald-50 text-emerald-600",
    chip: "bg-emerald-50 text-emerald-700",
    border: "hover:border-emerald-300",
  },
} as const;

export type Accent = keyof typeof accents;

export function ProductIcon({
  icon,
  accent,
  className = "h-6 w-6",
}: {
  icon: IconName;
  accent: Accent;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex h-12 w-12 items-center justify-center rounded-xl ${accents[accent].icon}`}
    >
      <Icon name={icon} className={className} />
    </span>
  );
}

export function accentChipClass(accent: Accent): string {
  return accents[accent].chip;
}

export function accentHoverBorder(accent: Accent): string {
  return accents[accent].border;
}
