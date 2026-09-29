<script setup lang="ts">
import { computed } from "vue";
import type { TitleStyle } from "@/core/types/theme";
import { ColorUtils } from "@/core/utils/ColorUtils";

/** Slide title with the theme's text style (same fields as the text). */
const props = defineProps<{
  text: string;
  style: TitleStyle;
  /** Base size (px) before the title scale. */
  fontSize: number;
  top: number;
  /** Slide scale, for the side margin. */
  scale: number;
  compact: boolean;
}>();

const shadow = computed(() => {
  const value = props.style.textShadow;
  return value?.enabled
    ? `${value.offsetX}px ${value.offsetY}px ${value.blur}px ${value.color}`
    : undefined;
});

const outline = computed(() => {
  const value = props.style.textOutline;
  return value && value.width > 0 ? `${value.width}px ${value.color}` : undefined;
});

const box = computed(() => {
  const value = props.style.textBackground;
  if (!value?.enabled) return {};
  return {
    backgroundColor: ColorUtils.toRgba(value.color, value.opacity),
    padding: `${value.padding}px ${value.paddingX ?? value.padding}px`,
    borderRadius: `${value.radius ?? 12}px`,
  };
});
</script>

<template>
  <p
    class="absolute left-0 right-0 transition-opacity duration-300"
    :class="compact ? 'text-foreground' : 'text-muted-foreground'"
    :style="{
      top: `${top}px`,
      fontFamily: style.fontFamily || undefined,
      fontSize: `${fontSize * (style.fontScale ?? 1)}px`,
      fontWeight: style.fontBold ? 700 : 400,
      fontStyle: style.fontItalic ? 'italic' : 'normal',
      textTransform: style.fontUppercase ? 'uppercase' : 'none',
      lineHeight: style.lineHeight,
      letterSpacing: `${style.letterSpacing}em`,
      textAlign: style.textAlign,
      paddingInline: `${(style.textMargin ?? 0) * scale}px`,
      color: style.textColor || undefined,
      WebkitTextStroke: outline,
      textShadow: shadow,
    }"
  >
    <span class="inline-block" :style="box">{{ text }}</span>
  </p>
</template>
