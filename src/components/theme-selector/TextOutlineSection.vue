<script setup lang="ts">
import ColorField from "@/components/ui/ColorField.vue";
import Input from "@/components/ui/Input.vue";
import { DEFAULT_TEXT_OUTLINE } from "@/core/state/theme/themeNormalization";
import { NumberUtils } from "@/core/utils/NumberUtils";
import { useTextStyle } from "./TextStyleContext";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const style = useTextStyle();

function outline() {
  return style().textOutline ?? DEFAULT_TEXT_OUTLINE;
}

function setColor(color: string) {
  style().textOutline = { ...outline(), color };
}

function setWidth(value: string | number | null) {
  const width = NumberUtils.parse(value, outline().width);
  style().textOutline = { ...outline(), width };
}
</script>

<template>
  <div class="flex items-end gap-3">
    <ColorField id="text-outline-color" :label="t('components.themeSelector.color')" :model-value="outline().color" @update:model-value="setColor" />
    <div class="w-24">
      <Input type="number" :label="t('components.themeSelector.thickness')" :model-value="outline().width" @update:model-value="setWidth" />
    </div>
  </div>
</template>
