import type { Metadata } from "next";
import { PalettePicker } from "@/components/PalettePicker";

/** Internal design-tool page — excluded from search engines and the sitemap. */
export const metadata: Metadata = {
  title: "Palette Picker (internal)",
  robots: { index: false, follow: false },
};

export default function PalettesPage() {
  return <PalettePicker />;
}
