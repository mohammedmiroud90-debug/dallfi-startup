"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import HeaderSearch from "@/components/HeaderSearch";
import LocaleSwitcher from "@/components/LocaleSwitcher";

function IconMenu({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <rect x="2" y="4" width="20" height="3.2" rx="1" />
      <rect x="2" y="10.4" width="20" height="3.2" rx="1" />
      <rect x="2" y="16.8" width="20" height="3.2" rx="1" />
    </svg>
  );
}

function IconClose({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M5.2 4.1 19.9 18.8l-2.1 2.1L3.1 6.2z" />
      <path d="m19.9 6.2-2.1-2.1L3.1 18.8l2.1 2.1z" />
    </svg>
  );
}


const PAGE_LINKS = [
  { href: "/about" as const, key: "about" },
  { href: "/membership" as const, key: "membership" },
  { href: "/partners" as const, key: "partners" },
  { href: "/events" as const, key: "events" },
  { href: "/news" as const, key: "news" },
  { href: "/research" as const, key: "research" },
  { href: "/careers" as const, key: "careers" },
  { href: "/contact" as const, key: "contact" },
  { href: "/privacy" as const, key: "privacy" },
] as const;

type Props = {
  title?: string;
};

/** Mobile-style red header used on all breakpoints for inner pages */
export default function PageHeader({ title }: Props) {
  const t = useTranslations("Nav");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const sectionTitle = title ?? t("sectionTitle");

  return (
    <header className="sticky top-0 z-50">
      <div className="bg-mobile-header">
        <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-3 sm:px-6 lg:px-8">
          <button
            type="button"
            className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-white"
            onClick={() => setOpen((value) => !value)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <IconClose className="h-8 w-8" /> : <IconMenu className="h-8 w-8" />}
          </button>

          <Link href="/" className="min-w-0 flex-1" aria-label="Dallfi">
            <Image
              src="/Dallfi.png"
              alt="Dallfi"
              width={140}
              height={40}
              priority
              className="h-8 w-auto max-w-[140px] object-contain object-left brightness-0 invert"
            />
          </Link>

          <Link
            href="/contact"
            className="shrink-0 px-1 text-[14px] font-normal whitespace-nowrap text-white"
          >
            {t("login")}
          </Link>
          <HeaderSearch />
          <LocaleSwitcher variant="dark" />
        </div>

        {open ? (
          <div className="border-t border-white/20 bg-mobile-header px-4 py-3 sm:px-6 lg:px-8">
            <ul className="mx-auto flex max-w-7xl flex-col gap-0.5 sm:flex-row sm:flex-wrap sm:gap-x-4">
              <li>
                <Link
                  href="/"
                  className="block rounded-sm px-1 py-2.5 text-[16px] font-normal text-white"
                  onClick={() => setOpen(false)}
                >
                  Home
                </Link>
              </li>
              {PAGE_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className={`block rounded-sm px-1 py-2.5 text-[16px] font-normal ${
                      pathname === link.href ? "text-white underline" : "text-white/90"
                    }`}
                    onClick={() => setOpen(false)}
                  >
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>

      <div className="bg-notice px-3 py-2.5 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl items-start gap-2">
          <span className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#1e4f8c] text-[10px] font-bold text-white">
            i
          </span>
          <p className="text-[12.5px] leading-snug text-[#1a2b3c]">
            {t("notice")}{" "}
            <Link href="/about" className="font-medium text-[#1e4f8c] underline">
              {t("noticeLink")}
            </Link>
          </p>
        </div>
      </div>

      <div className="flex h-11 items-center justify-between bg-section-bar px-3 sm:px-6 lg:px-8">
        <div className="mx-auto flex h-full w-full max-w-7xl items-center justify-between">
          <p className="text-[14px] font-normal text-white">{sectionTitle}</p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="h-7 rounded-sm bg-white px-2.5 text-[12px] font-normal text-charcoal"
            >
              {t("filter")}
            </button>
            <button
              type="button"
              className="h-7 rounded-sm bg-[#6a6a6a] px-2.5 text-[12px] font-normal text-white/90"
            >
              {t("sort")}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
