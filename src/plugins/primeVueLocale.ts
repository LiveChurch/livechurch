import type { PrimeVueConfiguration } from "primevue/config";
import type { AppLocale } from "@/core/i18n/AppLocale";
import { I18n } from "@/core/i18n/I18n";

const intlNames = (locale: AppLocale, options: Intl.DateTimeFormatOptions, count: number, date: (i: number) => Date) =>
  Array.from({ length: count }, (_, index) =>
    date(index).toLocaleDateString(locale, options).replace(/\.$/, ""),
  );

/** DatePicker calendar texts and the like in the interface language. */
type PrimeVueLocaleOptions = NonNullable<PrimeVueConfiguration["locale"]>;

export const PrimeVueLocale = {
  of(locale: AppLocale): PrimeVueLocaleOptions {
    const weekday = (weekdayStyle: "long" | "short" | "narrow") =>
      intlNames(locale, { weekday: weekdayStyle }, 7, (i) => new Date(2023, 0, 1 + i));
    const month = (monthStyle: "long" | "short") =>
      intlNames(locale, { month: monthStyle }, 12, (i) => new Date(2023, i, 1));

    return {
      firstDayOfWeek: locale === "en" ? 0 : 1,
      dayNames: weekday("long"),
      dayNamesShort: weekday("short"),
      dayNamesMin: weekday("narrow"),
      monthNames: month("long"),
      monthNamesShort: month("short"),
      today: I18n.t("common.calendar.today"),
      clear: I18n.t("common.calendar.clear"),
      weekHeader: I18n.t("common.calendar.weekHeader"),
      fileSizeTypes: ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"],
    };
  },
};
