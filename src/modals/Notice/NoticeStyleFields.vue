<script setup lang="ts">
import { computed } from "vue";
import Slider from "primevue/slider";
import { NOTICE_FONT_SCALE } from "@/core/constants/notice";
import type { LiveNotice } from "@/core/types/live";
import ColorField from "@/components/ui/ColorField.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Background and font colors and font size of the notice (edits the draft directly). */
const props = defineProps<{
  draft: LiveNotice;
}>();

const fontPercent = computed(() => Math.round(props.draft.fontScale * 100));

const setFontPercent = (value: number | number[] | undefined) => {
  if (typeof value === "number") props.draft.fontScale = value / 100;
};
</script>

<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-wrap items-center gap-x-6 gap-y-2">
      <ColorField
        id="notice-background-color"
        :label="t('components.themeSelector.backgroundColor')"
        :model-value="draft.backgroundColor"
        @update:model-value="draft.backgroundColor = $event"
      />
      <ColorField
        id="notice-text-color"
        :label="t('modals.notice.fontColor')"
        :model-value="draft.textColor"
        @update:model-value="draft.textColor = $event"
      />
    </div>

    <div class="flex items-center gap-3">
      <span id="notice-font-size" class="text-sm font-medium text-muted-foreground">
        {{ t('modals.broadcast.fontSize') }}
      </span>
      <Slider
        :model-value="fontPercent"
        :min="NOTICE_FONT_SCALE.min * 100"
        :max="NOTICE_FONT_SCALE.max * 100"
        :step="NOTICE_FONT_SCALE.step * 100"
        aria-labelledby="notice-font-size"
        class="min-w-0 flex-1"
        @update:model-value="setFontPercent"
      />
      <span class="w-12 text-right text-xs tabular-nums text-muted-foreground">
        {{ fontPercent }}%
      </span>
    </div>
  </div>
</template>
