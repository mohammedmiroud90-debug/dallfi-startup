import type { Metadata } from "next";
import { Noto_Sans_Arabic, Open_Sans, Source_Serif_4 } from "next/font/google";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getLocale, getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import AppLoader from "@/components/AppLoader";
import CookieConsent from "@/components/CookieConsent";
import NoticeBanner from "@/components/NoticeBanner";
import ScrollFab from "@/components/ScrollFab";
import SiteFooter from "@/components/SiteFooter";
import SiteHeader from "@/components/SiteHeader";
import { PRIMARY_SITE_URL } from "@/lib/site";
import "../globals.css";

const openSans = Open_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-open-sans",
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-medium-serif",
  display: "swap",
});

const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
  display: "swap",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Meta");
  return {
    metadataBase: new URL(PRIMARY_SITE_URL),
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: "/",
    },
    icons: {
      icon: [
        { url: "/favicon2.png", type: "image/png", sizes: "any" },
        { url: "/favicon.ico", sizes: "any" },
      ],
      apple: [{ url: "/favicon2.png", type: "image/png" }],
      shortcut: "/favicon2.png",
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: LayoutProps<"/[locale]">) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  const currentLocale = await getLocale();
  const isRtl = currentLocale === "ar";

  return (
    <html
      lang={currentLocale}
      dir={isRtl ? "rtl" : "ltr"}
      className={`h-full antialiased ${openSans.variable} ${sourceSerif.variable} ${notoArabic.variable}`}
    >
      <body
        className={`${isRtl ? notoArabic.className : openSans.className} flex min-h-full flex-col`}
      >
        <NextIntlClientProvider>
          <AppLoader />
          <NoticeBanner />
          <SiteHeader />
          {children}
          <SiteFooter />
          <ScrollFab />
          <CookieConsent />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
