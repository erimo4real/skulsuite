import fs from "fs";
import path from "path";

/**
 * Discovers product screenshots at build time (static export runs this
 * during `next build`). Owners drop images into:
 *
 *   public/screenshots/<slug>/          e.g. public/screenshots/cbt/
 *
 * Alt text comes from an optional captions.json in the same folder:
 *
 *   { "01-student-exam-screen.png": "Student exam screen with timer" }
 *
 * Files without a caption get a humanized filename as alt text.
 */

const IMAGE_EXTENSIONS = [".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"];

export interface Screenshot {
  /** Public URL, e.g. /screenshots/cbt/01-student-exam-screen.png */
  src: string;
  /** Alt text: captions.json entry, else humanized filename. */
  alt: string;
}

function humanizeFilename(filename: string): string {
  return filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ")
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

function loadCaptions(dir: string): Record<string, string> {
  try {
    const raw = fs.readFileSync(path.join(dir, "captions.json"), "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (parsed && typeof parsed === "object") {
      return parsed as Record<string, string>;
    }
    return {};
  } catch {
    return {};
  }
}

export function getScreenshots(slug: string): Screenshot[] {
  const dir = path.join(process.cwd(), "public", "screenshots", slug);
  if (!fs.existsSync(dir)) return [];

  const captions = loadCaptions(dir);

  return fs
    .readdirSync(dir)
    .filter((file) =>
      IMAGE_EXTENSIONS.includes(path.extname(file).toLowerCase()),
    )
    .sort()
    .map((file) => ({
      src: `/screenshots/${slug}/${file}`,
      alt: captions[file] ?? humanizeFilename(file),
    }));
}
