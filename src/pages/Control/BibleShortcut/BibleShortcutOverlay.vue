<script setup lang="ts">
import { useBibleShortcut } from "./useBibleShortcut";
import { useI18n } from "vue-i18n";
import { useLanguageStore } from "@/core/state/language/languageStore";

const { t } = useI18n();
const languageState = useLanguageStore().state;

/** Quick shortcut overlay: shows what was typed and the verse or hymn found. */
const { isOpen, text, target, hint } = useBibleShortcut();
</script>

<template>
  <Transition name="bible-shortcut">
    <div
      v-if="isOpen"
      class="fixed inset-x-0 top-24 z-50 mx-auto flex w-full max-w-xl flex-col gap-3 rounded-xl border border-border bg-surface p-4 shadow-2xl"
      role="dialog"
      :aria-label="t(languageState.supportsHarpa ? 'control.bibleShortcut.label' : 'control.bibleShortcut.labelBibleOnly')"
    >
      <div class="flex items-baseline justify-between gap-4">
        <span class="text-2xl font-semibold text-surface-foreground">
          {{ text }}<span class="animate-pulse text-brand">|</span>
        </span>
        <span v-if="target" class="truncate text-sm text-muted-foreground">{{ target.label }}</span>
      </div>

      <p v-if="target" class="line-clamp-4 whitespace-pre-line text-sm text-surface-foreground">
        {{ target.preview }}
      </p>
      <p v-else class="text-sm text-muted-foreground">{{ hint }}</p>

      <p class="text-xs text-muted-foreground">{{ t('control.bibleShortcut.hint') }}</p>
    </div>
  </Transition>
</template>

<style scoped>
.bible-shortcut-enter-active,
.bible-shortcut-leave-active {
  transition: opacity 0.15s ease;
}

.bible-shortcut-enter-from,
.bible-shortcut-leave-to {
  opacity: 0;
}
</style>
