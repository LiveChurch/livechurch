<script setup lang="ts">
import { computed } from "vue";
import { format, isBefore, isSameDay, isSameMonth, startOfDay } from "date-fns";
import { cn } from "@/core/utils/ClassNameUtils";
import { DateUtils } from "@/core/utils/DateUtils";
import type { CalendarEvent } from "@/core/types/calendar";
import { useCalendarModal } from "./useCalendarModal";

/** Porta src/modals/calendar/CalendarGrid.tsx */
const props = defineProps<{
  events: CalendarEvent[];
}>();

const modal = useCalendarModal();
const weekdayNames = computed(() => DateUtils.weekdayNames("short"));

// Optimize: Group events by day to avoid filtering inside the loop
const eventsByDay = computed(() => {
  const map = new Map<string, CalendarEvent[]>();
  props.events.forEach((event) => {
    if (event.instanceDate) {
      const dateKey = startOfDay(event.instanceDate).toISOString();
      if (!map.has(dateKey)) {
        map.set(dateKey, []);
      }
      map.get(dateKey)!.push(event);
    }
  });
  return map;
});

const cells = computed(() => {
  const today = new Date();
  return modal.daysInMonth.map((day) => {
    const dateKey = startOfDay(day).toISOString();
    return {
      day,
      dateKey,
      dayEvents: eventsByDay.value.get(dateKey) || [],
      isCurrentMonth: isSameMonth(day, modal.currentDate),
      isToday: isSameDay(day, today),
      isPast: isBefore(startOfDay(day), startOfDay(today)),
    };
  });
});
</script>

<template>
  <div class="flex-1 overflow-y-auto p-4">
    <div class="grid grid-cols-7 gap-px overflow-hidden rounded-lg border border-border bg-surface-light/40">
      <div
        v-for="day in weekdayNames"
        :key="day"
        class="bg-surface-light/50 py-2 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider"
      >
        {{ day }}
      </div>

      <div
        v-for="cell in cells"
        :key="cell.day.toISOString()"
        @click="!cell.isPast && modal.openEventForm(cell.day)"
        :class="cn(
          'flex min-h-[100px] flex-col gap-1 bg-surface/50 p-2 transition-colors',
          cell.isPast ? 'cursor-not-allowed opacity-40' : 'hover:bg-surface-light/80 cursor-pointer',
          !cell.isCurrentMonth && 'bg-surface-light/30 opacity-30',
          cell.isToday && 'bg-brand/5 ring-1 ring-inset ring-brand/40',
        )"
      >
        <span
          :class="cn(
            'ml-auto text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full',
            cell.isToday ? 'bg-brand text-white' : 'text-muted-foreground',
          )"
        >
          {{ format(cell.day, "d") }}
        </span>

        <div class="flex flex-col gap-1 mt-1">
          <div
            v-for="event in cell.dayEvents.slice(0, 4)"
            :key="`${event.id}-${event.instanceDate?.toISOString()}`"
            @click.stop="modal.openEditForm(event)"
            class="flex items-center gap-1.5 rounded px-1.5 py-0.5 text-xs font-medium text-white truncate shadow-sm hover:brightness-125 transition-all cursor-pointer"
            :style="{ backgroundColor: event.color || '#3b82f6' }"
            :title="`Editar: ${event.title}`"
          >
            <span class="opacity-75 text-xs">{{ event.time }}</span>
            <span class="truncate">{{ event.title }}</span>
          </div>
          <span
            v-if="cell.dayEvents.length > 4"
            class="text-xs text-muted-foreground/80 pl-1"
          >
            + {{ cell.dayEvents.length - 4 }} mais
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
