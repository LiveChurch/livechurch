<script setup lang="ts">
import Input from "@/components/ui/Input.vue";
import { NumberUtils } from "@/core/utils/NumberUtils";
import { useTextStyle } from "./TextStyleContext";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const style = useTextStyle();

const setLineHeight = (value: string | number | null) => {
  style().lineHeight = NumberUtils.parse(value, style().lineHeight ?? 1.2);
};
const setLetterSpacing = (value: string | number | null) => {
  style().letterSpacing = NumberUtils.parse(value, style().letterSpacing ?? 0);
};
const setTextMargin = (value: string | number | null) => {
  style().textMargin = NumberUtils.parse(value, style().textMargin ?? 88);
};
</script>

<template>
  <div class="flex gap-2">
    <div class="w-20">
      <Input type="number" :label="t('components.themeSelector.lineHeight')" :model-value="style().lineHeight ?? 1.2" @update:model-value="setLineHeight" />
    </div>
    <div class="w-20">
      <Input type="number" :label="t('components.themeSelector.letterSpacing')" :model-value="style().letterSpacing ?? 0" @update:model-value="setLetterSpacing" />
    </div>
    <div class="w-20">
      <Input type="number" :label="t('components.themeSelector.margin')" :model-value="style().textMargin ?? 88" @update:model-value="setTextMargin" />
    </div>
  </div>
</template>
