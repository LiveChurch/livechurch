import { computed } from "vue";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { useThemeStore } from "@/core/state/theme/themeStore";
import type { SlidesTheme } from "@/core/types/theme";
import {
  CUSTOM_THEME_KEY,
  buildCustomTheme,
  clampFontScale,
  resolveEditableTheme,
  resolveSelectedThemeKey,
} from "./themeSelection";
import { I18n } from "@/core/i18n/I18n";

/**
 * Theme selection/editing logic of the CenterPanel (port of
 * `useCenterPanelTheme.ts`): resolves the item's active theme, exposes
 * font and theme binding actions. Returns computeds (it was derived per re-render in
 * React/MobX; here each derived value becomes a `computed`).
 */
export function useCenterPanelTheme() {
  const playlistCtx = usePlaylistStore();
  const themeCtx = useThemeStore();
  const { actions } = playlistCtx;

  const resolvedTheme = computed<SlidesTheme>(() =>
    themeCtx.actions.resolveThemeBinding(
      playlistCtx.state.activeItem?.themeBinding,
    ),
  );

  const editableTheme = computed(() =>
    resolveEditableTheme(playlistCtx.state.activeItem, resolvedTheme.value),
  );

  const selectedThemeKey = computed(() =>
    resolveSelectedThemeKey(playlistCtx.state.activeItem, resolvedTheme.value),
  );

  const adjustFontScale = (delta: number) => {
    editableTheme.value.fontScale = clampFontScale(
      (editableTheme.value.fontScale ?? 1) + delta,
    );
  };

  /** Receives the `value` of Select.vue (theme id or CUSTOM_THEME_KEY). */
  const handleThemeSelect = (value: string | number | null) => {
    const activeItem = playlistCtx.state.activeItem;
    if (!activeItem || value == null) return;
    const key = String(value);

    if (key === CUSTOM_THEME_KEY) {
      if (activeItem.themeBinding?.mode === "custom") return;
      actions.setItemThemeBinding(activeItem.id, {
        mode: "custom",
        theme: buildCustomTheme(resolvedTheme.value, activeItem.id),
      });
      return;
    }

    actions.setItemThemeBinding(activeItem.id, {
      mode: "global",
      themeId: key,
    });
  };

  const themeItems = computed(() => [
    ...themeCtx.state.themes.map((theme) => ({
      id: theme.id,
      label: theme.name || I18n.t("common.terms.unnamedTheme"),
    })),
    { id: CUSTOM_THEME_KEY, label: I18n.t("control.centerPanel.customTheme") },
  ]);

  return {
    resolvedTheme,
    editableTheme,
    selectedThemeKey,
    themeItems,
    adjustFontScale,
    handleThemeSelect,
  };
}
