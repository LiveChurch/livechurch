import { computed } from "vue";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { ThemeCategories } from "@/core/state/theme/themeCategories";
import { useThemeStore } from "@/core/state/theme/themeStore";
import type { ThemeBinding } from "@/core/types/theme";

/**
 * Logic of the Live panel's theme picker: lists the global themes of the
 * active item's category (for a quick switch) and exposes the current binding, to
 * draw a theme or apply a theme chosen/created in `ItemThemeModal`.
 */
export function useThemePicker() {
  const playlistCtx = usePlaylistStore();
  const themeCtx = useThemeStore();

  const activeItem = computed(() => playlistCtx.state.activeItem);
  const disabled = computed(() => !activeItem.value);

  const category = computed(() =>
    activeItem.value ? ThemeCategories.forItemType(activeItem.value.type) : undefined,
  );

  const currentBinding = computed(() => activeItem.value?.themeBinding ?? null);

  const isRandomSelected = computed(() => currentBinding.value?.mode === "random");
  const isCustomSelected = computed(() => currentBinding.value?.mode === "custom");

  /** The item's custom theme: independent of the active binding, never cleared when switching themes. */
  const personalTheme = computed(() => activeItem.value?.customTheme ?? null);

  /** Neutral base to start a custom theme from scratch (does not depend on the item's active theme). */
  const personalThemeBase = computed(
    () => personalTheme.value ?? themeCtx.state.currentTheme,
  );

  const selectedThemeId = computed(() => {
    const binding = currentBinding.value;
    return binding?.mode === "global" ? binding.themeId : null;
  });

  const resolvedTheme = computed(() =>
    themeCtx.actions.resolveThemeBinding(currentBinding.value),
  );

  /** The already applied global theme stays listed, even if its category has changed. */
  const themes = computed(() =>
    themeCtx.state.themes.filter(
      (theme) =>
        theme.id === selectedThemeId.value ||
        ThemeCategories.appliesTo(theme, category.value),
    ),
  );

  const applyBinding = (binding: ThemeBinding) => {
    if (activeItem.value) {
      playlistCtx.actions.setItemThemeBinding(activeItem.value.id, binding);
    }
  };

  const selectTheme = (themeId: string) => applyBinding({ mode: "global", themeId });

  /** Reapplies the already saved custom theme, without having to reopen the editor. */
  const selectPersonalTheme = () => {
    if (personalTheme.value) applyBinding({ mode: "custom", theme: personalTheme.value });
  };

  /** Draws another theme (never the one already applied, if there is an alternative). */
  const selectRandom = () => {
    if (!activeItem.value) return;
    const binding = themeCtx.actions.createRandomBinding(
      resolvedTheme.value.id,
      category.value,
    );
    if (binding) applyBinding(binding);
  };

  return {
    disabled,
    category,
    currentBinding,
    resolvedTheme,
    themes,
    selectedThemeId,
    isRandomSelected,
    isCustomSelected,
    personalTheme,
    personalThemeBase,
    selectTheme,
    selectPersonalTheme,
    selectRandom,
    applyBinding,
  };
}
