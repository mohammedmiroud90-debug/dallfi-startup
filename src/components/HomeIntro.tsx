import Image from "next/image";
import { getTranslations } from "next-intl/server";

export default async function HomeIntro() {
  const t = await getTranslations("Pages.about");

  return (
    <section id="about" className="relative overflow-hidden border-t border-[#dce0e6] bg-[#f3f5f8] text-[#1a1a1a]">
      <div className="mx-auto grid max-w-[1200px] lg:min-h-[420px] lg:grid-cols-2">
        <div className="flex flex-col justify-center px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <h2 className="text-[1.75rem] leading-tight font-semibold tracking-tight text-[#1a1a1a] sm:text-[2rem]">
            {t("title")}
          </h2>

          <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#333]">
            {t("intro")}
          </p>

          <div className="mt-5 max-w-xl space-y-4 text-[15px] leading-7 text-[#444]">
            <p>{t("body1")}</p>
            <p>{t("body2")}</p>
          </div>
        </div>

        <div className="relative min-h-[280px] bg-black sm:min-h-[360px] lg:min-h-full">
          <Image
            src="/about/unicef-digital.webp"
            alt="Digital impact — people collaborating with technology"
            fill
            className="object-cover object-center grayscale contrast-[1.05] brightness-[0.92]"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div
            className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/25 via-transparent to-white/10"
            aria-hidden
          />
        </div>
      </div>
    </section>
  );
}
