<script setup lang="ts">
import Slider from "primevue/slider";
import ColorField from "@/components/ui/ColorField.vue";
import Input from "@/components/ui/Input.vue";
import ToggleSwitch from "@/components/ui/ToggleSwitch.vue";
import { DEFAULT_TEXT_BACKGROUND } from "@/core/state/theme/themeNormalization";
import { NumberUtils } from "@/core/utils/NumberUtils";
import { useTextStyle } from "./TextStyleContext";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const style = useTextStyle();

function background() {
  return style().textBackground ?? DEFAULT_TEXT_BACKGROUND;
}

function setEnabled(enabled: boolean) {
  style().textBackground = { ...background(), enabled };
}

function setColor(color: string) {
  style().textBackground = { ...background(), color };
}

function setOpacity(value: number | number[] | undefined) {
  if (typeof value === "number") {
    style().textBackground = { ...background(), opacity: value / 100 };
  }
}

function setPadding(value: string | number | null) {
  const padding = NumberUtils.parse(value, background().padding);
  style().textBackground = { ...background(), padding };
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <ToggleSwitch :label="t('components.themeSelector.showTextBackground')" :model-value="background().enabled" @update:model-value="setEnabled" />

    <div v-if="background().enabled" class="flex flex-wrap items-end gap-3">
      <ColorField id="text-background-color" :label="t('components.themeSelector.backgroundColor')" :model-value="background().color" @update:model-value="setColor" />

      <div class="flex items-center gap-3">
        <span id="text-background-opacity-label" class="text-xs text-foreground">{{ t('components.themeSelector.opacity') }}</span>
        <Slider
          :model-value="Math.round(background().opacity * 100)"
          :min="0"
          :max="100"
          :step="5"
          aria-labelledby="text-background-opacity-label"
          class="w-32"
          @update:model-value="setOpacity"
        />
        <span class="w-10 text-right text-xs tabular-nums text-muted-foreground">{{ Math.round(background().opacity * 100) }}%</span>
      </div>

      <div class="w-24">
        <Input type="number" :label="t('components.themeSelector.spacingPx')" :model-value="background().padding" @update:model-value="setPadding" />
      </div>
    </div>
  </div>
</template>
