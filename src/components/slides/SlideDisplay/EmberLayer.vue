<script setup lang="ts">
import type { CSSProperties } from "vue";

type EmberStyle = CSSProperties & {
  "--size"?: string;
  "--dur"?: string;
  "--delay"?: string;
  "--drift"?: string;
};

const EMBER_PRESETS = [
  { left: "8%", size: "5px", duration: "5.6s", delay: "-1.2s", drift: "14px" },
  { left: "16%", size: "7px", duration: "6.2s", delay: "-3.1s", drift: "-10px" },
  { left: "24%", size: "4px", duration: "5.1s", delay: "-2.4s", drift: "8px" },
  { left: "33%", size: "6px", duration: "6.8s", delay: "-4s", drift: "-16px" },
  { left: "41%", size: "5px", duration: "5.4s", delay: "-0.8s", drift: "12px" },
  { left: "50%", size: "8px", duration: "6s", delay: "-2s", drift: "-8px" },
  { left: "58%", size: "5px", duration: "5.7s", delay: "-3.7s", drift: "10px" },
  { left: "66%", size: "6px", duration: "6.4s", delay: "-1.7s", drift: "-12px" },
  { left: "74%", size: "4px", duration: "5.3s", delay: "-4.6s", drift: "9px" },
  { left: "82%", size: "7px", duration: "6.9s", delay: "-2.9s", drift: "-14px" },
  { left: "90%", size: "5px", duration: "5.8s", delay: "-0.5s", drift: "11px" },
];
</script>

<template>
  <div class="embers-layer">
    <span
      v-for="(ember, index) in EMBER_PRESETS"
      :key="index"
      class="ember"
      :style="
        {
          left: ember.left,
          '--size': ember.size,
          '--dur': ember.duration,
          '--delay': ember.delay,
          '--drift': ember.drift,
        } as EmberStyle
      "
    />
  </div>
</template>
