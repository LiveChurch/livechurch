<script setup lang="ts">
import { computed } from "vue";
import { useCountdown } from "@/core/composables/useCountdown";
import type { CountdownTransition } from "@/core/types/playlist";
import type { TextAnchor } from "@/core/types/theme";
import CountdownDigits from "./CountdownDigits.vue";
import { TEXT_ANCHOR_POSITION } from "./textAnchor";

/** The remaining time is the slide's highlight, so it gets a larger body than regular text. */
const FONT_SCALE = 2.5;
/** The final message is a sentence, so it uses a smaller body than the clock's. */
const FINAL_MESSAGE_FONT_SCALE = 1.5;

interface CountdownSlideProps {
  time: string;
  transition: CountdownTransition;
  textBefore?: string;
  textAfter?: string;
  finalMessage?: string;
  viewportHeight: number;
  anchor: TextAnchor;
  fontSize: number;
  strongShadow: boolean;
}

const props = defineProps<CountdownSlideProps>();

const { label, isFinished } = useCountdown(() => props.time);

const showFinalMessage = computed(() => isFinished.value && !!props.finalMessage);
const fontScale = computed(() => (showFinalMessage.value ? FINAL_MESSAGE_FONT_SCALE : FONT_SCALE));
const shadowClass = computed(() =>
  props.strongShadow ? "drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]" : "drop-shadow-xl",
);
</script>

<template>
  <div
    class="absolute left-0 right-0 top-1/2 -translate-y-1/2"
    :style="{ height: `${props.viewportHeight}px` }"
  >
    <div
      class="absolute left-0 right-0 flex flex-col items-center gap-[0.3em] text-foreground"
      :class="shadowClass"
      :style="{
        ...TEXT_ANCHOR_POSITION[props.anchor],
        fontSize: `${props.fontSize}px`,
        lineHeight: 1.2,
      }"
    >
      <p v-if="props.textBefore && !showFinalMessage" class="font-semibold">
        {{ props.textBefore }}
      </p>
      <h1 class="font-bold tabular-nums" :style="{ fontSize: `${fontScale}em` }">
        <template v-if="showFinalMessage">{{ props.finalMessage }}</template>
        <CountdownDigits v-else :text="label" :transition="props.transition" />
      </h1>
      <p v-if="props.textAfter && !showFinalMessage" class="font-semibold">
        {{ props.textAfter }}
      </p>
    </div>
  </div>
</template>
