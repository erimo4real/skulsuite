"use client";

import { useState } from "react";
import { palettes, defaultPalette } from "@/data/theme";
import { LogoMark } from "@/components/Logo";
import { buttonClasses } from "@/components/Button";
import { Icon } from "@/components/Icon";

/** Rendered by /palettes (noindexed) for choosing the site palette. */

/**
 * Internal comparison page (not linked in navigation) for choosing the
 * site palette. Renders this page under each palette via a data-attribute
 * on a wrapper div, with live component previews.
 */
const brandSwatches: [number, string][] = [
  [50, "bg-brand-50"],
  [100, "bg-brand-100"],
  [300, "bg-brand-300"],
  [500, "bg-brand-500"],
  [600, "bg-brand-600"],
  [800, "bg-brand-800"],
];

const accentSwatches: [number, string][] = [
  [50, "bg-accent-50"],
  [100, "bg-accent-100"],
  [300, "bg-accent-300"],
  [500, "bg-accent-500"],
  [600, "bg-accent-600"],
  [800, "bg-accent-800"],
];
export function PalettePicker() {
  const [active, setActive] = useState<(typeof palettes)[number]["id"] | null>(null);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <header className="text-center">
        <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">
          Internal · not indexed
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
          Choose a palette
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-slate-600">
          Three directions, rendered live. The winner gets locked into{" "}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">
            src/data/theme.ts
          </code>{" "}
          as <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">defaultPalette</code>.
        </p>
      </header>

      <div className="mt-12 grid gap-8 lg:grid-cols-3">
        {palettes.map((palette) => (
          <div
            key={palette.id}
            data-palette={palette.id}
            className={`rounded-3xl border-2 p-6 transition-colors ${
              (active ?? defaultPalette) === palette.id
                ? "border-slate-900"
                : "border-slate-200"
            }`}
          >
            <div className="flex items-center justify-between">
              <LogoMark />
              <span className="text-sm font-bold text-slate-900">
                {palette.name}
              </span>
            </div>
            <p className="mt-3 min-h-10 text-sm text-slate-600">
              {palette.description}
            </p>

            {/* Swatches */}
            <div className="mt-4 grid grid-cols-6 gap-1.5">
              {brandSwatches.map(([shade, cls]) => (
                <div
                  key={shade}
                  title={`brand-${shade}`}
                  className={`h-8 rounded-md ${cls}`}
                />
              ))}
              {accentSwatches.map(([shade, cls]) => (
                <div
                  key={shade}
                  title={`accent-${shade}`}
                  className={`h-8 rounded-md ${cls}`}
                />
              ))}
            </div>

            {/* Live buttons */}
            <div className="mt-5 flex flex-wrap gap-2">
              <span className={buttonClasses("primary")}>Request a Demo</span>
              <span className={buttonClasses("accent")}>Get started</span>
            </div>

            {/* Live mini-card */}
            <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-card">
              <div className="flex items-center gap-2.5">
                <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
                  <Icon name="check" className="h-4 w-4" strokeWidth={2.5} />
                </span>
                <span className="text-sm font-semibold text-slate-900">
                  Instant CBT scoring
                </span>
              </div>
              <p className="mt-2 text-xs text-slate-600">
                Objectives marked on submit — results the same day.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setActive(palette.id)}
              className={
                (active ?? defaultPalette) === palette.id
                  ? `${buttonClasses("primary")} mt-5 w-full`
                  : `${buttonClasses("outline")} mt-5 w-full`
              }
            >
              {(active ?? defaultPalette) === palette.id
                ? "✓ Previewing on this card"
                : "Preview this palette"}
            </button>
          </div>
        ))}
      </div>

      <p className="mt-10 text-center text-sm text-slate-500">
        Note: each card previews its own palette; the whole site adopts the
        winner when set in <code className="rounded bg-slate-100 px-1.5 py-0.5">theme.ts</code>.
      </p>
    </div>
  );
}
