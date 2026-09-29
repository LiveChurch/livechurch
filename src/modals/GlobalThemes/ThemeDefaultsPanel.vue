<script setup lang="ts">
import Select from "@/components/ui/Select.vue";
import { useThemeStore } from "@/core/state/theme/themeStore";
import { ThemeCategories } from "@/core/state/theme/themeCategories";
import type { DefaultThemeCategory } from "@/core/types/theme";
import { useGlobalThemesModalState } from "./useGlobalThemesModal";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Porta src/modals/globalThemes/ThemeDefaultsPanel.tsx */
const themeCtx = useThemeStore();
const { defaultsDraft } = useGlobalThemesModalState();

/** Only themes meant for the category (or for all) can be its default. */
function optionsFor(category: DefaultThemeCategory) {
  return [
    { label: t("modals.createPlaylist.none"), value: "" },
    ...themeCtx.state.themes
      .filter((theme) => ThemeCategories.appliesTo(theme, category))
      .map((theme) => ({
        value: theme.id,
        label: theme.name || t("common.terms.unnamedTheme"),
      })),
  ];
}

function onSelect(category: DefaultThemeCategory, value: string | number) {
  if (!defaultsDraft.value) return;
  const themeId = String(value);
  defaultsDraft.value[category] = themeId === "" ? null : themeId;
}
</script>

<template>
  <div v-if="defaultsDraft" class="flex h-full min-w-0 flex-1">
    <div class="flex min-w-0 flex-1 flex-col px-6 py-5">
      <div class="max-w-2xl space-y-5">
        <div class="space-y-1">
          <p
            class="text-xs font-medium uppercase tracking-[0.18em] text-muted-foreground"
          >
            {{ t('modals.globalThemes.defaultThemes') }}
          </p>
          <h2 class="text-xl font-semibold text-surface-foreground">
            {{ t('modals.globalThemes.defineDefaults') }}
          </h2>
        </div>

        <div class="grid gap-4 md:grid-cols-2">
          <div v-for="field in ThemeCategories.options" :key="field.value">
            <Select
              :model-value="defaultsDraft[field.value] ?? ''"
              :label="field.label"
              :placeholder="t('modals.globalThemes.selectTheme')"
              :options="optionsFor(field.value)"
              @update:model-value="onSelect(field.value, $event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
