"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";

const localeLabels: Record<string, string> = {
  en: "EN",
  fr: "FR",
  es: "ES",
  ar: "ع",
};

const localeLabelsFull: Record<string, string> = {
  en: "English (en-US)",
  fr: "Français (fr)",
  es: "Español (es)",
  ar: "العربية (ar)",
};

type Props = {
  variant?: "dark" | "light";
};

export default function LocaleSwitcher({ variant = "dark" }: Props) {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  function onChange(nextLocale: string) {
    router.replace(pathname, { locale: nextLocale });
  }

  const isDark = variant === "dark";
  const labels = isDark ? localeLabels : localeLabelsFull;

  return (
    <label className="inline-flex items-center gap-1.5">
      <span className="sr-only">{t("label")}</span>
      {isDark ? (
        <svg
          className="h-4 w-4 text-white/90"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.7"
          aria-hidden
        >
          <circle cx="12" cy="12" r="9" />
          <path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18" />
        </svg>
      ) : null}
      <select
        className={`h-auto cursor-pointer appearance-none border bg-transparent outline-none ${
          isDark
            ? "h-8 rounded-md border-white/25 px-2 pr-7 text-[13px] font-normal text-white"
            : "rounded-sm border-[#cfcfcf] px-1.5 py-0.5 pr-6 text-[15px] font-normal text-[#1a1a1a]"
        }`}
        style={{
          backgroundImage: isDark
            ? "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23ffffff' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E\")"
            : "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23666' d='M0 0l5 6 5-6z'/%3E%3C/svg%3E\")",
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 8px center",
        }}
        value={locale}
        onChange={(event) => onChange(event.target.value)}
        aria-label={t("label")}
      >
        {routing.locales.map((code) => (
          <option key={code} value={code} className="text-charcoal">
            {labels[code] ?? code.toUpperCase()}
          </option>
        ))}
      </select>
    </label>
  );
}
