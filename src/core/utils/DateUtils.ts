import { I18n } from "@/core/i18n/I18n";

const capitalize = (text: string) => text.charAt(0).toUpperCase() + text.slice(1);

export const DateUtils = {
  /** Weekday names (Sunday first) in the interface's current language. */
  weekdayNames(style: "long" | "short" | "narrow") {
    return Array.from({ length: 7 }, (_, index) =>
      capitalize(
        new Date(2023, 0, 1 + index)
          .toLocaleDateString(I18n.locale, { weekday: style })
          .replace(/\.$/, ""),
      ),
    );
  },

  parseDate(value: string) {
    if (value.includes("T")) {
      return new Date(value);
    }
    const [year, month, day] = value.split("-").map(Number);
    return new Date(year, month - 1, day);
  },

  startOfDay(date: Date) {
    const next = new Date(date);
    next.setHours(0, 0, 0, 0);
    return next;
  },

  endOfDay(date: Date) {
    const next = new Date(date);
    next.setHours(23, 59, 59, 999);
    return next;
  },

  toDateKey(date: Date) {
    const pad = (n: number) => String(n).padStart(2, "0");
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
  },

  formatWeekdayDate(date: Date) {
    const label = date.toLocaleDateString(I18n.locale, {
      weekday: "long",
      day: "numeric",
      month: "long",
    });
    return label.charAt(0).toUpperCase() + label.slice(1);
  },
};
