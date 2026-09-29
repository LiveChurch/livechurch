<script setup lang="ts">
import Button from "primevue/button";
import { useI18n } from "vue-i18n";
import { cn } from "@/core/utils/ClassNameUtils";
import type { BibleVersion } from "@/core/types/playlist";

const { t } = useI18n();

defineProps<{ version: BibleVersion; active: boolean }>();

defineEmits<{
  (event: "select"): void;
  (event: "remove"): void;
}>();
</script>

<template>
  <div class="flex items-center gap-1">
    <Button
      type="button"
      variant="text"
      severity="secondary"
      role="menuitemradio"
      :aria-checked="active"
      :class="
        cn(
          'w-full [&_.p-button-label]:w-full rounded-lg border px-3 py-2 text-left font-normal transition-colors',
          active
            ? 'border-brand bg-brand/10 text-foreground'
            : 'border-transparent text-surface-foreground hover:border-border hover:bg-surface-light/30',
        )
      "
      @click="$emit('select')"
    >
      <span class="flex w-full items-center justify-between text-left">
        <span>
          <span class="block text-sm text-surface-foreground/90">{{ version.name }}</span>
          <span class="block text-xs text-muted-foreground">{{ version.description }}</span>
        </span>
        <i v-if="active" class="pi pi-check shrink-0 text-brand" />
      </span>
    </Button>
    <Button
      v-if="version.custom"
      type="button"
      variant="text"
      severity="secondary"
      icon="pi pi-trash"
      size="small"
      :aria-label="t('control.statusBar.removeBible')"
      @click="$emit('remove')"
    />
  </div>
</template>
