import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { products, getProduct } from "@/data/products";
import { pricing } from "@/data/pricing";
import { whatsappMessages } from "@/lib/whatsapp";
import { buildMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/SectionHeader";
import { ProductIcon } from "@/components/accent";
import { FeatureCard } from "@/components/FeatureCard";
import { StepsList } from "@/components/StepsList";
import { ScreenshotGallery } from "@/components/ScreenshotGallery";
import { ProductMedia } from "@/components/ProductMedia";
import { getScreenshots } from "@/lib/screenshots";
import { FaqList } from "@/components/FaqList";
import { CtaBanner } from "@/components/CtaBanner";
import { PricingCard } from "@/components/PricingCard";
import { ViewTracker } from "@/components/ViewTracker";
import { WhatsAppButton } from "@/components/WhatsAppButton";
import { ButtonLink } from "@/components/Button";
import { Icon } from "@/components/Icon";
import { cta } from "@/data/site";

interface Params {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) return {};
  return buildMetadata({
    title: product.seo.title,
    description: product.seo.description,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductPage({ params }: Params) {
  const { slug } = await params;
  const product = getProduct(slug);
  if (!product) notFound();

  const productPricing = pricing.find((p) => p.productId === product.id);
  const productMessage =
    product.id === "cbt"
      ? whatsappMessages.cbt
      : product.id === "question-bank"
        ? whatsappMessages.questionBank
        : whatsappMessages.schoolManagement;

  return (
    <>
      <ViewTracker event="page_view" params={{ page: product.slug }} />

      {/* ── Hero ──────────────────────────────────────────────────── */}
      <section className="border-b border-slate-100 bg-gradient-to-b from-brand-50/60 to-white">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="flex justify-center">
              <ProductIcon icon={product.icon} accent={product.accent} className="h-7 w-7" />
            </div>
            <h1 className="mt-5 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
              {product.name}
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-600 sm:text-xl">
              {product.tagline}
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <ButtonLink href={cta.demoHref} size="lg">
                {cta.demo}
              </ButtonLink>
              <ButtonLink href="#how-it-works" variant="outline" size="lg">
                See How It Works
              </ButtonLink>
            </div>
            <div className="mt-5 flex justify-center">
              <WhatsAppButton message={productMessage} variant="ghost" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Problem & solution ────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader title="The problem" align="left" />
            <ul className="mt-6 space-y-3.5">
              {product.problem.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-400" />
                  <span className="text-slate-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeader title="The solution" align="left" />
            <p className="mt-6 text-lg leading-relaxed text-slate-600">
              {product.solution}
            </p>
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeader
            title="What it does"
            description="Feature-by-feature — each one confirmed with you during your demo before your school relies on it."
          />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {product.features.map((feature) => (
              <FeatureCard
                key={feature.title}
                feature={feature}
                accent={product.accent}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── How it works ──────────────────────────────────────────── */}
      <section id="how-it-works" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeader eyebrow="How it works" title={`${product.shortName}, step by step`} />
        <div className="mt-10">
          <StepsList steps={product.howItWorks} />
        </div>
      </section>

      {/* ── Demo video / presentation ─────────────────────────────── */}
      <ProductMedia
        productName={product.name}
        demoBase={
          product.id === "cbt"
            ? "cbt-demo"
            : product.id === "question-bank"
              ? "question-bank-demo"
              : "school-management-demo"
        }
        deckFile={
          product.id === "cbt"
            ? "CBT-Presentation.pptx"
            : product.id === "question-bank"
              ? "QBank-Presentation.pdf"
              : undefined
        }
        deckLabel={
          product.id === "cbt"
            ? "Download the CBT walkthrough (PPTX)"
            : product.id === "question-bank"
              ? "Download the Question Bank walkthrough (PDF)"
              : undefined
        }
      />

      {/* ── Screenshots ───────────────────────────────────────────── */}
      <section className="border-y border-slate-100 bg-slate-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
          <SectionHeader
            title="See it working"
            description="The fastest way to evaluate the product is a live walkthrough."
          />
          <div className="mt-10">
            <ScreenshotGallery
              name={product.name}
              screenshots={getScreenshots(product.slug)}
            />
          </div>
        </div>
      </section>

      {/* ── Benefits & audience ───────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader title="What your school gains" align="left" />
            <ul className="mt-6 space-y-3.5">
              {product.benefits.map((benefit) => (
                <li key={benefit} className="flex items-start gap-3">
                  <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-600">
                    <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  <span className="text-slate-700">{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <SectionHeader title="Who is it for?" align="left" />
            <div className="mt-6 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
              {product.audience.map((audience) => (
                <div
                  key={audience}
                  className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700"
                >
                  <Icon name="users" className="h-4 w-4 text-brand-600" />
                  {audience}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────── */}
      {productPricing ? (
        <section className="border-y border-slate-100 bg-slate-50">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <SectionHeader title="Pricing" description={productPricing.blurb} />
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {productPricing.plans.map((plan) => (
                <PricingCard key={plan.name} plan={plan} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      {/* ── FAQ ───────────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-20">
        <SectionHeader title="Common questions" />
        <div className="mt-10">
          <FaqList items={product.faq} />
        </div>
        <p className="mt-6 text-center text-sm text-slate-600">
          More questions?{" "}
          <Link href="/faq" className="font-semibold text-brand-700 hover:text-brand-800">
            See the full FAQ
          </Link>
        </p>
      </section>

      <div className="pb-16 sm:pb-20">
        <CtaBanner
          title={`See ${product.shortName} in action`}
          description="Book a walkthrough tailored to your school — we'll show you exactly how it fits your workflow."
        />
      </div>
    </>
  );
}
