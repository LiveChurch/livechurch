<script setup lang="ts">
import { computed } from "vue";
import Slider from "primevue/slider";
import ColorField from "@/components/ui/ColorField.vue";
import ToggleSwitch from "@/components/ui/ToggleSwitch.vue";
import {
  BROADCAST_BACKGROUND_PADDING,
  BROADCAST_OUTLINE_WIDTH,
} from "@/core/constants/broadcast";
import { useBroadcastStore } from "@/core/state/broadcast/broadcastStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Background (no rounded corners) and outline of the lyrics; they edit the store directly. */
const { state } = useBroadcastStore();
const style = state.style;

const opacityPercent = computed(() => Math.round(style.textBackground.opacity * 100));

const setOpacity = (value: number | number[] | undefined) => {
  if (typeof value === "number") style.textBackground.opacity = value / 100;
};

const PADDING_AXES = [
  { key: "paddingX", label: t("modals.broadcast.paddingX") },
  { key: "paddingY", label: t("modals.broadcast.paddingY") },
] as const;

const setPadding = (axis: "paddingX" | "paddingY", value: number | number[] | undefined) => {
  if (typeof value === "number") style.textBackground[axis] = value;
};

const setOutlineWidth = (value: number | number[] | undefined) => {
  if (typeof value === "number") style.textOutline.width = value;
};
</script>

<template>
  <div class="flex flex-col gap-4">
    <ToggleSwitch id="broadcast-bg" v-model="style.textBackground.enabled" :label="t('modals.broadcast.textBackground')" />

    <div v-if="style.textBackground.enabled" class="flex flex-col gap-3">
      <ColorField id="broadcast-bg-color" v-model="style.textBackground.color" :label="t('modals.broadcast.backgroundColor')" />

      <div class="flex items-center gap-3">
        <span id="broadcast-bg-opacity" class="text-sm font-medium text-muted-foreground">
          {{ t('components.themeSelector.opacity') }}
        </span>
        <Slider
          :model-value="opacityPercent"
          :min="0"
          :max="100"
          :step="5"
          aria-labelledby="broadcast-bg-opacity"
          class="min-w-0 flex-1"
          @update:model-value="setOpacity"
        />
        <span class="w-12 text-right text-xs tabular-nums text-muted-foreground">
          {{ opacityPercent }}%
        </span>
      </div>

      <div v-for="axis in PADDING_AXES" :key="axis.key" class="flex items-center gap-3">
        <span :id="`broadcast-bg-${axis.key}`" class="text-sm font-medium text-muted-foreground">
          {{ axis.label }}
        </span>
        <Slider
          :model-value="style.textBackground[axis.key]"
          :min="BROADCAST_BACKGROUND_PADDING.min"
          :max="BROADCAST_BACKGROUND_PADDING.max"
          :step="BROADCAST_BACKGROUND_PADDING.step"
          :aria-labelledby="`broadcast-bg-${axis.key}`"
          class="min-w-0 flex-1"
          @update:model-value="setPadding(axis.key, $event)"
        />
        <span class="w-12 text-right text-xs tabular-nums text-muted-foreground">
          {{ style.textBackground[axis.key] }}px
        </span>
      </div>
    </div>

    <div class="flex flex-wrap items-center gap-3">
      <ColorField id="broadcast-outline-color" v-model="style.textOutline.color" :label="t('modals.broadcast.outlineColor')" />
      <span id="broadcast-outline-width" class="text-sm font-medium text-muted-foreground">
        {{ t('components.themeSelector.outline') }}
      </span>
      <Slider
        :model-value="style.textOutline.width"
        :min="BROADCAST_OUTLINE_WIDTH.min"
        :max="BROADCAST_OUTLINE_WIDTH.max"
        :step="BROADCAST_OUTLINE_WIDTH.step"
        aria-labelledby="broadcast-outline-width"
        class="min-w-0 flex-1"
        @update:model-value="setOutlineWidth"
      />
      <span class="w-12 text-right text-xs tabular-nums text-muted-foreground">
        {{ style.textOutline.width }}px
      </span>
    </div>
  </div>
</template>
