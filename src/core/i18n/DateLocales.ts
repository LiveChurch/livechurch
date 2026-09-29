import type { Locale } from "date-fns";
import { enUS, es, ptBR } from "date-fns/locale";
import { I18n } from "./I18n";
import type { AppLocale } from "./AppLocale";

const DATE_FNS_LOCALES: Record<AppLocale, Locale> = { "pt-BR": ptBR, en: enUS, es };

/** Date formats per language: date-fns (`dd/MM/yyyy`) and PrimeVue DatePicker (`dd/mm/yy`). */
const DATE_FORMATS: Record<AppLocale, { dateFns: string; datePicker: string }> = {
  "pt-BR": { dateFns: "dd/MM/yyyy", datePicker: "dd/mm/yy" },
  en: { dateFns: "MM/dd/yyyy", datePicker: "mm/dd/yy" },
  es: { dateFns: "dd/MM/yyyy", datePicker: "dd/mm/yy" },
};

export const DateLocales = {
  dateFns: () => DATE_FNS_LOCALES[I18n.locale],
  dateFnsPattern: () => DATE_FORMATS[I18n.locale].dateFns,
  datePickerFormat: () => DATE_FORMATS[I18n.locale].datePicker,
};
