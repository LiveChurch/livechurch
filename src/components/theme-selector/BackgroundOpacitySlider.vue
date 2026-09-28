<script setup lang="ts">
import { computed } from "vue";
import Slider from "primevue/slider";
import { DEFAULT_BACKGROUND_OPACITY } from "@/core/state/theme/themeNormalization";
import { useThemeEditor } from "./ThemeEditorContext";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const editor = useThemeEditor();

const percent = computed(() =>
  Math.round(
    (editor.currentTheme.backgroundOpacity ?? DEFAULT_BACKGROUND_OPACITY) * 100,
  ),
);

const setPercent = (value: number | number[] | undefined) => {
  if (typeof value === "number") editor.currentTheme.backgroundOpacity = value / 100;
};
</script>

<template>
  <div class="mb-3 flex items-center gap-3">
    <span id="background-opacity-label" class="text-xs text-foreground">
      {{ t('components.themeSelector.backgroundOpacity') }}
    </span>
    <Slider
      :model-value="percent"
      :min="0"
      :max="100"
      :step="5"
      aria-labelledby="background-opacity-label"
      class="min-w-0 flex-1"
      @update:model-value="setPercent"
    />
    <span class="w-10 text-right text-xs tabular-nums text-muted-foreground">
      {{ percent }}%
    </span>
  </div>
</template>
