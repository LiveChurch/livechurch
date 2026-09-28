<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch } from "vue";
import type { CSSProperties } from "vue";
import type { Slide } from "@/core/types/playlist";
import type { TextAlign, TextAnchor, TextBackground, TextOutline, TextShadow } from "@/core/types/theme";
import { ColorUtils } from "@/core/utils/ColorUtils";

const SCALE_NEAR = 0.62;
const SCALE_FAR = 0.42;
const DURATION = 1.5;
/** Fraction of the viewport (and of the active slide) that stays aligned to the text anchor. */
const ANCHOR_FRACTION: Record<TextAnchor, number> = {
  top: 0,
  center: 0.5,
  bottom: 1,
};
const EASE = "cubic-bezier(0.22, 1, 0.36, 1)";

interface BottomToUpSlidesProps {
  slides: Slide[];
  currentIndex: number;
  viewportHeight: number;
  edgePadding: number;
  gap: number;
  bodyFontSize: number;
  anchor: TextAnchor;
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

const props = defineProps<BottomToUpSlidesProps>();

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

const viewportRef = ref<HTMLElement | null>(null);
const slideEls: Array<HTMLElement | null> = [];

const panY = ref(0);
// Transitions are only enabled after the first positioning (equivalent to
// framer-motion's `initial={false}` + first measurement without animation).
const transitionsEnabled = ref(false);

// Fades the edge opposite the text: with the text at the bottom, the previous message
// (above) fades at the top; otherwise, the next one fades at the bottom.
const fadeMask = computed(() => {
  const direction = props.anchor === "bottom" ? "to top" : "to bottom";
  return `linear-gradient(${direction}, black 0%, black 80%, transparent 100%)`;
});

function distanceScale(distance: number) {
  if (distance === 0) return 1;
  return Math.abs(distance) === 1 ? SCALE_NEAR : SCALE_FAR;
}

function distanceOpacity(distance: number) {
  if (distance === 0) return 1;
  if (distance === 1) return 0.24;
  if (distance === 2) return 0.1;
  return 0;
}

async function updatePan() {
  await nextTick();
  const activeElement = slideEls[props.currentIndex];
  if (!activeElement) return;

  // Moves the content to align the active slide to the text anchor: top with
  // top, center with center or bottom with bottom of the viewport.
  const fraction = ANCHOR_FRACTION[props.anchor];
  panY.value =
    props.viewportHeight * fraction -
    (activeElement.offsetTop + activeElement.clientHeight * fraction);

  if (!transitionsEnabled.value) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        transitionsEnabled.value = true;
      });
    });
  }
}

function slideStyle(index: number): CSSProperties {
  const distance = index - props.currentIndex;
  return {
    paddingInline: `${props.sidePadding}px`,
    maxWidth: "100%",
    transformOrigin: "center center",
    transform: `scale(${distanceScale(distance)})`,
    opacity: distanceOpacity(distance),
    transition: transitionsEnabled.value
      ? `transform ${DURATION}s ${EASE}, opacity ${DURATION}s ${EASE}`
      : "none",
  };
}

function setContentStyle(): CSSProperties {
  return {
    paddingTop: `${props.edgePadding}px`,
    paddingBottom: `${props.edgePadding}px`,
    gap: `${props.gap}px`,
    transform: `translateY(${panY.value}px)`,
    transition: transitionsEnabled.value
      ? `transform ${DURATION}s ${EASE}`
      : "none",
  };
}

watch(
  () => [
    props.currentIndex,
    props.viewportHeight,
    props.bodyFontSize,
    props.slides,
    props.anchor,
  ],
  updatePan,
);

onMounted(updatePan);
</script>

<template>
  <div
    ref="viewportRef"
    class="absolute left-0 right-0 top-1/2 -translate-y-1/2 overflow-hidden"
    :style="{
      height: `${props.viewportHeight}px`,
      WebkitMaskImage: fadeMask,
      maskImage: fadeMask,
    }"
  >
    <div
      class="flex flex-col items-center"
      :style="setContentStyle()"
    >
      <div
        v-for="(slideItem, index) in props.slides"
        :key="`${index}-${slideItem.text}`"
        :ref="(el) => { slideEls[index] = el as HTMLElement | null }"
        class="w-full text-center"
        :style="slideStyle(index)"
      >
        <div
          class="text-foreground"
          :class="
            index - props.currentIndex === 0 && props.strongShadow
              ? 'drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]'
              : index - props.currentIndex === 0
                ? 'drop-shadow-xl'
                : ''
          "
          :style="{
            fontSize: `${props.bodyFontSize}px`,
            fontWeight: props.bold ? 700 : 400,
            fontStyle: props.italic ? 'italic' : 'normal',
            textTransform: props.uppercase ? 'uppercase' : 'none',
            lineHeight: props.lineHeight,
            letterSpacing: `${props.letterSpacing}em`,
            textAlign: props.textAlign,
            color: props.color || undefined,
            WebkitTextStroke: props.outline.width > 0 ? `${props.outline.width}px ${props.outline.color}` : undefined,
            textShadow: textShadowCss,
          }"
        >
          <span class="inline-block" :style="backgroundStyle">
            <span
              v-for="(line, lineIndex) in slideItem.text.split('\n')"
              :key="`${index}-${lineIndex}`"
              class="block"
            >
              {{ line }}
            </span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
