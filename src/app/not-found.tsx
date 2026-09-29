import Link from "next/link";
import { cta } from "@/data/site";
import { ButtonLink } from "@/components/Button";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-brand-600">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Page not found
      </h1>
      <p className="mt-4 text-slate-600">
        The page you&apos;re looking for doesn&apos;t exist or has moved. Try one of
        these instead:
      </p>
      <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <ButtonLink href={cta.exploreHref}>{cta.explore}</ButtonLink>
        <ButtonLink href={cta.demoHref} variant="outline">
          {cta.demo}
        </ButtonLink>
      </div>
      <p className="mt-6 text-sm text-slate-500">
        Or go back{" "}
        <Link href="/" className="font-medium text-brand-700 underline">
          home
        </Link>
        .
      </p>
    </section>
  );
}
