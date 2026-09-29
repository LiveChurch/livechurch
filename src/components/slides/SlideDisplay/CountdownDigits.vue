<script setup lang="ts">
import { computed } from "vue";
import type { CountdownTransition } from "@/core/types/playlist";

/**
 * Countdown clock with one digit per cell: when it changes, each digit
 * swaps with the chosen transition (e.g. rolling from bottom to top, like an odometer).
 */
const props = defineProps<{ text: string; transition: CountdownTransition }>();

/** The key is the position counted from the right, so the digits do not get mixed up when the hours disappear. */
const cells = computed(() =>
  props.text.split("").map((char, index) => ({
    char,
    key: props.text.length - index,
  })),
);
</script>

<template>
  <span class="inline-flex" :aria-label="props.text">
    <span v-for="cell in cells" :key="cell.key" class="digit-cell" aria-hidden="true">
      <Transition :name="`countdown-${props.transition}`" :css="props.transition !== 'none'">
        <span :key="cell.char" class="digit-value">{{ cell.char }}</span>
      </Transition>
    </span>
  </span>
</template>

<style scoped>
.digit-cell {
  position: relative;
  display: inline-block;
  overflow: hidden;
}

.digit-value {
  display: inline-block;
}

.countdown-fade-enter-active,
.countdown-fade-leave-active,
.countdown-roll-up-enter-active,
.countdown-roll-up-leave-active,
.countdown-roll-down-enter-active,
.countdown-roll-down-leave-active {
  transition:
    transform 0.4s ease,
    opacity 0.4s ease;
}

.countdown-fade-leave-active,
.countdown-roll-up-leave-active,
.countdown-roll-down-leave-active {
  position: absolute;
  top: 0;
  left: 0;
}

.countdown-fade-enter-from,
.countdown-fade-leave-to {
  opacity: 0;
}

.countdown-roll-up-enter-from,
.countdown-roll-down-leave-to {
  transform: translateY(100%);
}

.countdown-roll-up-leave-to,
.countdown-roll-down-enter-from {
  transform: translateY(-100%);
}
</style>
