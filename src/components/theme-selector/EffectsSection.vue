<script setup lang="ts">
import { computed } from "vue";
import RainLayer from "@/components/slides/SlideDisplay/RainLayer.vue";
import SnowLayer from "@/components/slides/SlideDisplay/SnowLayer.vue";
import PreviewTile from "./PreviewTile.vue";
import { useThemeEditor } from "./ThemeEditorContext";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

type EffectId = "none" | "embers" | "rain" | "snow";

const editor = useThemeEditor();

const activeEffect = computed<EffectId>(() => {
  const effects = editor.currentTheme.effects;
  if (effects?.snow) return "snow";
  if (effects?.rain) return "rain";
  if (effects?.embers) return "embers";
  return "none";
});

function selectEffect(effect: EffectId) {
  editor.currentTheme.effects = {
    embers: effect === "embers",
    rain: effect === "rain",
    snow: effect === "snow",
  };
}

const emberDots = [
  { top: "20%", left: "30%", size: 6, opacity: 0.7 },
  { top: "45%", left: "60%", size: 4, opacity: 0.6 },
  { top: "35%", left: "75%", size: 5, opacity: 0.5 },
  { top: "60%", left: "40%", size: 7, opacity: 0.65 },
  { top: "70%", left: "25%", size: 4, opacity: 0.5 },
  { top: "55%", left: "15%", size: 3, opacity: 0.45 },
];
</script>

<template>
  <div class="p-4">
    <div class="grid grid-cols-[repeat(auto-fill,minmax(150px,1fr))] gap-3">
      <PreviewTile :label="t('modals.createPlaylist.none')" :active="activeEffect === 'none'" @select="selectEffect('none')">
        <div class="absolute inset-0 bg-overlay/40" />
      </PreviewTile>

      <PreviewTile :label="t('components.themeSelector.effects.embers')" :active="activeEffect === 'embers'" @select="selectEffect('embers')">
        <div class="absolute inset-0 bg-[#0f0a0a]" />
        <div class="absolute inset-0 overflow-hidden pointer-events-none">
          <div
            v-for="(dot, i) in emberDots"
            :key="i"
            class="absolute bg-orange-500 rounded-full blur-[1px]"
            :style="{
              top: dot.top,
              left: dot.left,
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              opacity: dot.opacity,
              boxShadow: '0 0 10px #f97316',
            }"
          />
          <div class="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-orange-950/40 to-transparent" />
        </div>
      </PreviewTile>

      <PreviewTile :label="t('components.themeSelector.effects.rain')" :active="activeEffect === 'rain'" @select="selectEffect('rain')">
        <div class="absolute inset-0 bg-gradient-to-b from-slate-900 to-[#05070c]" />
        <RainLayer />
      </PreviewTile>

      <PreviewTile :label="t('components.themeSelector.effects.snow')" :active="activeEffect === 'snow'" @select="selectEffect('snow')">
        <div class="absolute inset-0 bg-gradient-to-b from-slate-800 to-[#0b1020]" />
        <SnowLayer />
      </PreviewTile>
    </div>
  </div>
</template>
