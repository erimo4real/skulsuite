import type { Metadata } from "next";
import { products } from "@/data/products";
import { buildMetadata } from "@/lib/seo";
import { SectionHeader } from "@/components/SectionHeader";
import { ProductCard } from "@/components/ProductCard";
import { CtaBanner } from "@/components/CtaBanner";

export const metadata: Metadata = buildMetadata({
  title: "Products",
  description:
    "Explore SkulSuite's three school products: the CBT Examination System, the Question Bank and the School Management System.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <>
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 sm:py-20">
        <SectionHeader
          eyebrow="Products"
          title="Three tools, one suite for your school"
          description="Start with the product that solves your most pressing problem — each works on its own, and they're designed to work together."
        />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <div className="pb-16 sm:pb-20">
        <CtaBanner
          title="Not sure which product fits?"
          description="Request a demo and we'll help you choose based on your school's size and priorities."
        />
      </div>
    </>
  );
}
