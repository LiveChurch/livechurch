<script setup lang="ts">
import Button from "primevue/button";
import AppIcon from "@/components/ui/AppIcon.vue";
import { useThemeStore } from "@/core/state/theme/themeStore";
import type { SlidesTheme } from "@/core/types/theme";
import { cn } from "@/core/utils/ClassNameUtils";
import Alert from "../Alert";
import ThemeCard from "./ThemeCard.vue";
import { useGlobalThemesModalState } from "./useGlobalThemesModal";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Porta src/modals/globalThemes/Sidebar.tsx */
const themeCtx = useThemeStore();
const localState = useGlobalThemesModalState();

const handleSelectTheme = async (themeId: string) => {
  const isAlreadyOpen =
    localState.activePanel.value === "theme" &&
    localState.selectedThemeId.value === themeId;
  if (isAlreadyOpen || !(await localState.confirmDiscard())) return;

  localState.setSelectedThemeId(themeId);
};

const handleOpenDefaults = async () => {
  if (localState.activePanel.value === "defaults") return;
  if (!(await localState.confirmDiscard())) return;

  localState.setActivePanel("defaults");
};

const handleCreateTheme = async () => {
  if (!(await localState.confirmDiscard())) return;

  const nextTheme = themeCtx.actions.createTheme(
    undefined,
    localState.selectedThemeId.value,
  );
  localState.setSelectedThemeId(nextTheme.id);
};

const handleCloneTheme = async (theme: SlidesTheme) => {
  if (!(await localState.confirmDiscard())) return;

  const clone = themeCtx.actions.createTheme(
    t("modals.globalThemes.copyName", { name: theme.name || t("common.terms.unnamedTheme") }),
    theme.id,
  );
  localState.setSelectedThemeId(clone.id);
};

const handleRemoveTheme = async (theme: SlidesTheme) => {
  const confirmed = await Alert.show({
    title: t("modals.globalThemes.removeTheme"),
    message: t("modals.globalThemes.removeThemeConfirm", { name: theme.name || t("common.terms.unnamedTheme") }),
    confirmText: t("common.actions.remove"),
    isDestructive: true,
  });

  if (!confirmed) return;

  const removed = themeCtx.actions.removeTheme(theme.id);
  if (!removed) return;

  if (localState.selectedThemeId.value === theme.id) {
    localState.setSelectedThemeId(themeCtx.state.themes[0].id);
  }
};
</script>

<template>
  <aside class="flex h-full w-72 shrink-0 flex-col border-r border-border/60 bg-background/30">
    <div class="flex items-center justify-between border-b border-border/60 px-4 py-4">
      <Button
        variant="text"
        severity="secondary"
        class="rounded-md px-2 py-1 text-xs font-medium text-muted-foreground transition-colors hover:text-surface-foreground"
        icon="pi pi-plus"
        :label="t('modals.globalThemes.newTheme')"
        :title="t('modals.globalThemes.newTheme')"
        @click="handleCreateTheme"
      />
    </div>

    <div class="custom-scrollbar flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-3">
      <ThemeCard
        v-for="theme in themeCtx.state.themes"
        :key="theme.id"
        :theme="theme"
        :selected="
          localState.activePanel.value === 'theme' && theme.id === localState.selectedThemeId.value
        "
        :can-remove="themeCtx.state.themes.length > 1"
        @select="handleSelectTheme(theme.id)"
        @clone="handleCloneTheme(theme)"
        @remove="handleRemoveTheme(theme)"
      />
    </div>

    <div class="border-t border-border/60 p-2">
      <Button
        variant="text"
        severity="secondary"
        class="w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors"
        :class="
          cn(
            localState.activePanel.value === 'defaults'
              ? 'bg-brand/10 text-brand'
              : 'text-muted-foreground hover:bg-surface-light/40 hover:text-surface-foreground',
          )
        "
        @click="handleOpenDefaults"
      >
        <span class="flex w-full min-w-0 items-center gap-3 text-left">
          <AppIcon name="tune" size="16px" class="shrink-0" />
          {{ t('modals.globalThemes.defaultThemes') }}
        </span>
      </Button>
    </div>
  </aside>
</template>
