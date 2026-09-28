<script setup lang="ts">
import { markRaw, type Component } from "vue";
import type { SlidesTheme } from "@/core/types/theme";
import AnimationGroup from "./AnimationGroup.vue";
import BackgroundSection from "./BackgroundSection.vue";
import GradientSection from "./GradientSection.vue";
import TextSection from "./TextSection.vue";
import TitleSection from "./TitleSection.vue";
import { useThemeEditorProvide } from "./ThemeEditorContext";
import type { ThemePanelSection } from "./sections";

const props = defineProps<{
  section: ThemePanelSection;
  currentTheme: SlidesTheme;
}>();

const sectionComponentMap = {
  background: markRaw(BackgroundSection),
  gradient: markRaw(GradientSection),
  text: markRaw(TextSection),
  title: markRaw(TitleSection),
  animation: markRaw(AnimationGroup),
} satisfies Record<ThemePanelSection, Component>;

useThemeEditorProvide(() => props.currentTheme);
</script>

<template>
  <component :is="sectionComponentMap[props.section]" />
</template>
