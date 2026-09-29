import Image from "next/image";
import type { Screenshot } from "@/lib/screenshots";

/**
 * Product screenshot grid. Renders actual screenshots when images exist in
 * public/screenshots/<slug>/, otherwise an honest "coming soon" placeholder
 * (never fake imagery — PRD §17).
 */
export function ScreenshotGallery({
  name,
  screenshots,
}: {
  name: string;
  screenshots: Screenshot[];
}) {
  if (screenshots.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center sm:p-12">
        <div className="mx-auto max-w-lg">
          <h3 className="font-semibold text-slate-900">
            {name} screenshots coming soon
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            We&apos;re preparing real screenshots from the live system. Request a
            demo and we&apos;ll walk you through the actual product screens instead —
            that&apos;s the best way to see it working.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {screenshots.map((shot, index) => (
        <figure
          key={shot.src}
          className={index === 0 && screenshots.length > 1 ? "sm:col-span-2" : ""}
        >
          <a
            href={shot.src}
            target="_blank"
            rel="noopener noreferrer"
            title="Open full size in a new tab"
            className="block overflow-hidden rounded-2xl border border-slate-200 shadow-card transition-shadow duration-200 hover:shadow-lg"
          >
            {/* Fixed dimensions prevent layout shift; h-auto keeps aspect. */}
            <Image
              src={shot.src}
              alt={shot.alt}
              width={1200}
              height={750}
              loading="lazy"
              className="h-auto w-full object-cover"
            />
          </a>
          <figcaption className="mt-2 text-center text-sm text-slate-500">
            {shot.alt}
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
