"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";

function IconSearch({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" aria-hidden>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.2-3.2" strokeLinecap="round" />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden>
      <path d="M6 6l12 12M18 6 6 18" strokeLinecap="round" />
    </svg>
  );
}

type Props = {
  className?: string;
  variant?: "dark" | "light";
};

export default function HeaderSearch({ className = "", variant = "dark" }: Props) {
  const t = useTranslations("Nav");
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isLight = variant === "light";

  useEffect(() => {
    if (!open) return;
    inputRef.current?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = query.trim();
    if (!value) {
      inputRef.current?.focus();
      return;
    }
    router.push(`/?q=${encodeURIComponent(value)}#about`);
    setOpen(false);
  }

  return (
    <div className={`relative flex items-center ${className}`.trim()}>
      {open ? (
        <form
          onSubmit={onSubmit}
          className={`absolute right-0 z-20 flex h-9 w-[min(72vw,260px)] items-center gap-1 rounded-md border pl-2.5 pr-1 sm:w-[280px] ${
            isLight
              ? "border-[#cfcfcf] bg-white"
              : "border-white/35 bg-white/15 backdrop-blur-sm"
          }`}
          role="search"
        >
          <IconSearch
            className={`h-4 w-4 shrink-0 ${isLight ? "text-[#555]" : "text-white/90"}`}
          />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder={t("searchPlaceholder")}
            aria-label={t("search")}
            className={`h-full min-w-0 flex-1 bg-transparent text-[13px] outline-none ${
              isLight
                ? "text-charcoal placeholder:text-[#888]"
                : "text-white placeholder:text-white/65"
            }`}
          />
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              setQuery("");
            }}
            className={`inline-flex h-7 w-7 shrink-0 items-center justify-center ${
              isLight ? "text-[#555] hover:text-charcoal" : "text-white/90 hover:text-white"
            }`}
            aria-label={t("searchClose")}
          >
            <IconClose className="h-3.5 w-3.5" />
          </button>
        </form>
      ) : (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className={`inline-flex h-10 w-10 items-center justify-center transition-opacity hover:opacity-80 ${
            isLight ? "text-[#555]" : "text-white"
          }`}
          aria-label={t("search")}
          aria-expanded={false}
        >
          <IconSearch className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
