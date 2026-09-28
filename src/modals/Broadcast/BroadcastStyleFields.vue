<script setup lang="ts">
import { computed } from "vue";
import SelectButton from "primevue/selectbutton";
import Slider from "primevue/slider";
import ToggleSwitch from "@/components/ui/ToggleSwitch.vue";
import { BROADCAST_FONT_SCALE, BROADCAST_KEY_PRESETS, BROADCAST_OFFSET } from "@/core/constants/broadcast";
import { useBroadcastStore } from "@/core/state/broadcast/broadcastStore";
import type { BroadcastPosition } from "@/core/types/broadcast";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Caption settings; they edit the store directly, which sends each change live.
 * Font, colors and transition are not here: they come from the on-air slide's theme.
 */
const { state } = useBroadcastStore();
const style = state.style;

const POSITION_OPTIONS: { label: string; value: BroadcastPosition }[] = [
  { label: t("modals.broadcast.bottom"), value: "bottom" },
  { label: t("modals.broadcast.top"), value: "top" },
];

const fontPercent = computed(() => Math.round(style.fontScale * 100));

const setOffset = (axis: "offsetX" | "offsetY", value: number | number[] | undefined) => {
  if (typeof value === "number") style[axis] = value;
};

const setFontPercent = (value: number | number[] | undefined) => {
  if (typeof value === "number") style.fontScale = value / 100;
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
      <ToggleSwitch id="broadcast-visible" v-model="style.visible" :label="t('modals.broadcast.captionVisible')" />
      <ToggleSwitch
        id="broadcast-reference"
        v-model="style.showReference"
        :label="t('modals.broadcast.bibleReference')"
      />
    </div>

    <div class="flex flex-wrap gap-x-6 gap-y-4">
      <div class="flex flex-col gap-1.5">
        <span id="broadcast-position" class="text-sm font-medium text-muted-foreground">
          {{ t('modals.broadcast.position') }}
        </span>
        <SelectButton
          v-model="style.position"
          :options="POSITION_OPTIONS"
          option-label="label"
          option-value="value"
          :allow-empty="false"
          aria-labelledby="broadcast-position"
        />
      </div>

      <div class="flex flex-col gap-1.5">
        <span id="broadcast-key" class="text-sm font-medium text-muted-foreground">
          {{ t('modals.broadcast.keyBackground') }}
        </span>
        <SelectButton
          v-model="style.keyColor"
          :options="BROADCAST_KEY_PRESETS"
          option-label="label"
          option-value="value"
          :allow-empty="false"
          aria-labelledby="broadcast-key"
        />
      </div>
    </div>


    <div class="flex items-center gap-3">
      <span id="broadcast-offset-x" class="text-sm font-medium text-muted-foreground">
        {{ t('modals.broadcast.positionX') }}
      </span>
      <Slider
        :model-value="style.offsetX"
        :min="BROADCAST_OFFSET.min"
        :max="BROADCAST_OFFSET.max"
        :step="BROADCAST_OFFSET.step"
        aria-labelledby="broadcast-offset-x"
        class="min-w-0 flex-1"
        @update:model-value="setOffset('offsetX', $event)"
      />
      <span class="w-12 text-right text-xs tabular-nums text-muted-foreground">
        {{ style.offsetX }}%
      </span>
    </div>
    <div class="flex items-center gap-3">
      <span id="broadcast-offset-y" class="text-sm font-medium text-muted-foreground">
        {{ t('modals.broadcast.positionY') }}
      </span>
      <Slider
        :model-value="style.offsetY"
        :min="BROADCAST_OFFSET.min"
        :max="BROADCAST_OFFSET.max"
        :step="BROADCAST_OFFSET.step"
        aria-labelledby="broadcast-offset-y"
        class="min-w-0 flex-1"
        @update:model-value="setOffset('offsetY', $event)"
      />
      <span class="w-12 text-right text-xs tabular-nums text-muted-foreground">
        {{ style.offsetY }}%
      </span>
    </div>
    <div class="flex items-center gap-3">
      <span id="broadcast-font-size" class="text-sm font-medium text-muted-foreground">
        {{ t('modals.broadcast.fontSize') }}
      </span>
      <Slider
        :model-value="fontPercent"
        :min="BROADCAST_FONT_SCALE.min * 100"
        :max="BROADCAST_FONT_SCALE.max * 100"
        :step="BROADCAST_FONT_SCALE.step * 100"
        aria-labelledby="broadcast-font-size"
        class="min-w-0 flex-1"
        @update:model-value="setFontPercent"
      />
      <span class="w-12 text-right text-xs tabular-nums text-muted-foreground">
        {{ fontPercent }}%
      </span>
    </div>
  </div>
</template>
