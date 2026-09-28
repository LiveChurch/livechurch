<script setup lang="ts">
import { computed } from "vue";
import type { TextAlign, TextAnchor, TextBackground, TextOutline, TextShadow } from "@/core/types/theme";
import { ColorUtils } from "@/core/utils/ColorUtils";
import { TEXT_ANCHOR_POSITION } from "./textAnchor";

interface FadeSlideProps {
  text: string;
  viewportHeight: number;
  anchor: TextAnchor;
  fontSize: number;
  sidePadding: number;
  bold: boolean;
  italic: boolean;
  uppercase: boolean;
  lineHeight: number;
  letterSpacing: number;
  textAlign: TextAlign;
  color: string;
  outline: TextOutline;
  background: TextBackground;
  shadow: TextShadow;
  strongShadow: boolean;
}

const props = defineProps<FadeSlideProps>();

const lines = computed(() => props.text.split("\n"));

const textShadowCss = computed(() => {
  if (!props.shadow.enabled) return undefined;
  const { offsetX, offsetY, blur, color } = props.shadow;
  return `${offsetX}px ${offsetY}px ${blur}px ${color}`;
});

const backgroundStyle = computed(() =>
  props.background.enabled
    ? {
        backgroundColor: ColorUtils.toRgba(props.background.color, props.background.opacity),
        padding: `${props.background.padding}px ${props.background.paddingX ?? props.background.padding}px`,
        borderRadius: `${props.background.radius ?? 12}px`,
      }
    : {},
);
</script>

<template>
  <div
    class="fade-slide absolute left-0 right-0 top-1/2 -translate-y-1/2"
    :style="{ height: `${props.viewportHeight}px` }"
  >
    <Transition name="fade-slide">
      <h1
        :key="props.text"
        class="fade-slide-layer text-foreground"
        :class="
          props.strongShadow
            ? 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]'
            : 'drop-shadow-xl'
        "
        :style="{
          ...TEXT_ANCHOR_POSITION[props.anchor],
          fontSize: `${props.fontSize}px`,
          fontWeight: props.bold ? 700 : 400,
          fontStyle: props.italic ? 'italic' : 'normal',
          textTransform: props.uppercase ? 'uppercase' : 'none',
          lineHeight: props.lineHeight,
          letterSpacing: `${props.letterSpacing}em`,
          textAlign: props.textAlign,
          paddingInline: `${props.sidePadding}px`,
          maxWidth: '100%',
          color: props.color || undefined,
          WebkitTextStroke: props.outline.width > 0 ? `${props.outline.width}px ${props.outline.color}` : undefined,
          textShadow: textShadowCss,
        }"
      >
        <span class="inline-block" :style="backgroundStyle">
          <span v-for="(line, index) in lines" :key="index" class="block">
            {{ line }}
          </span>
        </span>
      </h1>
    </Transition>
  </div>
</template>

<style scoped>
/*
 * Crossfade instead of AnimatePresence (framer-motion): the layers in
 * transition are positioned absolutely inside the slide's usable area
 * (the vertical position comes from the theme's anchor), so the text swap
 * overlaps exit/enter with an opacity transition.
 */
.fade-slide-layer {
  position: absolute;
  left: 0;
  right: 0;
}

.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: opacity 0.4s ease-out;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
}
</style>
