import { cta } from "@/data/site";
import { ButtonLink } from "./Button";
import { WhatsAppButton } from "./WhatsAppButton";
import { whatsappMessages } from "@/lib/whatsapp";

export function CtaBanner({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <section className="mx-auto max-w-6xl px-4 sm:px-6">
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-600 via-brand-600 to-brand-800 px-6 py-14 text-center shadow-xl shadow-brand-600/20 sm:px-12">
        {/* Soft light accents — decorative only */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 left-1/2 h-64 w-[36rem] -translate-x-1/2 rounded-full bg-white/10 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-32 -left-16 h-56 w-56 rounded-full bg-accent-400/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-brand-400/30 blur-3xl"
        />

        <h2 className="relative text-2xl font-bold text-white sm:text-3xl">{title}</h2>
        <p className="relative mx-auto mt-3 max-w-xl text-brand-100">{description}</p>
        <div className="relative mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <ButtonLink href={cta.demoHref} variant="accent" size="lg">
            {cta.demo}
          </ButtonLink>
          <span className="[&_a]:border-white/40 [&_a]:bg-white/10 [&_a]:text-white [&_a:hover]:bg-white/20">
            <WhatsAppButton message={whatsappMessages.general} variant="outline" size="lg" />
          </span>
        </div>
      </div>
    </section>
  );
}
