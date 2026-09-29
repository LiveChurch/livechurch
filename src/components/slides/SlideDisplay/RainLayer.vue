<script setup lang="ts">
import type { CSSProperties } from "vue";
import { RAIN_DROPS, RAIN_SPLASHES, type RainDrop, type RainSplash } from "./rainDrops";

type CssVars = CSSProperties & Record<`--${string}`, string>;

function dropStyle(drop: RainDrop): CssVars {
  return {
    left: drop.left,
    "--width": drop.width,
    "--length": drop.length,
    "--dur": drop.duration,
    "--delay": drop.delay,
    "--opacity": drop.opacity,
    "--blur": drop.blur,
  };
}

function splashStyle(splash: RainSplash): CssVars {
  return {
    left: splash.left,
    bottom: splash.bottom,
    "--size": splash.size,
    "--dur": splash.duration,
    "--delay": splash.delay,
    "--opacity": splash.opacity,
  };
}
</script>

<template>
  <div class="rain-layer">
    <div class="rain-sheet">
      <span
        v-for="(drop, index) in RAIN_DROPS"
        :key="index"
        class="rain-drop"
        :style="dropStyle(drop)"
      />
    </div>
    <span
      v-for="(splash, index) in RAIN_SPLASHES"
      :key="`splash-${index}`"
      class="rain-splash"
      :style="splashStyle(splash)"
    />
  </div>
</template>
