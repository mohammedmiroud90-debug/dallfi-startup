import { getTranslations } from "next-intl/server";
import HeroSearch from "@/components/HeroSearch";

export default async function Hero() {
  const t = await getTranslations("Hero");

  return (
    <section className="relative border-t border-[#d8d8d8] bg-[#e8e8e8]">
      <div className="mx-auto flex max-w-[1200px] flex-col gap-8 px-5 pb-12 pt-10 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:gap-10 lg:px-8 lg:pb-16 lg:pt-12">
        <div className="min-w-0 flex-1 lg:max-w-[65%]">
          <h1 className="font-display text-[clamp(2rem,4.5vw,3rem)] leading-[1.15] font-normal tracking-[0.5px] text-[#1a1a1a]">
            {t("title")}
          </h1>
          <h2 className="mt-4 max-w-xl text-[clamp(1rem,2vw,1.2rem)] leading-relaxed font-normal text-[#444]">
            {t("tagline")}
          </h2>
          <HeroSearch />
          <p className="mt-3 max-w-xl text-[13px] leading-5 font-normal text-[#666]">
            {t("searchNote")}{" "}
            <a
              href="#about"
              className="text-[#1e4f8c] underline decoration-[#1e4f8c]/70 underline-offset-2 transition-opacity hover:opacity-80"
            >
              {t("readMore")}
            </a>
          </p>
        </div>

        <div className="flex w-full shrink-0 flex-col items-stretch sm:max-w-[260px] lg:w-[26%]">
          <a
            href="#demo"
            className="inline-flex w-full items-center justify-center rounded-[4px] bg-[#fc0000] px-4 py-3.5 text-[0.95rem] font-semibold tracking-[0.04em] text-white uppercase transition-colors hover:bg-[#d40000]"
          >
            {t("cta")}
          </a>
          <a
            href="#about"
            className="mt-2.5 text-center text-[0.9rem] font-normal text-[#1e4f8c] underline decoration-[#1e4f8c] underline-offset-3 transition-opacity hover:opacity-80"
          >
            {t("version")}
          </a>
        </div>
      </div>
    </section>
  );
}
