<script setup lang="ts">
import { computed } from "vue";
import { format, isSameMonth } from "date-fns";
import { DateLocales } from "@/core/i18n/DateLocales";
import Button from "primevue/button";
import AppIcon from "@/components/ui/AppIcon.vue";
import type { CalendarEvent } from "@/core/types/calendar";
import { useCalendarModal } from "./useCalendarModal";
import { useEventDelete } from "./useEventDelete";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Porta src/modals/calendar/EventsList.tsx */
const props = defineProps<{
  events: CalendarEvent[];
}>();

const modal = useCalendarModal();
const { requestDelete } = useEventDelete();

const formatWeekdayLabel = (date: Date) => {
  const weekday = format(date, "EEEE", { locale: DateLocales.dateFns() });
  return weekday.toUpperCase();
};

const monthLabel = computed(() => format(modal.currentDate, "MMMM", { locale: DateLocales.dateFns() }));

const groupedEvents = computed(() => {
  const groups: Record<string, CalendarEvent[]> = {};
  props.events.forEach((event) => {
    if (!event.instanceDate) return;
    // Filter to only show days belonging to the current selected month
    if (!isSameMonth(event.instanceDate, modal.currentDate)) return;

    const key = format(event.instanceDate, "yyyy-MM-dd");
    if (!groups[key]) groups[key] = [];
    groups[key].push(event);
  });

  const sortedKeys = Object.keys(groups).sort();
  return sortedKeys.map((dateKey) => ({
    date: new Date(dateKey + "T12:00:00"),
    events: groups[dateKey].sort((a, b) => a.time.localeCompare(b.time)),
  }));
});

/** A click on an icon propagates to the card (edit) without the component calling stopPropagation. */
const handleDeleteClick = (event: CalendarEvent, e?: Event) => {
  e?.stopPropagation();
  void requestDelete(event);
};
</script>

<template>
  <div class="mt-6 flex flex-col gap-6 pb-12 px-4">
    <h3 class="text-sm font-bold uppercase tracking-widest text-tertiary">
      Eventos de {{ monthLabel }}
    </h3>

    <div
      v-if="groupedEvents.length === 0"
      class="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-surface-light/30 p-8"
    >
      <AppIcon name="app~calendar" size="32px" class="mb-2 text-muted-foreground/40" />
      <p class="text-sm text-tertiary">{{ t('modals.calendar.noEvents') }}</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div
        v-for="group in groupedEvents"
        :key="group.date.toISOString()"
        class="flex flex-col gap-3 group"
      >
        <div class="flex items-center gap-3">
          <div class="min-w-0">
            <div class="flex items-baseline gap-2 text-primary">
              <span class="text-display-xs font-black leading-none">
                {{ format(group.date, "d") }}
              </span>
              <span class="text-sm font-bold tracking-[0.12em] text-tertiary">
                {{ formatWeekdayLabel(group.date) }}
              </span>
            </div>
          </div>
          <div class="h-px flex-1 bg-gradient-to-r from-surface-light/70 to-transparent" />
        </div>

        <div class="flex flex-col gap-1.5 pl-px">
          <div
            v-for="event in group.events"
            :key="`${event.id}-${event.instanceDate?.toISOString()}`"
            @click="modal.openEditForm(event)"
            class="cursor-pointer rounded-lg border border-border bg-surface-light/35 px-3 py-2.5 transition-all duration-200 hover:border-surface-light hover:bg-surface-light/60"
          >
            <div class="group/item relative">
              <div class="flex items-baseline justify-between">
                <h4
                  class="mr-2 truncate text-md font-semibold text-primary"
                  :title="event.title"
                >
                  {{ event.title }}
                </h4>
                <span class="rounded bg-surface-light/30 px-2 py-0.5 text-sm font-mono text-secondary">
                  {{ event.time }}
                </span>
              </div>
              <div
                v-if="event.recurrence === 'weekly'"
                class="mt-1 flex items-center gap-1 text-sm text-tertiary"
              >
                <AppIcon name="repeat" size="12px" />
                <span>{{ t('modals.calendar.weekly') }}</span>
              </div>
              <Button
                type="button"
                variant="text"
                severity="secondary"
                class="absolute -right-2 -top-1 p-1 text-danger opacity-0 transition-opacity group-hover/item:opacity-100 hover:text-danger-hover"
                icon="pi pi-trash"
                :title="t('modals.calendar.deleteEvent')"
                @click="handleDeleteClick(event, $event)"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
