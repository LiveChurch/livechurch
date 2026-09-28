"use client";

import { useColorTheme } from "@/core/hooks/useColorTheme";
import { useI18n } from "@/core/i18n/I18nProvider";
import { Icon } from "./Icon";

export function ThemeToggle() {
  const { t } = useI18n();
  const { theme, toggle } = useColorTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      className="inline-flex min-h-11 min-w-11 items-center justify-center rounded-full border border-edge text-dim transition-colors hover:text-fg"
      aria-label={isDark ? t("nav.themeToLight") : t("nav.themeToDark")}
      onClick={toggle}
    >
      <Icon name={isDark ? "sun" : "moon"} size={18} />
    </button>
  );
}
