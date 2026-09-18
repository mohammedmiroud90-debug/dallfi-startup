import { getTranslations } from "next-intl/server";

export default async function EcosystemCards() {
  const t = await getTranslations("Ecosystem");

  const items = [
    { id: "build", title: t("build.title"), description: t("build.description") },
    { id: "work", title: t("work.title"), description: t("work.description") },
    { id: "connect", title: t("connect.title"), description: t("connect.description") },
    { id: "grow", title: t("grow.title"), description: t("grow.description") },
  ] as const;

  return (
    <section id="ecosystem" className="border-t border-border bg-white px-4 py-20 sm:px-6 sm:py-24">
      <div className="mx-auto max-w-5xl">
        <h2 className="mb-14 text-center font-[family-name:var(--font-display)] text-[2rem] tracking-tight text-black sm:text-[2.6rem]">
          {t("sectionTitle")}
        </h2>
        <div className="grid gap-10 sm:grid-cols-2">
          {items.map((item) => (
            <a
              key={item.id}
              id={item.id}
              href={`#${item.id}`}
              className="group block border-t border-black/15 pt-5 text-black transition-opacity hover:opacity-80"
            >
              <h3 className="font-[family-name:var(--font-display)] text-[1.55rem] text-black">
                {item.title}
              </h3>
              <p className="mt-3 max-w-sm text-[15px] leading-7 text-black/80">{item.description}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
