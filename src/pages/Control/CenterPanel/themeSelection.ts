import type { PlaylistItem } from "@/core/types/playlist";
import type { SlidesTheme } from "@/core/types/theme";

/** Special key of the custom theme in the CenterPanel selector. */
export const CUSTOM_THEME_KEY = "__custom__";

export function resolveEditableTheme(
  item: PlaylistItem | undefined,
  resolvedTheme: SlidesTheme,
): SlidesTheme {
  return item?.themeBinding?.mode === "custom"
    ? item.themeBinding.theme
    : resolvedTheme;
}

export function resolveSelectedThemeKey(
  item: PlaylistItem | undefined,
  resolvedTheme: SlidesTheme,
): string {
  if (item?.themeBinding?.mode === "custom") return CUSTOM_THEME_KEY;
  if (item?.themeBinding?.mode === "global") return item.themeBinding.themeId;
  return resolvedTheme.id;
}

export function clampFontScale(value: number): number {
  return Number(Math.max(0.7, Math.min(1.6, value)).toFixed(2));
}

export function buildCustomTheme(
  base: SlidesTheme,
  itemId: string | undefined,
): SlidesTheme {
  return {
    ...base,
    id: `custom-${itemId || Date.now()}`,
    transition: { ...base.transition, type: base.transition?.type ?? "fade" },
    effects: {
      embers: base.effects?.embers ?? false,
      rain: base.effects?.rain ?? false,
      snow: base.effects?.snow ?? false,
    },
  };
}
