"use client";

import { useEffect } from "react";
import { DEFAULT_LOCALE, LOCALE_OPTIONS, Locales } from "@/core/i18n/AppLocale";

/** Without a server there is no per-language redirect: the browser decides here, and the links cover those without JavaScript. */
export function LocaleRedirect() {
  useEffect(() => {
    window.location.replace(`/${Locales.fromBrowser(navigator.languages)}/`);
  }, []);

  return (
    <html lang={DEFAULT_LOCALE}>
      <head>
        <meta httpEquiv="refresh" content={`3;url=/${DEFAULT_LOCALE}/`} />
      </head>
      <body>
        <nav aria-label="Languages">
          {LOCALE_OPTIONS.map((option) => (
            <a key={option.value} href={`/${option.value}/`} style={{ marginRight: "1rem" }}>
              {option.label}
            </a>
          ))}
        </nav>
      </body>
    </html>
  );
}
