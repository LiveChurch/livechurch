<script setup lang="ts">
import ToggleSwitch from "@/components/ui/ToggleSwitch.vue";
import { GRADIENT_PRESETS } from "./constants";
import PreviewTile from "./PreviewTile.vue";
import { useThemeEditor } from "./ThemeEditorContext";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const editor = useThemeEditor();

function handleGradientSelect(color: string) {
  const theme = editor.currentTheme;
  theme.gradientColor = color;
  theme.gradientAnimated = color ? (theme.gradientAnimated ?? false) : false;
}

const isAnimatedPreset = (color: string) =>
  editor.currentTheme.gradientAnimated && editor.currentTheme.gradientColor === color;
</script>

<template>
  <div class="p-4">
    <div v-if="editor.currentTheme.gradientColor" class="mb-3 flex justify-end">
      <ToggleSwitch
        :label="t('components.themeSelector.animate')"
        :model-value="editor.currentTheme.gradientAnimated ?? false"
        @update:model-value="editor.currentTheme.gradientAnimated = $event"
      />
    </div>

    <div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
      <PreviewTile :label="t('modals.createPlaylist.none')" :active="!editor.currentTheme.gradientColor" @select="handleGradientSelect('')">
        <div class="absolute inset-0 bg-overlay/40" />
      </PreviewTile>

      <PreviewTile
        v-for="preset in GRADIENT_PRESETS"
        :key="preset.id"
        :label="preset.name"
        :active="editor.currentTheme.gradientColor === preset.color"
        @select="handleGradientSelect(preset.color)"
      >
        <div
          class="absolute inset-0"
          :style="{
            background: `radial-gradient(ellipse at 30% 20%, ${preset.color}50 0%, transparent 60%)`,
          }"
        />
        <div
          v-if="isAnimatedPreset(preset.color)"
          class="absolute inset-0 animate-gradient-glow"
          :style="{
            background: `radial-gradient(ellipse at 70% 80%, ${preset.color}40 0%, transparent 55%)`,
          }"
        />
      </PreviewTile>
    </div>
  </div>
</template>
