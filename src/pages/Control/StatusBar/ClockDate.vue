<script setup lang="ts">
/**
 * Clock + date formatted in pt-BR (port of
 * `src/pages/Control/StatusBar/ClockDate.tsx`).
 */
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import { useClock } from "@/core/composables/useClock";

const { locale } = useI18n();

const timeFormatter = computed(
  () => new Intl.DateTimeFormat(locale.value, { hour: "2-digit", minute: "2-digit" }),
);

const dateFormatter = computed(
  () =>
    new Intl.DateTimeFormat(locale.value, { weekday: "short", day: "2-digit", month: "short" }),
);

const { now } = useClock();
</script>

<template>
  <div class="flex items-center gap-3 px-4">
    <time class="font-mono text-sm text-surface-foreground">
      {{ timeFormatter.format(now) }}
    </time>
    <span class="h-3 w-px bg-border" aria-hidden="true" />
    <span class="text-xs uppercase tracking-[0.3em] text-muted-foreground">
      {{ dateFormatter.format(now).replace(".", "").toUpperCase() }}
    </span>
  </div>
</template>
