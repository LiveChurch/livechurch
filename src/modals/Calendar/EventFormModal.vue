<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import type { CalendarEvent } from "@/core/types/calendar";
import { useCalendarStore } from "@/core/state/calendar/calendarStore";
import EventForm from "./EventForm.vue";
import type { SubmissionEvent } from "./eventFormUtils";
import { useCalendarModal } from "./useCalendarModal";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Port of src/modals/calendar/EventFormModal.tsx.
 * Renders an inner PrimeVue <Dialog> controlled by the modal's
 * shared state (`showEventForm`), following the Vue plan.
 */
const modal = useCalendarModal();
const calendarCtx = useCalendarStore();

const visible = ref(false);
const initialDate = ref(new Date());
const editingEvent = ref<CalendarEvent | null>(null);

watch(
  () => modal.showEventForm,
  (open) => {
    if (open) {
      initialDate.value = modal.selectedDate ?? new Date();
      editingEvent.value = modal.editingEvent;
      visible.value = true;
    } else {
      visible.value = false;
    }
  },
  { immediate: true },
);

const title = computed(() =>
  editingEvent.value ? t("modals.calendar.editEvent") : t("modals.calendar.newEvent"),
);

/** Syncs the modal state when the user closes via ESC/outside click. */
const onAfterHide = () => {
  if (modal.showEventForm) modal.closeEventForm();
};

const handleCancel = () => modal.closeEventForm();

const handleSave = (eventData: SubmissionEvent) => {
  if (editingEvent.value) {
    calendarCtx.actions.updateEvent(editingEvent.value.id, eventData);
  } else {
    calendarCtx.actions.addEvent(eventData);
  }
  modal.closeEventForm();
};
</script>

<template>
  <Dialog
    v-model:visible="visible"
    modal
    :show-header="false"
    :closable="false"
    :dismissable-mask="true"
    :pt="{ mask: 'p-4', content: 'p-0', header: 'hidden', root: 'w-full max-w-lg overflow-hidden rounded-xl border-0 bg-surface p-0 ring-1 ring-border' }"
    @after-hide="onAfterHide"
  >
    <div class="flex items-center justify-between border-b border-border bg-surface p-4">
      <h2 class="text-lg font-bold text-surface-foreground">{{ title }}</h2>
      <Button
        variant="text"
        severity="secondary"
        class="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-surface-light/60 hover:text-surface-foreground"
        icon="pi pi-times"
        :title="t('common.actions.close')"
        @click="handleCancel"
      />
    </div>
    <div class="p-4">
      <EventForm
        :initial-date="initialDate"
        :editing-event="editingEvent"
        @save="handleSave"
        @cancel="handleCancel"
      />
    </div>
  </Dialog>
</template>
