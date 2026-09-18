"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";

function PipeLinks({
  items,
}: {
  items: ReadonlyArray<{ href: string; label: string; external?: boolean }>;
}) {
  return (
    <nav className="flex flex-wrap items-center gap-x-0 text-[13px] font-normal leading-6 text-white">
      {items.map((item, index) => (
        <span key={`${item.href}-${item.label}`} className="inline-flex items-center">
          {index > 0 ? (
            <span className="mx-2 text-white/50" aria-hidden>
              |
            </span>
          ) : null}
          {item.external ? (
            <a href={item.href} className="hover:underline">
              {item.label}
            </a>
          ) : (
            <Link href={item.href} className="hover:underline">
              {item.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

function BlogBadge() {
  return (
    <Link
      href="/blog"
      className="inline-flex h-12 min-w-[7.5rem] items-center justify-center border border-white/80 px-3 text-center text-[12px] leading-tight font-normal text-white transition-colors hover:bg-white/10"
    >
      Dallfi
      <br />
      blog
    </Link>
  );
}

function PartnerMark({ label, sub }: { label: string; sub?: string }) {
  return (
    <div className="inline-flex min-h-12 flex-col justify-center border border-white/80 px-3 py-1.5 text-white">
      {sub ? (
        <span className="text-[9px] font-normal tracking-[0.08em] text-white/70 uppercase">
          {sub}
        </span>
      ) : null}
      <span className="text-[13px] font-semibold leading-tight">{label}</span>
    </div>
  );
}

export default function SiteFooter() {
  const t = useTranslations("Footer");

  const rowOne = [
    { href: "/", label: t("home") },
    { href: "/blog?category=builds", label: t("builds") },
    { href: "/blog?category=releases", label: t("releases") },
    { href: "/about", label: t("howItWorks") },
  ] as const;

  const rowTwo = [
    { href: "/about", label: t("aboutUs") },
    { href: "/contact", label: t("contactUs") },
    { href: "/privacy", label: t("terms") },
    { href: "tel:+442081428846", label: t("support"), external: true },
  ] as const;

  return (
    <footer className="bg-[#333333] text-white">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 py-10 sm:px-6 lg:flex-row lg:items-end lg:justify-between lg:gap-10 lg:px-8 lg:py-12">
        {/* Left — brand, slogan, pipe links */}
        <div className="min-w-0 flex-1">
          <Link href="/" className="inline-flex items-center" aria-label="Dallfi">
            <Image
              src="/Dallfi.png"
              alt="Dallfi"
              width={180}
              height={48}
              className="h-10 w-auto object-contain object-left brightness-0 invert sm:h-11"
            />
          </Link>

          <p className="mt-3 text-[14px] font-semibold text-white">
            {t("sloganLeft")}
            <span className="mx-2 font-normal text-white/50" aria-hidden>
              |
            </span>
            {t("sloganRight")}
          </p>

          <div className="mt-4 space-y-1">
            <PipeLinks items={rowOne} />
            <PipeLinks items={rowTwo} />
          </div>
        </div>

        {/* Right — badge / card marks */}
        <div className="flex flex-wrap items-end gap-3 lg:justify-end">
          <PartnerMark label="DALLFI" sub={t("ecosystem")} />
          <BlogBadge />
          <PartnerMark label="Dallfi Softwares" sub={t("poweredBy")} />
          <div
            className="inline-flex h-12 w-12 items-center justify-center bg-white text-[#333]"
            aria-hidden
          >
            <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M12 3a9 9 0 1 0 9 9" strokeLinecap="round" />
              <path d="M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>
    </footer>
  );
}
