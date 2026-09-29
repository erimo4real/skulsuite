import fs from "fs";
import path from "path";

/**
 * Checks public/downloads at build time so we never render a video or link
 * that doesn't exist yet. Static export runs this on the server during build.
 */
function hasFile(file: string): boolean {
  try {
    fs.accessSync(path.join(process.cwd(), "public", "downloads", file));
    return true;
  } catch {
    return false;
  }
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-7 w-7">
      <path d="M8 5.5v13a1 1 0 0 0 1.53.85l10.2-6.5a1 1 0 0 0 0-1.7L9.53 4.65A1 1 0 0 0 8 5.5Z" />
    </svg>
  );
}

export interface ProductMediaProps {
  productName: string;
  /** Base file name without extension, e.g. "question-bank-demo". */
  demoBase: string;
  deckFile?: string;
  deckLabel?: string;
}

export function ProductMedia({ productName, demoBase, deckFile, deckLabel }: ProductMediaProps) {
  const videoFile = `${demoBase}.mp4`;
  const posterFile = `${demoBase}-poster.jpg`;
  const hasVideo = hasFile(videoFile);
  const hasPoster = hasFile(posterFile);
  const hasDeck = deckFile ? hasFile(deckFile) : false;

  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-wide text-brand-700">Demo</p>
          <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Watch {productName} in action
          </h2>
          <p className="mt-3 text-slate-600">
            A short walkthrough of the real product — no slides, just the app doing its work.
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-4xl">
          {hasVideo ? (
            <div className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-black shadow-card">
              <video
                controls
                preload="none"
                poster={hasPoster ? `/downloads/${posterFile}` : undefined}
                className="aspect-video w-full"
              >
                <source src={`/downloads/${videoFile}`} type="video/mp4" />
                Your browser does not support embedded videos.
              </video>
            </div>
          ) : (
            <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white shadow-card">
              <div className="px-6 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-white shadow-lg">
                  <PlayIcon />
                </div>
                <p className="mt-4 text-lg font-semibold text-slate-900">
                  Demo video coming soon
                </p>
                <p className="mx-auto mt-1 max-w-md text-sm text-slate-500">
                  We&apos;re preparing a short screen recording of {productName}. In the meantime,
                  request a live demo and we&apos;ll walk you through it.
                </p>
              </div>
            </div>
          )}

          {hasDeck && deckFile ? (
            <div className="mt-6 text-center">
              <a
                href={`/downloads/${deckFile}`}
                download
                className="inline-flex items-center gap-1.5 rounded-lg border border-brand-600 px-5 py-2.5 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-50"
              >
                {deckLabel ?? "Download the presentation (PDF)"}
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
