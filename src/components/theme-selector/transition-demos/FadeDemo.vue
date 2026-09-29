<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const PHRASES = [t("components.themeSelector.demoLine1"), t("components.themeSelector.demoLine2")];
</script>

<template>
  <div class="relative flex flex-1 items-center justify-center self-stretch">
    <span
      v-for="(phrase, index) in PHRASES"
      :key="phrase"
      class="fade-demo-line absolute"
      :style="{ animationDelay: `${index * 2}s` }"
    >
      {{ phrase }}
    </span>
  </div>
</template>

<style scoped>
.fade-demo-line {
  opacity: 0;
  animation: fade-demo 4s ease-in-out infinite both;
}

@keyframes fade-demo {
  0% {
    opacity: 0;
  }

  12%,
  42% {
    opacity: 1;
  }

  55%,
  100% {
    opacity: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .fade-demo-line {
    animation: none;
    opacity: 1;
  }
}
</style>
