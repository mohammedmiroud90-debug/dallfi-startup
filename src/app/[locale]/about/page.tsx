import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import ContentPage from "@/components/ContentPage";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pages.about");
  return { title: `${t("title")} — DALLFI`, description: t("intro") };
}

export default function AboutPage() {
  return <ContentPage pageKey="about" />;
}
