/**
 * Palette registry. Compare visually at /palettes, then set
 * `defaultPalette` to the winning id — one line, whole site updates.
 * The scales themselves live in src/app/globals.css.
 */
export const palettes = [
  {
    id: "scholar-blue",
    name: "Scholar Blue",
    description: "Classic blue + warm amber. Trustworthy, familiar education SaaS.",
  },
  {
    id: "deep-indigo",
    name: "Deep Indigo",
    description: "Premium indigo + emerald accents. More enterprise, more polish.",
  },
  {
    id: "edu-teal",
    name: "Edu Teal",
    description: "Calm teal + energetic orange. Distinctive, modern education-tech.",
  },
] as const;

export type PaletteId = (typeof palettes)[number]["id"];

export const defaultPalette: PaletteId = "scholar-blue";
