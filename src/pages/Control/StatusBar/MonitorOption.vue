<script setup lang="ts">
/**
 * Monitor option in MonitorMenu (port of
 * `src/pages/Control/StatusBar/MonitorOption.tsx`).
 * emits: select, identify (the identify button does an internal stopPropagation).
 */
import type { DesktopMonitor } from "@/core/types/desktop";
import Button from "primevue/button";
import AppIcon from "@/components/ui/AppIcon.vue";
import { cn } from "@/core/utils/ClassNameUtils";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  monitor: DesktopMonitor;
  index: number;
  selected: boolean;
  identifying: boolean;
}>();

const emit = defineEmits<{
  (event: "select"): void;
  (event: "identify"): void;
}>();

const sizeLabel = () =>
  props.monitor.size
    ? `${props.monitor.size.width}×${props.monitor.size.height}`
    : t("control.statusBar.unknownSize");

const positionLabel = () =>
  props.monitor.position
    ? `(${props.monitor.position.x}, ${props.monitor.position.y})`
    : t("control.statusBar.unknownPosition");
</script>

<template>
  <div
    role="menuitemradio"
    :aria-checked="selected"
    :tabindex="0"
    :class="
      cn(
        'flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg border px-3 py-2 text-left transition-colors',
        selected
          ? 'border-brand/60 bg-brand/10 text-foreground'
          : 'border-transparent text-surface-foreground/80 hover:border-border hover:bg-surface-light/30',
      )
    "
    @click="emit('select')"
    @keydown="
      (event: KeyboardEvent) => event.key === 'Enter' && emit('select')
    "
  >
    <div>
      <p class="text-sm text-surface-foreground/90">
        {{ monitor.name || `Monitor ${index + 1}` }}
      </p>
      <p class="text-xs text-muted-foreground">
        {{ sizeLabel() }} · {{ positionLabel() }}
      </p>
    </div>
    <div class="flex items-center gap-2">
      <AppIcon v-if="selected" name="app~check" size="16px" class="text-brand" />
      <Button
        type="button"
        variant="text"
        severity="secondary"
        :disabled="identifying"
        class="rounded-md border border-border px-2 py-1 text-xs uppercase tracking-wide text-surface-foreground hover:bg-surface-light/60 disabled:cursor-not-allowed disabled:opacity-50"
        @click="
          (event: MouseEvent) => {
            event.stopPropagation();
            emit('identify');
          }
        "
      >
        {{ identifying ? t("control.statusBar.identifying") : t("control.statusBar.identify") }}
      </Button>
    </div>
  </div>
</template>
