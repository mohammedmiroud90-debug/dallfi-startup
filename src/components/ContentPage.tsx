import { getTranslations } from "next-intl/server";

type PageKey =
  | "about"
  | "membership"
  | "partners"
  | "events"
  | "news"
  | "research"
  | "careers"
  | "contact"
  | "privacy";

type Props = {
  pageKey: PageKey;
};

export default async function ContentPage({ pageKey }: Props) {
  const t = await getTranslations(`Pages.${pageKey}`);

  return (
    <main className="flex-1 bg-[#f7f8fa]">
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6 lg:px-8 lg:py-14">
        <p className="mb-3 text-[13px] font-semibold tracking-wide text-brand uppercase">
          DALLFI
        </p>
        <h1 className="font-[family-name:var(--font-display)] text-[2rem] tracking-tight text-black sm:text-[2.5rem]">
          {t("title")}
        </h1>
        <p className="mt-4 text-[16px] leading-7 text-black/75">{t("intro")}</p>
        <div className="mt-8 space-y-4 text-[15px] leading-7 text-black/80">
          <p>{t("body1")}</p>
          <p>{t("body2")}</p>
        </div>
      </div>
    </main>
  );
}
