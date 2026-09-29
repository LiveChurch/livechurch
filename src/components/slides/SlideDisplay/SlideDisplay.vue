<script setup lang="ts">
import { computed, ref } from "vue";
import type { BibleVersion, PlaylistItemType, Slide } from "@/core/types/playlist";
import type { SlidesTheme } from "@/core/types/theme";
import SlideBackground from "./SlideBackground.vue";
import EmberLayer from "./EmberLayer.vue";
import RainLayer from "./RainLayer.vue";
import SnowLayer from "./SnowLayer.vue";
import SlideText from "./SlideText.vue";
import SlideTitle from "./SlideTitle.vue";
import MediaSlide from "./MediaSlide.vue";
import CountdownSlide from "./CountdownSlide.vue";
import { useSlideFrame } from "./useSlideFrame";
import { useSlideVisuals } from "./useSlideVisuals";

interface SlideDisplayProps {
  slide: Slide;
  slides?: Slide[];
  currentIndex?: number;
  theme?: SlidesTheme;
  slideType?: PlaylistItemType;
  bibleVersion?: BibleVersion;
  playlistItemId?: string;
  /** Draw that chooses the background from the theme's background rotation. */
  backgroundSeed?: string;
  previewMode?: "default" | "compact";
}

const props = withDefaults(defineProps<SlideDisplayProps>(), {
  currentIndex: 0,
  previewMode: "default",
});

const visuals = useSlideVisuals(
  () => props.theme,
  () => props.bibleVersion,
  () => props.slideType,
  () => props.backgroundSeed,
);
const frameRef = ref<HTMLElement | null>(null);
const { scale, frame } = useSlideFrame(frameRef);

const compact = computed(() => props.previewMode === "compact");
const framePadding = computed(() => 32 * scale.value);
const sidePadding = computed(() => visuals.value.textMargin * scale.value);
const titleFontSize = computed(() => 14 * scale.value * visuals.value.fontScale);
const titleGap = computed(() => 14 * scale.value);
const bodyFontSize = computed(() => 40 * scale.value * visuals.value.fontScale);
const footerFontSize = computed(() => 13 * scale.value * visuals.value.fontScale);
const viewportHeight = computed(() => frame.height * 0.74);
const titleTop = computed(
  () =>
    frame.height * 0.5 - viewportHeight.value * 0.5 - titleGap.value * 2.4,
);

const slideList = computed(() =>
  props.slides && props.slides.length > 0 ? props.slides : [props.slide],
);
</script>

<template>
  <MediaSlide
    v-if="props.slide.media"
    :media="props.slide.media"
    :alt="props.slide.title"
    :item-id="props.playlistItemId"
  />
  <Transition v-else name="slide-display" appear>
    <div
      :key="props.playlistItemId"
      ref="frameRef"
      class="dark-mode absolute inset-0 select-none overflow-hidden"
    >
      <SlideBackground
        :background-url="visuals.backgroundUrl"
        :background-fill="visuals.backgroundFill"
        :background-opacity="visuals.backgroundOpacity"
        :gradient-color="visuals.gradientColor"
        :gradient-animated="visuals.gradientAnimated"
      />
      <EmberLayer v-if="visuals.embersEnabled" />
      <RainLayer v-if="visuals.rainEnabled" />
      <SnowLayer v-if="visuals.snowEnabled" />

      <div
        class="slide-display-root absolute inset-0 flex flex-col items-center justify-center text-center"
        :style="{
          fontFamily: visuals.fontFamily,
          padding: `${framePadding}px`,
        }"
      >
        <div
          class="absolute inset-0 z-20 flex flex-col items-center justify-center text-center"
        >
          <SlideTitle
            v-if="!props.slide.countdown && visuals.titleStyle.visible"
            :text="props.slide.title"
            :style="visuals.titleStyle"
            :font-size="titleFontSize"
            :top="titleTop"
            :scale="scale"
            :compact="compact"
          />

          <CountdownSlide
            v-if="props.slide.countdown"
            :time="props.slide.countdown.time"
            :transition="props.slide.countdown.transition ?? 'none'"
            :text-before="props.slide.countdown.textBefore"
            :text-after="props.slide.countdown.textAfter"
            :final-message="props.slide.countdown.finalMessage"
            :viewport-height="viewportHeight"
            :anchor="visuals.textAnchor"
            :font-size="bodyFontSize"
            :strong-shadow="compact"
          />
          <SlideText
            v-else
            :text="props.slide.text"
            :slides="slideList"
            :current-index="props.currentIndex"
            :visuals="visuals"
            :anchor="visuals.textAnchor"
            :viewport-height="viewportHeight"
            :font-size="bodyFontSize"
            :side-padding="sidePadding"
            :gap="18 * scale"
            :strong-shadow="compact"
          />
        </div>

        <div
          v-if="visuals.bibleVersionLabel"
          class="absolute left-0 right-0 z-30 flex items-center justify-center"
          :style="{ bottom: `${28 * scale}px` }"
        >
          <span
            class="relative z-20 uppercase font-bold"
            :class="compact ? 'text-foreground' : 'text-muted-foreground/80'"
            :style="{
              fontSize: `${footerFontSize}px`,
              lineHeight: 1.24,
              letterSpacing: `${footerFontSize * 0.22}px`,
            }"
          >
            {{ visuals.bibleVersionLabel }}
          </span>
        </div>
      </div>
    </div>
  </Transition>
</template>

<style scoped>
/*
 * Replaces React's AnimatePresence/motion.div (1.5s fade-in).
 * The old mount leaves immediately (no exit animation in the original).
 */
.slide-display-enter-active {
  transition: opacity 1.5s;
}

.slide-display-enter-from {
  opacity: 0;
}

.slide-display-leave-active {
  display: none;
}
</style>
