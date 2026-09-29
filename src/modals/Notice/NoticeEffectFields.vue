<script setup lang="ts">
import SelectButton from "primevue/selectbutton";
import type { LiveNotice, NoticeEffect, NoticeMarqueeSpeed } from "@/core/types/live";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Effect of the notice text (still or scrolling ticker) and ticker speed. */
defineProps<{
  draft: LiveNotice;
}>();

const EFFECT_OPTIONS: { label: string; value: NoticeEffect }[] = [
  { label: t("modals.notice.static"), value: "static" },
  { label: t("modals.notice.marquee"), value: "marquee" },
];

const SPEED_OPTIONS: { label: string; value: NoticeMarqueeSpeed }[] = [
  { label: t("modals.notice.slow"), value: "slow" },
  { label: t("modals.notice.normal"), value: "normal" },
  { label: t("modals.notice.fast"), value: "fast" },
];
</script>

<template>
  <div class="flex flex-wrap gap-x-6 gap-y-4">
    <div class="flex flex-col gap-1.5">
      <span id="notice-effect" class="text-sm font-medium text-muted-foreground">{{ t('modals.notice.effect') }}</span>
      <SelectButton
        v-model="draft.effect"
        :options="EFFECT_OPTIONS"
        option-label="label"
        option-value="value"
        :allow-empty="false"
        aria-labelledby="notice-effect"
      />
    </div>

    <div v-if="draft.effect === 'marquee'" class="flex flex-col gap-1.5">
      <span id="notice-marquee-speed" class="text-sm font-medium text-muted-foreground">
        {{ t('modals.notice.speed') }}
      </span>
      <SelectButton
        v-model="draft.marqueeSpeed"
        :options="SPEED_OPTIONS"
        option-label="label"
        option-value="value"
        :allow-empty="false"
        aria-labelledby="notice-marquee-speed"
      />
    </div>
  </div>
</template>
