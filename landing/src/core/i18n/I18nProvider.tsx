"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import type { AppLocale } from "./AppLocale";
import { Translators, type MessageTree, type Translator } from "./Translator";

interface I18nValue extends Translator {
  locale: AppLocale;
  /** Path of the page in the current language (`/download` → `/en/download`). */
  href: (path?: string) => string;
}

const I18nContext = createContext<I18nValue | null>(null);

interface I18nProviderProps {
  locale: AppLocale;
  messages: MessageTree;
  children: ReactNode;
}

export function I18nProvider({ locale, messages, children }: I18nProviderProps) {
  const value = useMemo<I18nValue>(
    () => ({ locale, ...Translators.create(messages), href: (path = "") => `/${locale}${path}` }),
    [locale, messages],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const value = useContext(I18nContext);
  if (!value) throw new Error("useI18n deve ser usado dentro de <I18nProvider>");
  return value;
}
