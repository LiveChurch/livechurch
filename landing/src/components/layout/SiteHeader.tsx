"use client";

import { BasePathUtils } from "@/core/utils/BasePathUtils";
import Link from "next/link";
import { NavLinks, SiteConfig } from "@/core/constants/SiteConfig";
import { useI18n } from "@/core/i18n/I18nProvider";
import { DownloadButton } from "@/components/ui/DownloadButton";
import { Icon } from "@/components/ui/Icon";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { LanguageSwitcher } from "./LanguageSwitcher";

interface SiteHeaderProps {
  /** Outside the home page, the section links point to the home page. */
  onHome?: boolean;
  hideDownload?: boolean;
}

export function SiteHeader({ onHome = true, hideDownload }: SiteHeaderProps) {
  const { t, href } = useI18n();
  const homePath = href("/");

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-edge/70 bg-page/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-2">
        <Link href={onHome ? "#" : homePath} className="flex min-h-11 items-center gap-2.5" aria-label={t("nav.homeLabel")}>
          <img src={BasePathUtils.url("/logo.png")} alt="" className="size-8" />
          <span className="hidden font-display text-xl min-[400px]:inline">{SiteConfig.name}</span>
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label={t("nav.sectionsLabel")}>
          {NavLinks.map((link) => (
            <Link
              key={link.hash}
              href={`${onHome ? "" : homePath}${link.hash}`}
              className="py-3 text-sm text-dim transition-colors hover:text-fg"
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={SiteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={t("nav.githubLabel")}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full border border-edge px-3 text-sm text-dim transition-colors hover:text-fg"
          >
            <Icon name="github" size={18} />
            <span className="hidden sm:inline">{t("nav.github")}</span>
          </a>
          <LanguageSwitcher />
          <ThemeToggle />
          {!hideDownload && <DownloadButton size="sm" />}
        </div>
      </div>
    </header>
  );
}
