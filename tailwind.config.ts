import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";

/**
 * brand + accent resolve to CSS variables (see src/app/globals.css) so the
 * whole palette can be switched via a data attribute on <html> — compare at
 * /palettes, lock a choice in src/data/theme.ts. Alpha modifiers keep working
 * through the <alpha-value> placeholder.
 */
function scale(name: "brand" | "accent") {
  const shades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950] as const;
  return Object.fromEntries(
    shades.map((shade) => [
      shade,
      `rgb(var(--${name}-${shade}) / <alpha-value>)`,
    ]),
  ) as Record<(typeof shades)[number], string>;
}

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Inter (self-hosted via next/font) leads the default sans stack.
        sans: ["var(--font-inter)", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: scale("brand"),
        accent: scale("accent"),
      },
      boxShadow: {
        card: "0 1px 2px 0 rgb(15 23 42 / 0.04), 0 8px 24px -12px rgb(15 23 42 / 0.12)",
      },
    },
  },
  plugins: [],
};

export default config;
