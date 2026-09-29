"use client";

import { useI18n } from "@/core/i18n/I18nProvider";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { PhotoBackdrop } from "@/components/ui/PhotoBackdrop";
import { Reveal } from "@/components/ui/Reveal";
import { WindowFrame } from "@/components/ui/WindowFrame";
import { HeroSearchDemo } from "./HeroSearchDemo";

export function Hero() {
  const { t } = useI18n();

  return (
    <section className="relative overflow-hidden">
      <PhotoBackdrop src="backgrounds/worship-warm.jpg" position="center 30%" />
      {/* Projector light falling over the room */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[42rem] bg-[radial-gradient(ellipse_at_50%_0%,var(--glow),transparent_65%)]" />

      <div className="relative mx-auto flex max-w-6xl flex-col gap-20 px-5 pt-32 md:pt-40">
        <div className="flex flex-col items-start gap-14 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex max-w-xl flex-col items-start gap-7">
            <Reveal as="h1" delay={80} className="font-display text-5xl leading-[1.05] md:text-6xl">
              {t("hero.title")} <span className="text-accent">{t("hero.titleAccent")}</span>.
            </Reveal>

            <Reveal as="p" delay={160} className="text-lg leading-relaxed text-dim">
              {t("hero.text")}
            </Reveal>

            <Reveal delay={240} className="flex flex-col items-start gap-3">
              <DownloadButton />
              <p className="text-sm text-dim">
                {t("common.platforms")} · {t("common.openSource")} · {t("hero.note")}
              </p>
            </Reveal>
          </div>

          <Reveal delay={200} className="w-full max-w-lg">
            <HeroSearchDemo />
          </Reveal>
        </div>

        {/* Screenshot cut at the page fold, fading into the background */}
        <Reveal
          delay={100}
          className="max-h-[32rem] overflow-hidden [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
        >
          <WindowFrame name="bible-live" alt={t("hero.screenshotAlt")} eager />
        </Reveal>
      </div>
    </section>
  );
}
