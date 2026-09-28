import type { Metadata } from "next";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { DownloadFlow } from "@/download/DownloadFlow";

export const metadata: Metadata = {
  title: "Baixar o LiveChurch: grátis para Windows e Linux",
  description:
    "Baixe o LiveChurch, programa de apresentação grátis para o culto. Escolha o sistema (Windows ou Linux) e a versão e receba o link por e-mail.",
};

const HOME_PAGE = "/";

export default function DownloadPage() {
  return (
    <>
      <SiteHeader pagePrefix={HOME_PAGE} hideDownload />
      <main className="relative overflow-hidden">
        <PhotoBackdrop src="backgrounds/worship-warm.jpg" position="center 30%" />
        <div className="relative mx-auto flex max-w-3xl flex-col gap-12 px-5 pb-28 pt-32 md:pt-40">
          <header className="flex flex-col gap-4">
            <h1 className="font-display text-4xl leading-tight md:text-5xl">Baixe o LiveChurch</h1>
            <p className="text-lg text-dim">
              Totalmente grátis. Escolha o sistema e a versão, informe seu nome e e-mail e enviaremos o
              link de download para você.
            </p>
          </header>

          <DownloadFlow />
        </div>
      </main>
      <SiteFooter pagePrefix={HOME_PAGE} />
    </>
  );
}
