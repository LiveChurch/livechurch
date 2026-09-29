"use client";

import Link from "next/link";
import { NavLinks, SiteConfig } from "@/core/constants/SiteConfig";
import { useI18n } from "@/core/i18n/I18nProvider";

export function SiteFooter({ onHome = true }: { onHome?: boolean }) {
  const { t, href } = useI18n();
  const year = new Date().getFullYear();
  const homePath = onHome ? "" : href("/");

  return (
    <footer className="border-t border-edge">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-8 px-5 py-12 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="" className="size-9" />
          <div className="flex flex-col">
            <span className="font-display text-lg">{SiteConfig.name}</span>
            <span className="text-sm text-dim">{t("common.tagline")}</span>
          </div>
        </div>

        <nav className="flex flex-wrap gap-x-6" aria-label={t("nav.footerLabel")}>
          {NavLinks.map((link) => (
            <Link
              key={link.hash}
              href={`${homePath}${link.hash}`}
              className="py-3 text-sm text-dim transition-colors hover:text-fg"
            >
              {t(`nav.${link.key}`)}
            </Link>
          ))}
          <a
            href={SiteConfig.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="py-3 text-sm text-dim transition-colors hover:text-fg"
          >
            {t("nav.github")}
          </a>
          <Link href={href(SiteConfig.downloadPage)} className="py-3 text-sm text-accent hover:underline">
            {t("common.download")}
          </Link>
        </nav>
      </div>
      <p className="border-t border-edge py-5 text-center text-sm text-dim">
        © {year} {SiteConfig.name} · {t("common.openSource")} · {t("common.beta")} · {t("common.platforms")}
      </p>
    </footer>
  );
}
