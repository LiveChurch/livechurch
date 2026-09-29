<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "primevue/button";
import Slider from "primevue/slider";
import ImageUpload from "@/components/ui/ImageUpload.vue";
import ToggleSwitch from "@/components/ui/ToggleSwitch.vue";
import { WATERMARK_OPACITY, WATERMARK_SIZE } from "@/core/constants/watermark";
import { useWatermarkStore } from "@/core/state/watermark/watermarkStore";
import Modal from "../Modal.vue";
import WatermarkPositionGrid from "./WatermarkPositionGrid.vue";
import WatermarkPreview from "./WatermarkPreview.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Configures the fixed watermark (logo) over the slide. Changes are
 * applied right away in Control, Projector and Broadcast.
 */
const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const { state, actions } = useWatermarkStore();
const settings = state.settings;

const opacityPercent = computed(() => Math.round(settings.opacity * 100));

const setOpacityPercent = (value: number | number[] | undefined) => {
  if (typeof value === "number") settings.opacity = value / 100;
};

const setSizePercent = (value: number | number[] | undefined) => {
  if (typeof value === "number") settings.sizePercent = value;
};
</script>

<template>
  <Modal ref="modalRef" :title="t('control.statusBar.watermark')" class-name="max-w-3xl">
    <div class="flex gap-6">
      <div class="flex min-w-0 flex-1 flex-col gap-4">
        <ToggleSwitch id="watermark-enabled" v-model="settings.enabled" :label="t('modals.watermark.visible')" />

        <div class="flex flex-col gap-2">
          <span class="text-sm font-medium text-muted-foreground">{{ t('modals.watermark.logo') }}</span>
          <ImageUpload compact :aria-label="t('modals.watermark.uploadLogo')" @select="actions.setLogo" />
          <div v-if="settings.imageUrl" class="flex items-center gap-3">
            <img
              :src="settings.imageUrl"
              :alt="t('modals.watermark.currentLogo')"
              class="h-12 w-12 rounded border border-border bg-surface-light object-contain p-1"
            />
            <Button
              variant="text"
              severity="secondary"
              class="text-muted-foreground hover:text-danger-hover"
              :label="t('modals.watermark.removeLogo')"
              icon="pi pi-trash"
              @click="actions.removeLogo"
            />
          </div>
        </div>

        <div class="flex items-center gap-3">
          <span id="watermark-opacity" class="w-20 shrink-0 text-sm font-medium text-muted-foreground">
            {{ t('components.themeSelector.opacity') }}
          </span>
          <Slider
            :model-value="opacityPercent"
            :min="WATERMARK_OPACITY.min"
            :max="WATERMARK_OPACITY.max"
            :step="WATERMARK_OPACITY.step"
            aria-labelledby="watermark-opacity"
            class="min-w-0 flex-1"
            @update:model-value="setOpacityPercent"
          />
          <span class="w-10 text-right text-xs tabular-nums text-muted-foreground">{{ opacityPercent }}%</span>
        </div>

        <div class="flex items-center gap-3">
          <span id="watermark-size" class="w-20 shrink-0 text-sm font-medium text-muted-foreground">
            {{ t('modals.watermark.size') }}
          </span>
          <Slider
            :model-value="settings.sizePercent"
            :min="WATERMARK_SIZE.min"
            :max="WATERMARK_SIZE.max"
            :step="WATERMARK_SIZE.step"
            aria-labelledby="watermark-size"
            class="min-w-0 flex-1"
            @update:model-value="setSizePercent"
          />
          <span class="w-10 text-right text-xs tabular-nums text-muted-foreground">
            {{ settings.sizePercent }}%
          </span>
        </div>
      </div>

      <div class="flex min-w-0 flex-1 flex-col gap-4 border-l border-border/60 pl-6">
        <span class="text-sm font-medium text-muted-foreground">{{ t('modals.broadcast.position') }}</span>
        <WatermarkPositionGrid v-model="settings.position" />
        <WatermarkPreview :settings="settings" />
      </div>
    </div>

    <template #footer>
      <div class="flex w-full items-center gap-3">
        <Button
          variant="text"
          severity="secondary"
          class="text-muted-foreground hover:text-surface-foreground"
          :label="t('modals.broadcast.restoreDefaults')"
          icon="pi pi-refresh"
          @click="actions.resetSettings"
        />
        <Button
          class="ml-auto bg-primary text-white hover:bg-primary-hover"
          :label="t('common.actions.close')"
          @click="modalRef?.hide()"
        />
      </div>
    </template>
  </Modal>
</template>
