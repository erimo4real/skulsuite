"use client";

import { useState } from "react";
import type { GeneralFaq } from "@/data/faq";
import { Icon } from "./Icon";

export function FaqList({ items }: { items: readonly GeneralFaq[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-white">
      {items.map((item, index) => {
        const open = openIndex === index;
        return (
          <div key={item.question}>
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 rounded-t-2xl px-5 py-4 text-left transition-colors hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-brand-600"
              aria-expanded={open}
              aria-controls={`faq-panel-${index}`}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span className="font-medium text-slate-900">{item.question}</span>
              <Icon
                name="chevron-down"
                className={`h-4 w-4 shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
              />
            </button>
            {open ? (
              <div id={`faq-panel-${index}`} className="px-5 pb-4">
                <p className="text-sm leading-relaxed text-slate-600">{item.answer}</p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
