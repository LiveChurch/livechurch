<script setup lang="ts">
import { computed } from "vue";
import SlideDisplay from "@/components/slides/SlideDisplay/SlideDisplay.vue";
import AppIcon from "@/components/ui/AppIcon.vue";
import type { Slide } from "@/core/types/playlist";
import type { SlidesTheme } from "@/core/types/theme";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Theme field of a playlist item (form or Live panel): shows the
 * currently applied theme and a shortcut to change it (opens `ItemThemeModal`).
 * Reusable by any item type.
 */
withDefaults(
  defineProps<{ theme: SlidesTheme; buttonLabel?: string; disabled?: boolean }>(),
  { disabled: false },
);

const emit = defineEmits<{ changeTheme: [] }>();

const PREVIEW_SLIDE = computed<Slide>(() => ({ title: "", text: t("common.terms.sampleText") }));
</script>

<template>
  <div class="flex flex-col gap-2">
    <span class="text-sm font-medium text-muted-foreground">{{ t('components.itemTheme.theme') }}</span>
    <div class="flex items-center gap-3 rounded-lg border border-border bg-surface p-2">
      <div
        class="relative aspect-video w-32 shrink-0 overflow-hidden rounded-md border border-border/70 bg-media"
      >
        <SlideDisplay :slide="PREVIEW_SLIDE" :theme="theme" preview-mode="compact" />
      </div>
      <span class="flex-1 truncate text-sm text-surface-foreground">
        {{ theme.name || t("common.terms.unnamedTheme") }}
      </span>
      <button
        type="button"
        class="flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-light/60 hover:text-surface-foreground disabled:cursor-not-allowed disabled:opacity-50"
        :disabled="disabled"
        @click="emit('changeTheme')"
      >
        <AppIcon name="swap_horiz" size="14px" />
        {{ buttonLabel ?? t('components.itemTheme.changeTheme') }}
      </button>
    </div>
  </div>
</template>
