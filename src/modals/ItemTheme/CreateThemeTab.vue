<script setup lang="ts">
import ThemeEditor from "@/components/theme-selector/ThemeEditor.vue";
import type { SlidesTheme } from "@/core/types/theme";

/**
 * Tab for creating an item-exclusive theme; reuses the Global Themes
 * editor. No editable name: it is always "Custom theme" (see `useItemThemeModal`).
 */
defineProps<{
  /** Draft: the section components write directly to its fields. */
  draft: SlidesTheme;
}>();
</script>

<template>
  <ThemeEditor :theme="draft" />
</template>
