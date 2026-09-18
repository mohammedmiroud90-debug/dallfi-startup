import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";

function InfoIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 16 16" aria-hidden>
      <circle cx="8" cy="8" r="8" fill="#31708f" />
      <rect x="7.15" y="3.6" width="1.7" height="1.7" rx="0.2" fill="#fff" />
      <rect x="7.15" y="6.4" width="1.7" height="6" rx="0.2" fill="#fff" />
    </svg>
  );
}

export default async function NoticeBanner() {
  const t = await getTranslations("Notice");

  return (
    <aside className="notice-banner" role="status" aria-label={t("label")}>
      <div className="notice-banner__inner">
        <InfoIcon className="notice-banner__icon" />
        <div className="notice-banner__copy">
          <p className="notice-banner__text">
            {t("message")}{" "}
            <Link href="/blog?category=builds" className="notice-banner__link">
              {t("learnMore")}
            </Link>
          </p>
        </div>
      </div>
    </aside>
  );
}
