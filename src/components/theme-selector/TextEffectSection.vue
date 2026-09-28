<script setup lang="ts">
import ColorField from "@/components/ui/ColorField.vue";
import ToggleSwitch from "@/components/ui/ToggleSwitch.vue";
import SliderField from "./SliderField.vue";
import { DEFAULT_TEXT_SHADOW } from "@/core/state/theme/themeNormalization";
import { useTextStyle } from "./TextStyleContext";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const style = useTextStyle();

function shadow() {
  return style().textShadow ?? DEFAULT_TEXT_SHADOW;
}

function setEnabled(enabled: boolean) {
  style().textShadow = { ...shadow(), enabled };
}

function setColor(color: string) {
  style().textShadow = { ...shadow(), color };
}

function setBlur(blur: number) {
  style().textShadow = { ...shadow(), blur };
}

function setOffsetX(offsetX: number) {
  style().textShadow = { ...shadow(), offsetX };
}

function setOffsetY(offsetY: number) {
  style().textShadow = { ...shadow(), offsetY };
}
</script>

<template>
  <div class="flex flex-col gap-3">
    <ToggleSwitch :label="t('components.themeSelector.textShadow')" :model-value="shadow().enabled" @update:model-value="setEnabled" />

    <template v-if="shadow().enabled">
      <ColorField id="text-shadow-color" :label="t('components.themeSelector.shadowColor')" :model-value="shadow().color" @update:model-value="setColor" />
      <SliderField :label="t('components.themeSelector.blur')" :min="0" :max="200" :model-value="shadow().blur" @update:model-value="setBlur" />
      <SliderField :label="t('components.themeSelector.offsetX')" :min="-100" :max="100" :model-value="shadow().offsetX" @update:model-value="setOffsetX" />
      <SliderField :label="t('components.themeSelector.offsetY')" :min="-100" :max="100" :model-value="shadow().offsetY" @update:model-value="setOffsetY" />
    </template>
  </div>
</template>
