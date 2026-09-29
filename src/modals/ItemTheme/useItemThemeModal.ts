import { computed, ref } from "vue";
import { ThemeCategories } from "@/core/state/theme/themeCategories";
import { useThemeStore } from "@/core/state/theme/themeStore";
import type { DefaultThemeCategory, SlidesTheme, ThemeBinding } from "@/core/types/theme";
import { JsonUtils } from "@/core/utils/JsonUtils";
import Prompt from "@/modals/Prompt";
import { I18n } from "@/core/i18n/I18n";

export type ItemThemeModalTab = "existing" | "create";

export interface UseItemThemeModalOptions {
  category?: DefaultThemeCategory;
  currentTheme: SlidesTheme;
  currentBinding?: ThemeBinding | null;
  /** Forces the initial tab; without it, opens on "Custom theme" only if one already exists. */
  initialTab?: ItemThemeModalTab;
}

/**
 * Logic of the generic item theme modal: choose an existing global theme
 * or edit a draft of the item-exclusive theme ("Custom theme" tab).
 */
export function useItemThemeModal(options: UseItemThemeModalOptions) {
  const themeCtx = useThemeStore();

  const activeTab = ref<ItemThemeModalTab>(
    options.initialTab ??
      (options.currentBinding?.mode === "custom" ? "create" : "existing"),
  );

  const selectedThemeId = computed(() =>
    options.currentBinding?.mode === "global" ? options.currentBinding.themeId : null,
  );

  /** The already applied theme stays listed, even if its category has changed. */
  const existingThemes = computed(() =>
    themeCtx.state.themes.filter(
      (theme) =>
        theme.id === selectedThemeId.value ||
        ThemeCategories.appliesTo(theme, options.category),
    ),
  );

  const draft = ref<SlidesTheme>({
    ...JsonUtils.clone(options.currentTheme),
    id: `custom-${Date.now()}`,
  });

  /** The custom theme has no editable name: it is always identified this way. */
  const buildCustomBinding = (): ThemeBinding => ({
    mode: "custom",
    theme: { ...JsonUtils.clone(draft.value), name: I18n.t("control.centerPanel.customTheme") },
  });

  const globalThemeOptions = computed(() =>
    themeCtx.state.themes.map((theme) => ({
      value: theme.id,
      label: theme.name || I18n.t("common.terms.unnamedTheme"),
    })),
  );

  /** Replaces the draft's fields with those of a global theme, keeping the draft's id. */
  const copyFromGlobalTheme = (themeId: string) => {
    const source = themeCtx.state.getThemeById(themeId);
    if (!source) return;
    Object.assign(draft.value, JsonUtils.clone(source), { id: draft.value.id });
  };

  /** Saves the current draft as a new global theme, with the given name. */
  const promoteDraftToGlobalTheme = async () => {
    const name = await Prompt.show({
      title: I18n.t("modals.itemTheme.makeGlobalTitle"),
      message: I18n.t("modals.itemTheme.makeGlobalMessage"),
      placeholder: I18n.t("modals.globalThemes.themeName"),
    });
    if (!name) return;

    themeCtx.actions.upsertTheme({
      ...JsonUtils.clone(draft.value),
      id: `theme-${Date.now()}`,
      name,
    });
  };

  return {
    activeTab,
    existingThemes,
    selectedThemeId,
    draft,
    buildCustomBinding,
    globalThemeOptions,
    copyFromGlobalTheme,
    promoteDraftToGlobalTheme,
  };
}
