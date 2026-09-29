<script setup lang="ts">
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const LINES = [t("components.themeSelector.demoLine1"), t("components.themeSelector.demoLine2"), t("components.themeSelector.demoLine3"), t("components.themeSelector.demoLine4")];
/** The first two lines repeat at the end so the loop returns to the start without a jump. */
const LOOP_LINES = [...LINES, ...LINES.slice(0, 2)];
</script>

<template>
  <div class="rise-demo relative flex-1 self-stretch overflow-hidden">
    <div class="rise-demo-track absolute inset-x-0 top-1/2 flex flex-col items-center">
      <span
        v-for="(line, index) in LOOP_LINES"
        :key="index"
        class="whitespace-nowrap leading-[1.8em]"
      >
        {{ line }}
      </span>
    </div>
  </div>
</template>

<style scoped>
.rise-demo {
  mask-image: linear-gradient(to bottom, transparent, black 35%, black 65%, transparent);
}

/* Each step rises exactly one line (1.8em) and stops, like the slide change. */
.rise-demo-track {
  animation: rise-demo 8s cubic-bezier(0.22, 1, 0.36, 1) infinite;
}

@keyframes rise-demo {
  0%,
  20% {
    transform: translateY(-0.9em);
  }

  25%,
  45% {
    transform: translateY(-2.7em);
  }

  50%,
  70% {
    transform: translateY(-4.5em);
  }

  75%,
  95% {
    transform: translateY(-6.3em);
  }

  100% {
    transform: translateY(-8.1em);
  }
}

@media (prefers-reduced-motion: reduce) {
  .rise-demo-track {
    animation: none;
    transform: translateY(-0.9em);
  }
}
</style>
