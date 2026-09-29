import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { Locales } from "@/core/i18n/AppLocale";
import { MessagesLoader } from "@/core/i18n/MessagesLoader";
import { Translators } from "@/core/i18n/Translator";
import { DownloadFlow } from "@/download/DownloadFlow";
import { DownloadIntro } from "@/download/DownloadIntro";

interface DownloadPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: DownloadPageProps): Promise<Metadata> {
  const { locale } = await params;
  if (!Locales.isSupported(locale)) return {};
  const { t } = Translators.create(MessagesLoader.load(locale));
  return { title: t("meta.downloadTitle"), description: t("meta.downloadDescription") };
}

export default function DownloadPage() {
  return (
    <>
      <SiteHeader onHome={false} hideDownload />
      <main className="relative overflow-hidden">
        <PhotoBackdrop src="backgrounds/worship-warm.jpg" position="center 30%" />
        <div className="relative mx-auto flex max-w-3xl flex-col gap-12 px-5 pb-28 pt-32 md:pt-40">
          <DownloadIntro />
          <DownloadFlow />
        </div>
      </main>
      <SiteFooter onHome={false} />
    </>
  );
}
