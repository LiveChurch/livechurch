<script setup lang="ts">
import type { CSSProperties } from "vue";
import { SNOW_FLAKES, type SnowFlake } from "./snowFlakes";

type CssVars = CSSProperties & Record<`--${string}`, string>;

function flakeStyle(flake: SnowFlake): CssVars {
  return {
    left: flake.left,
    "--size": flake.size,
    "--dur": flake.duration,
    "--delay": flake.delay,
    "--opacity": flake.opacity,
    "--blur": flake.blur,
    "--sway": flake.sway,
    "--sway-dur": flake.swayDuration,
  };
}
</script>

<template>
  <div class="snow-layer">
    <span
      v-for="(flake, index) in SNOW_FLAKES"
      :key="index"
      class="snow-flake"
      :style="flakeStyle(flake)"
    />
  </div>
</template>
