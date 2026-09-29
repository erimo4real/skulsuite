/**
 * SkulSuite logo mark: an open book whose pages rise into a graduation
 * cap — reading + achievement in one glyph, drawn to stay crisp at any size
 * (pure SVG, no raster assets). Color derives from currentColor so it
 * follows the active palette automatically.
 */
export function LogoMark({ className = "h-9 w-9" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <rect width="40" height="40" rx="10" className="fill-brand-600" />
      {/* Open book pages */}
      <path
        d="M9 24.5c3.6-1.8 7.2-1.8 11 0 3.8-1.8 7.4-1.8 11 0V15c-3.6-1.8-7.2-1.8-11 0-3.8-1.8-7.4-1.8-11 0v9.5Z"
        className="fill-white/90"
      />
      <path d="M20 15v9.5" stroke="rgb(0 0 0 / 0.18)" strokeWidth="1.4" />
      {/* Mortarboard above the book */}
      <path
        d="m20 6 11 4.4L20 14.8 9 10.4 20 6Z"
        className="fill-accent-400"
      />
      <path
        d="M26.5 12.4v4.8"
        stroke="rgb(255 255 255 / 0.9)"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <circle cx="26.5" cy="18.4" r="1.4" className="fill-accent-300" />
    </svg>
  );
}

/** Full lockup: mark + wordmark. */
export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-9 w-9" />
      <span className="text-lg font-bold tracking-tight text-slate-900">
        SkulSuite
      </span>
    </span>
  );
}
