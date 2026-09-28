<script setup lang="ts">
import { computed, ref, useSlots } from "vue";
import Tabs from "@/components/ui/Tabs.vue";
import type { SlidesTheme } from "@/core/types/theme";
import ThemePreview from "./ThemePreview.vue";
import ThemeSectionContent from "./ThemeSectionContent.vue";
import { THEME_PANEL_SECTIONS, type ThemePanelSection } from "./sections";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Theme editor: preview on the left, editing tabs on the right. The optional
 * `details` slot adds the "General" tab (name, categories etc.).
 */
defineProps<{ theme: SlidesTheme }>();

type EditorTab = ThemePanelSection | "details";

const hasDetails = "details" in useSlots();
const tabs = computed<{ id: EditorTab; label: string }[]>(() => [
  ...(hasDetails ? [{ id: "details" as const, label: t("components.themeSelector.general") }] : []),
  ...THEME_PANEL_SECTIONS,
]);
const active = ref<EditorTab>(hasDetails ? "details" : "background");
</script>

<template>
  <div class="flex h-full min-h-0 w-full">
    <div class="flex w-2/5 shrink-0 flex-col border-r border-border/60 p-6">
      <ThemePreview :theme="theme" />
    </div>

    <div class="flex min-w-0 flex-1 flex-col">
      <Tabs v-model="active" :tabs="tabs" />
      <div class="custom-scrollbar min-h-0 flex-1 overflow-y-auto">
        <slot v-if="active === 'details'" name="details" />
        <ThemeSectionContent v-else :section="active" :current-theme="theme" />
      </div>
    </div>
  </div>
</template>
