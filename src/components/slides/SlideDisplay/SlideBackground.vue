<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

interface SlideBackgroundProps {
  backgroundUrl: string;
  /** CSS value of solid color/gradient; covers `bg-media` when filled. */
  backgroundFill: string;
  backgroundOpacity: number;
  gradientColor: string;
  gradientAnimated: boolean;
}

defineProps<SlideBackgroundProps>();
</script>

<template>
  <div class="absolute inset-0 z-0 bg-media" />
  <div
    v-if="backgroundFill"
    class="absolute inset-0 z-[1]"
    :style="{ background: backgroundFill }"
  />
  <img
    v-if="backgroundUrl"
    :src="backgroundUrl"
    :alt="t('components.slides.background')"
    class="absolute inset-0 h-full w-full object-cover transition-transform duration-1000"
    :style="{ opacity: backgroundOpacity }"
  />
  <template v-if="gradientColor">
    <div
      class="absolute inset-0 z-[2]"
      :style="{
        background: `radial-gradient(ellipse at 30% 20%, ${gradientColor}30 0%, transparent 60%)`,
      }"
    />
    <div
      class="absolute inset-0 z-[2]"
      :class="gradientAnimated ? 'animate-gradient-glow' : 'opacity-70'"
      :style="{
        background: `radial-gradient(ellipse at 70% 80%, ${gradientColor}25 0%, transparent 55%)`,
      }"
    />
  </template>
</template>
