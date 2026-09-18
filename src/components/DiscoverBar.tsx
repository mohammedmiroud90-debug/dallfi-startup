"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

export default function DiscoverBar() {
  const t = useTranslations("Discover");
  const [query, setQuery] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <section className="bg-[#f7f7f7]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        <form
          onSubmit={onSubmit}
          className="flex flex-col gap-3 rounded-2xl border border-[#e8e8e8] bg-white p-3 shadow-[0_8px_28px_rgba(0,0,0,0.08)] sm:flex-row sm:items-center sm:gap-2 sm:rounded-full sm:p-2 sm:pl-5"
        >
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("placeholder")}
            className="h-12 flex-1 rounded-xl border-0 bg-transparent px-3 text-[15px] text-charcoal outline-none placeholder:text-[#8f8f8f] sm:h-14 sm:rounded-none sm:px-0"
          />

          <button
            type="submit"
            className="font-nav inline-flex h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-brand px-5 text-[14px] text-white transition-colors hover:bg-brand-dark sm:h-12 sm:rounded-full sm:px-6"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-3.5-3.5" />
            </svg>
            {t("button")}
          </button>

          <div className="hidden min-w-[180px] border-l border-[#ececec] pl-4 lg:block">
            <p className="text-[13px] leading-snug font-bold text-charcoal">{t("promoTitle")}</p>
            <p className="mt-0.5 text-[12px] leading-snug text-muted">{t("promoMore")}</p>
          </div>
        </form>
      </div>
    </section>
  );
}
