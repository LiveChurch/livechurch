import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/next";
import { I18nProvider } from "@/core/i18n/I18nProvider";
import { Locales } from "@/core/i18n/AppLocale";
import { MessagesLoader } from "@/core/i18n/MessagesLoader";
import { Translators } from "@/core/i18n/Translator";
import "../globals.css";

const FONTS_URL =
  "https://fonts.googleapis.com/css2?family=Hanken+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;700&family=Young+Serif&display=swap";

interface LocaleParams {
  params: Promise<{ locale: string }>;
}

export const dynamicParams = false;

export function generateStaticParams() {
  return Locales.all.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LocaleParams): Promise<Metadata> {
  const { locale } = await params;
  if (!Locales.isSupported(locale)) return {};
  const { t } = Translators.create(MessagesLoader.load(locale));

  return {
    title: t("meta.title"),
    description: t("meta.description"),
    openGraph: { title: t("meta.title"), description: t("meta.ogDescription"), type: "website" },
    icons: { icon: "/logo.png" },
  };
}

export default async function LocaleLayout({ children, params }: LocaleParams & { children: ReactNode }) {
  const { locale } = await params;
  if (!Locales.isSupported(locale)) notFound();

  return (
    // data-theme is set by theme-init.js before hydration, hence the suppressHydrationWarning.
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script src="/theme-init.js" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href={FONTS_URL} rel="stylesheet" />
      </head>
      <body>
        <I18nProvider locale={locale} messages={MessagesLoader.load(locale)}>
          {children}
        </I18nProvider>
        <Analytics />
      </body>
    </html>
  );
}
