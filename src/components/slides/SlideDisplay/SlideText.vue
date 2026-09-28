<script setup lang="ts">
import { computed } from "vue";
import type { Slide } from "@/core/types/playlist";
import type { TextAnchor } from "@/core/types/theme";
import BottomToUpSlides from "./BottomToUpSlides.vue";
import FadeSlide from "./FadeSlide.vue";
import WordBehindSlide from "./WordBehindSlide.vue";
import type { SlideVisuals } from "./useSlideVisuals";

/**
 * Slide text with the theme's transition and text style. Centers itself
 * in an area of `viewportHeight` px inside the parent, which must be `relative`.
 */
const props = defineProps<{
  text: string;
  slides: Slide[];
  currentIndex: number;
  visuals: SlideVisuals;
  anchor: TextAnchor;
  viewportHeight: number;
  fontSize: number;
  sidePadding: number;
  gap: number;
  strongShadow: boolean;
}>();

const textStyle = computed(() => ({
  bold: props.visuals.fontBold,
  italic: props.visuals.fontItalic,
  uppercase: props.visuals.fontUppercase,
  lineHeight: props.visuals.lineHeight,
  letterSpacing: props.visuals.letterSpacing,
  textAlign: props.visuals.textAlign,
  color: props.visuals.textColor,
  outline: props.visuals.textOutline,
  background: props.visuals.textBackground,
  shadow: props.visuals.textShadow,
  anchor: props.anchor,
  viewportHeight: props.viewportHeight,
  sidePadding: props.sidePadding,
  strongShadow: props.strongShadow,
}));
</script>

<template>
  <BottomToUpSlides
    v-if="visuals.transitionType === 'bottom-to-up'"
    v-bind="textStyle"
    :slides="slides"
    :current-index="currentIndex"
    :edge-padding="viewportHeight * 0.62"
    :gap="gap"
    :body-font-size="fontSize"
  />
  <WordBehindSlide
    v-else-if="visuals.transitionType === 'word-behind'"
    v-bind="textStyle"
    :text="text"
    :font-size="fontSize"
  />
  <FadeSlide v-else v-bind="textStyle" :text="text" :font-size="fontSize" />
</template>
