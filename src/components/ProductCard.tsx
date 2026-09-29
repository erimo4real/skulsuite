import Link from "next/link";
import type { Product } from "@/data/product-types";
import { ProductIcon, accentHoverBorder } from "./accent";
import { Icon } from "./Icon";
import { buttonClasses } from "./Button";

export function ProductCard({ product }: { product: Product }) {
  return (
    <div
      className={`group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-card transition-all duration-200 hover:-translate-y-1 hover:shadow-lg ${accentHoverBorder(product.accent)}`}
    >
      <ProductIcon icon={product.icon} accent={product.accent} />
      <h3 className="mt-4 text-lg font-bold text-slate-900">{product.name}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-600">
        {product.summary}
      </p>
      <Link
        href={`/products/${product.slug}`}
        className={`${buttonClasses("ghost")} mt-4 self-start px-0`}
      >
        Explore {product.shortName}
        <Icon
          name="arrow-right"
          className="h-4 w-4 transition-transform duration-150 group-hover:translate-x-0.5"
        />
      </Link>
    </div>
  );
}
