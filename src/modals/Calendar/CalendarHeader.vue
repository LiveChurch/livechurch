<script setup lang="ts">
import { computed } from "vue";
import { format } from "date-fns";
import { DateLocales } from "@/core/i18n/DateLocales";
import Button from "primevue/button";
import AppIcon from "@/components/ui/AppIcon.vue";
import { useCalendarModal } from "./useCalendarModal";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Porta src/modals/calendar/CalendarHeader.tsx */
const emit = defineEmits<{ close: [] }>();

const modal = useCalendarModal();

const monthLabel = computed(() =>
  format(modal.currentDate, "MMMM yyyy", { locale: DateLocales.dateFns() }),
);
</script>

<template>
  <div class="flex items-center justify-between border-b border-border bg-surface p-4">
    <div class="flex items-center gap-4">
      <h2 class="text-xl font-bold text-surface-foreground flex items-center gap-2">
        <AppIcon name="app~calendar" size="24px" class="text-brand" />
        {{ t('modals.calendar.title') }}
      </h2>
      <div class="flex items-center rounded-lg border border-border bg-surface p-1">
        <Button
          variant="text"
          severity="secondary"
          class="rounded p-1 text-muted-foreground hover:bg-surface-light/60 hover:text-surface-foreground"
          icon="pi pi-chevron-left"
          :title="t('modals.calendar.previousMonth')"
          @click="modal.prevMonth()"
        />
        <span class="px-3 text-sm font-medium text-surface-foreground min-w-[120px] text-center capitalize">
          {{ monthLabel }}
        </span>
        <Button
          variant="text"
          severity="secondary"
          class="rounded px-1 text-muted-foreground hover:bg-surface-light/60 hover:text-surface-foreground"
          icon="pi pi-chevron-right"
          :title="t('modals.calendar.nextMonth')"
          @click="modal.nextMonth()"
        />
      </div>
      <Button
        variant="text"
        severity="secondary"
        class="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-surface-light/30 hover:text-surface-foreground"
        @click="modal.goToday()"
      >
        {{ t('common.calendar.today') }}
      </Button>
    </div>

    <div class="flex items-center gap-2">
      <Button
        class="rounded-lg bg-brand px-3 py-1.5 text-xs font-bold text-white hover:bg-brand/90 transition-colors"
        icon="pi pi-plus"
        :label="t('modals.calendar.newEvent')"
        @click="modal.openEventForm(new Date())"
      />
      <Button
        variant="text"
        severity="secondary"
        class="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface-light/60 hover:text-surface-foreground"
        icon="pi pi-times"
        :aria-label="t('modals.calendar.closeCalendar')"
        @click="emit('close')"
      />
    </div>
  </div>
</template>
