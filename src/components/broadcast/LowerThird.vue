<script setup lang="ts">
import { computed, ref } from "vue";
import SlideText from "@/components/slides/SlideDisplay/SlideText.vue";
import { useSlideFrame } from "@/components/slides/SlideDisplay/useSlideFrame";
import { useSlideVisuals, type SlideVisuals } from "@/components/slides/SlideDisplay/useSlideVisuals";
import { ColorUtils } from "@/core/utils/ColorUtils";
import { BROADCAST_BAND_FRACTION } from "@/core/constants/broadcast";
import type { BroadcastStyle } from "@/core/types/broadcast";
import type { LiveContent } from "@/core/types/playlist";
import { BroadcastCaptionUtils } from "@/core/utils/BroadcastCaptionUtils";
import { cn } from "@/core/utils/ClassNameUtils";

/**
 * Broadcast caption (lower third): the on-air slide text in a band at the top
 * or bottom, with the theme's text style and transition. Fills the whole parent,
 * which must be `relative`.
 */
const props = defineProps<{
  content: LiveContent | null;
  broadcastStyle: BroadcastStyle;
}>();

/** Base size of the slide body, the same as SlideDisplay's. */
const BASE_FONT_PX = 40;

const frameRef = ref<HTMLElement | null>(null);
const { scale, frame } = useSlideFrame(frameRef);
const visuals = useSlideVisuals(
  () => props.content?.theme,
  () => props.content?.bibleVersion,
  () => props.content?.itemType,
);

const caption = computed(() =>
  BroadcastCaptionUtils.hasCaption(props.content, props.broadcastStyle) ? props.content : null,
);
const reference = computed(() =>
  caption.value ? BroadcastCaptionUtils.reference(caption.value, props.broadcastStyle) : null,
);
/** Background and outline of the lyrics come from the broadcast setting, not from the theme. */
const captionVisuals = computed<SlideVisuals>(() => {
  const { textBackground, textOutline } = props.broadcastStyle;
  return {
    ...visuals.value,
    textBackground: {
      ...textBackground,
      padding: textBackground.paddingY * scale.value,
      paddingX: textBackground.paddingX * scale.value,
      radius: 0,
    },
    textOutline: { ...textOutline, width: textOutline.width * scale.value },
  };
});
const referenceStyle = computed(() => {
  const { textBackground, textOutline } = props.broadcastStyle;
  return {
    color: visuals.value.textColor || undefined,
    fontSize: `${fontSize.value * 0.45}px`,
    WebkitTextStroke:
      textOutline.width > 0 ? `${textOutline.width * scale.value}px ${textOutline.color}` : undefined,
    ...(textBackground.enabled && {
      backgroundColor: ColorUtils.toRgba(textBackground.color, textBackground.opacity),
      padding: `${textBackground.paddingY * scale.value}px ${textBackground.paddingX * scale.value}px`,
    }),
  };
});
/** Caption offset, in % of the window size. */
const offsetTransform = computed(
  () =>
    `translate(${(frame.width * props.broadcastStyle.offsetX) / 100}px, ${(frame.height * props.broadcastStyle.offsetY) / 100}px)`,
);
const bandHeight = computed(() => frame.height * BROADCAST_BAND_FRACTION);
const fontSize = computed(
  () => BASE_FONT_PX * scale.value * visuals.value.fontScale * props.broadcastStyle.fontScale,
);
</script>

<template>
  <div
    ref="frameRef"
    :class="
      cn(
        'dark-mode absolute inset-0 flex flex-col overflow-hidden',
        broadcastStyle.position === 'top' ? 'justify-start' : 'justify-end',
      )
    "
    :style="{ fontFamily: visuals.fontFamily, paddingBlock: `${24 * scale}px` }"
  >
    <Transition name="caption">
      <div
        v-if="caption"
        :key="caption.playlistItemId ?? 'caption'"
        class="flex flex-col"
        :style="{ gap: `${8 * scale}px`, transform: offsetTransform }"
      >
        <div class="relative" :style="{ height: `${bandHeight}px` }">
          <SlideText
            :text="caption.slide.text"
            :slides="caption.slides"
            :current-index="caption.slideIndex"
            :visuals="captionVisuals"
            :anchor="broadcastStyle.position"
            :viewport-height="bandHeight"
            :font-size="fontSize"
            :side-padding="visuals.textMargin * scale"
            :gap="18 * scale"
            :strong-shadow="false"
          />
        </div>
        <div v-if="reference" class="flex justify-center">
          <p
            class="text-center font-bold uppercase tracking-[0.2em] text-foreground drop-shadow-xl"
            :style="referenceStyle"
          >
            {{ reference }}
          </p>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.caption-enter-active,
.caption-leave-active {
  transition: opacity 0.4s;
}

.caption-enter-from,
.caption-leave-to {
  opacity: 0;
}
</style>
