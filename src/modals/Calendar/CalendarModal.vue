<script setup lang="ts">
import { computed, inject, ref } from "vue";
import Dialog from "primevue/dialog";
import { useCalendarStore } from "@/core/state/calendar/calendarStore";
import { MODAL_HANDLE } from "../openModal";
import CalendarHeader from "./CalendarHeader.vue";
import CalendarGrid from "./CalendarGrid.vue";
import EventsList from "./EventsList.vue";
import EventFormModal from "./EventFormModal.vue";
import {
  createCalendarModalStore,
  provideCalendarModal,
} from "./useCalendarModal";

/**
 * Port of src/modals/CalendarModal.tsx (modal opened via openModal()).
 * React's local state (`useLocalObservable`) became a reactive store
 * created here and shared via provide/inject.
 */
const handle = inject(MODAL_HANDLE, null);
const visible = ref(true);

const calendarCtx = useCalendarStore();

const modal = provideCalendarModal(createCalendarModalStore());

const displayedEvents = computed(() => {
  const days = modal.daysInMonth;
  return days.length
    ? calendarCtx.actions.getEventsInRange({
        start: days[0],
        end: days[days.length - 1],
      })
    : [];
});

const handleClose = () => (visible.value = false);
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :closable="false"
    :show-header="false"
    :dismissable-mask="true"
    :pt="{ mask: 'bg-overlay/80 backdrop-blur-sm', root: 'w-full h-full max-w-none rounded-none border-0 bg-transparent p-0 shadow-none', content: 'h-full p-0' }"
    @after-hide="handle?.onHidden()"
  >
    <div class="flex h-full w-full items-center justify-center p-8">
      <div
        class="flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-xl bg-background shadow-2xl ring-1 ring-border"
      >
        <CalendarHeader @close="handleClose" />

        <div class="flex flex-1 overflow-hidden">
          <div class="flex-1 overflow-y-auto bg-background">
            <div class="p-4">
              <CalendarGrid :events="displayedEvents" />
              <EventsList :events="displayedEvents" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <EventFormModal />
  </Dialog>
</template>
