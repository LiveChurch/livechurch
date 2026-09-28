import { type ComputedRef, type InjectionKey, type Ref, computed, inject, provide, ref } from "vue";
import { useDraft } from "@/core/composables/useDraft";
import type { DefaultThemeCategory, SlidesTheme } from "@/core/types/theme";
import { useThemeStore } from "@/core/state/theme/themeStore";
import Alert from "../Alert";
import { I18n } from "@/core/i18n/I18n";

/**
 * Replaces GlobalThemesModalContext.tsx (React) with Vue's provide/inject.
 * Edits stay in drafts (theme and default themes) and only reach the store
 * when the user clicks Save.
 */
export type GlobalThemesPanel = "theme" | "defaults";

export type DefaultThemeIds = Record<DefaultThemeCategory, string | null>;

export interface GlobalThemesModalState {
  selectedThemeId: Ref<string>;
  setSelectedThemeId: (themeId: string) => void;
  activePanel: Ref<GlobalThemesPanel>;
  setActivePanel: (panel: GlobalThemesPanel) => void;
  /** Draft of the selected theme; it is what the edit panel changes. */
  themeDraft: Ref<SlidesTheme | null>;
  defaultsDraft: Ref<DefaultThemeIds | null>;
  isDirty: ComputedRef<boolean>;
  save: () => void;
  discard: () => void;
  /** Asks before losing changes; resolves `true` if it can proceed. */
  confirmDiscard: () => Promise<boolean>;
}

const globalThemesModalKey: InjectionKey<GlobalThemesModalState> =
  Symbol("GlobalThemesModalState");

/** Called once in the GlobalThemesModal setup. */
export function createGlobalThemesModalState(): GlobalThemesModalState {
  const themeCtx = useThemeStore();

  const selectedThemeId = ref(themeCtx.state.currentTheme?.id || "");
  const activePanel = ref<GlobalThemesPanel>("theme");

  const theme = useDraft(
    () => themeCtx.state.getThemeById(selectedThemeId.value),
    (value) => themeCtx.actions.updateTheme(value),
  );
  const defaults = useDraft(
    () => themeCtx.state.defaultThemeIds,
    (value) => themeCtx.actions.setDefaultThemeIds(value),
  );

  const activeDraft = () => (activePanel.value === "theme" ? theme : defaults);
  const isDirty = computed(() => activeDraft().isDirty.value);

  const setSelectedThemeId = (themeId: string) => {
    selectedThemeId.value = themeId;
    activePanel.value = "theme";
  };

  const setActivePanel = (panel: GlobalThemesPanel) => {
    activePanel.value = panel;
  };

  const confirmDiscard = async () => {
    if (!isDirty.value) return true;

    const confirmed = await Alert.show({
      title: I18n.t("modals.globalThemes.discardTitle"),
      message: I18n.t("modals.globalThemes.discardConfirm"),
      confirmText: I18n.t("modals.globalThemes.discard"),
      isDestructive: true,
    });
    if (confirmed) activeDraft().reset();
    return confirmed;
  };

  const state: GlobalThemesModalState = {
    selectedThemeId,
    setSelectedThemeId,
    activePanel,
    setActivePanel,
    themeDraft: theme.draft,
    defaultsDraft: defaults.draft,
    isDirty,
    save: () => activeDraft().save(),
    discard: () => activeDraft().reset(),
    confirmDiscard,
  };

  provide(globalThemesModalKey, state);
  return state;
}

/** Called in the GlobalThemesModal's child components. */
export function useGlobalThemesModalState(): GlobalThemesModalState {
  const state = inject(globalThemesModalKey, null);

  if (!state) {
    throw new Error(
      "useGlobalThemesModalState must be used inside GlobalThemesModal",
    );
  }

  return state;
}
