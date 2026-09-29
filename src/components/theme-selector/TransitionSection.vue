<script setup lang="ts">
import { markRaw, type Component } from "vue";
import type { SlidesTheme } from "@/core/types/theme";
import PreviewTile from "./PreviewTile.vue";
import { useThemeEditor } from "./ThemeEditorContext";
import FadeDemo from "./transition-demos/FadeDemo.vue";
import RiseDemo from "./transition-demos/RiseDemo.vue";
import WordDemo from "./transition-demos/WordDemo.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

type TransitionType = NonNullable<SlidesTheme["transition"]>["type"];

const editor = useThemeEditor();

const transitions: { label: string; type: TransitionType; demo: Component }[] = [
  { label: t("components.themeSelector.fade"), type: "fade", demo: markRaw(FadeDemo) },
  { label: t("components.themeSelector.bottomToUp"), type: "bottom-to-up", demo: markRaw(RiseDemo) },
  { label: t("components.themeSelector.wordByWord"), type: "word-behind", demo: markRaw(WordDemo) },
];

function isActive(type: TransitionType) {
  return (editor.currentTheme.transition?.type ?? "fade") === type;
}

function handleSelect(type: TransitionType) {
  editor.currentTheme.transition = { type };
}
</script>

<template>
  <div class="p-4">
    <div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
      <PreviewTile
        v-for="transition in transitions"
        :key="transition.type"
        :label="transition.label"
        :active="isActive(transition.type)"
        @select="handleSelect(transition.type)"
      >
        <div
          class="dark-mode absolute inset-0 flex items-center justify-center bg-media pb-6 text-xs font-bold text-foreground"
        >
          <component :is="transition.demo" />
        </div>
      </PreviewTile>
    </div>
  </div>
</template>
