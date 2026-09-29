"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LOCALE_OPTIONS, Locales } from "@/core/i18n/AppLocale";
import { useI18n } from "@/core/i18n/I18nProvider";

/**
 * One link per language, keeping the current page (`/pt-BR/download` → `/en/download`).
 * Next's automatic scrolling only goes to the top when the top is off screen, which made the page
 * alternate between scrolling up and down; so scrolling is turned off on the Link and the top is forced on click.
 */
export function LanguageSwitcher() {
  const { t, locale } = useI18n();
  const pathname = usePathname();

  return (
    <nav aria-label={t("nav.languageLabel")} className="flex items-center rounded-full border border-edge">
      {LOCALE_OPTIONS.map((option) => (
        <Link
          key={option.value}
          href={Locales.switchPath(pathname, option.value)}
          scroll={false}
          onClick={() => window.scrollTo({ top: 0 })}
          hrefLang={option.value}
          lang={option.value}
          aria-label={option.label}
          aria-current={option.value === locale ? "true" : undefined}
          className={`inline-flex min-h-11 items-center px-2.5 font-mono text-xs uppercase transition-colors first:rounded-l-full last:rounded-r-full ${
            option.value === locale ? "bg-ember/15 text-accent" : "text-dim hover:text-fg"
          }`}
        >
          {option.value.split("-")[0]}
        </Link>
      ))}
    </nav>
  );
}
