<script setup lang="ts">
import { computed } from "vue";
import type { TextAlign, TextAnchor, TextBackground, TextOutline, TextShadow } from "@/core/types/theme";
import { ColorUtils } from "@/core/utils/ColorUtils";
import { TEXT_ANCHOR_POSITION } from "./textAnchor";

interface WordBehindSlideProps {
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

const props = defineProps<WordBehindSlideProps>();

/** Non-breaking space: the template compiler removes loose spaces. */
const NBSP = "\u00A0";

/** Each word enters with a small delay relative to the previous one. */
const WORD_STAGGER = 0.045;
/** Duration of each word's rise, in seconds. */
const WORD_DURATION = 0.65;

const lines = computed(() =>
  props.text.split("\n").map((line) => line.split(/\s+/).filter(Boolean)),
);

const lineStyle = {
  perspective: "600px",
} as const;

const wordStyle = computed(() => ({
  display: "inline-block",
  transformStyle: "preserve-3d",
  animationDuration: `${WORD_DURATION}s`,
  animationDelay: "var(--word-delay)",
}));

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

/** Global index (across lines) of the word, for the cascading stagger. */
function wordDelay(lineIndex: number, wordIndex: number) {
  let count = 0;
  for (let i = 0; i < lineIndex; i++) count += lines.value[i].length;
  return `${(count + wordIndex) * WORD_STAGGER}s`;
}
</script>

<template>
  <div
    class="word-behind absolute left-0 right-0 top-1/2 -translate-y-1/2"
    :style="{ height: `${props.viewportHeight}px` }"
  >
    <Transition name="word-behind-layer" appear>
      <h1
        :key="props.text"
        class="word-behind-layer text-foreground"
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
          WebkitTextStroke:
            props.outline.width > 0
              ? `${props.outline.width}px ${props.outline.color}`
              : undefined,
          textShadow: textShadowCss,
        }"
      >
        <span class="inline-block" :style="backgroundStyle">
          <span v-for="(line, lineIndex) in lines" :key="lineIndex" class="block" :style="lineStyle">
            <span
              v-for="(word, wordIndex) in line"
              :key="wordIndex"
              class="word-behind-word"
              :style="{
                ...wordStyle,
                '--word-delay': wordDelay(lineIndex, wordIndex),
              }"
            >{{ word }}{{ wordIndex < line.length - 1 ? NBSP : "" }}</span
            >
          </span>
        </span>
      </h1>
    </Transition>
  </div>
</template>

<style scoped>
/*
 * The word enters rising from below with a slight 3D rotation (waterfall from the
 * showreel): line perspective + word rotation, with stagger by
 * index. The exit uses the same crossfade as the fade theme.
 */
.word-behind-word {
  animation-name: word-behind-rise;
  animation-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  animation-fill-mode: both;
}

@keyframes word-behind-rise {
  from {
    opacity: 0;
    transform: translateY(0.55em) rotateX(-65deg);
  }
  to {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
  }
}

.word-behind-layer {
  position: absolute;
  left: 0;
  right: 0;
}

.word-behind-layer-enter-active,
.word-behind-layer-leave-active {
  transition: opacity 0.4s ease-out;
}

.word-behind-layer-enter-from,
.word-behind-layer-leave-to {
  opacity: 0;
}
</style>
