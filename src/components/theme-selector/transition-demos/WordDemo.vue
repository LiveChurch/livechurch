<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const WORDS = t("components.themeSelector.demoLine1").split(" ");
</script>

<template>
  <div class="flex flex-wrap justify-center gap-x-1 [perspective:400px]">
    <span
      v-for="(word, index) in WORDS"
      :key="index"
      class="word-demo inline-block"
      :style="{ animationDelay: `${index * 0.18}s` }"
    >
      {{ word }}
    </span>
  </div>
</template>

<style scoped>
/* Same movement as WordBehindSlide (word "spinning" from back to front). */
.word-demo {
  opacity: 0;
  animation: word-demo 3.6s cubic-bezier(0.22, 1, 0.36, 1) infinite both;
}

@keyframes word-demo {
  0% {
    opacity: 0;
    transform: translateY(0.55em) rotateX(-65deg);
  }

  18%,
  78% {
    opacity: 1;
    transform: translateY(0) rotateX(0deg);
  }

  90%,
  100% {
    opacity: 0;
    transform: translateY(0) rotateX(0deg);
  }
}

@media (prefers-reduced-motion: reduce) {
  .word-demo {
    animation: none;
    opacity: 1;
  }
}
</style>
