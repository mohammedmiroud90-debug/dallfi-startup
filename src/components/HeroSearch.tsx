"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

export default function HeroSearch() {
  const t = useTranslations("Nav");
  const router = useRouter();
  const [query, setQuery] = useState("");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (!value) return;
    router.push(`/?q=${encodeURIComponent(value)}#about`);
  }

  return (
    <form
      onSubmit={onSubmit}
      role="search"
      className="mt-6 flex w-full max-w-xl items-center gap-3 border border-[#c8c8c8] bg-white px-3"
    >
      <input
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder={t("searchPlaceholder")}
        aria-label={t("search")}
        className="h-11 min-w-0 flex-1 bg-transparent text-[15px] text-[#1a1a1a] outline-none placeholder:text-[#888]"
      />
      <button
        type="submit"
        className="inline-flex h-11 w-10 shrink-0 items-center justify-center text-black transition-opacity hover:opacity-60"
        aria-label={t("search")}
      >
        <IconSearch className="h-5 w-5" />
      </button>
    </form>
  );
}
