<script setup lang="ts">
import { DateLocales } from "@/core/i18n/DateLocales";
import { ref } from "vue";
import Button from "primevue/button";
import DatePicker from "primevue/datepicker";
import { useCalendarStore } from "@/core/state/calendar/calendarStore";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { AgendaSlidesService } from "@/core/services/AgendaSlidesService";
import type { DateRange } from "@/core/types/calendar";
import Modal from "../Modal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Port of src/modals/AgendaSlidesCreatorModal.tsx (modal opened via openModal()).
 * react-hook-form + react-day-picker → refs + PrimeVue's <DatePicker selectionMode="range">.
 */
const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const close = () => modalRef.value?.hide();

const calendarCtx = useCalendarStore();
const playlistCtx = usePlaylistStore();

// React default: today through today + 7 days.
const defaultStart = new Date();
const defaultEnd = new Date();
defaultEnd.setDate(defaultEnd.getDate() + 7);

/** DatePicker model in range mode: [start, end]. */
const dateRange = ref<(Date | null)[] | null>([defaultStart, defaultEnd]);

const error = ref("");

const onSubmit = () => {
  const [from, to] = dateRange.value ?? [];
  if (!from) {
    error.value = t("modals.agenda.selectRange");
    return;
  }
  error.value = "";

  const range: DateRange = { start: from, end: to ?? from };
  const events = calendarCtx.actions.getEventsInRange(range);
  if (events.length === 0) {
    close();
    return;
  }

  playlistCtx.actions.addToPlaylist(
    AgendaSlidesService.buildPlaylistItem(events, range),
  );
  close();
};
</script>

<template>
  <Modal
    ref="modalRef"
    :title="t('modals.agenda.title')"
    class-name="max-w-4xl"
    content-class-name="p-0"
  >
    <div class="flex flex-col">
      <div class="p-6">
        <label class="mb-1.5 block text-sm font-medium text-muted-foreground">
          {{ t('modals.agenda.period') }}
        </label>
        <DatePicker
          v-model="dateRange"
          selection-mode="range"
          :date-format="DateLocales.datePickerFormat()"
          :placeholder="t('modals.agenda.selectPeriod')"
          :readonly="true"
          :number-of-months="2"
          hide-on-range-selection
          show-icon
          icon-display="bottom"
          fluid
          class="max-w-md"
        />
        <p v-if="error" class="mt-2 text-xs text-danger">{{ error }}</p>
      </div>

      <div
        class="flex justify-end gap-3 border-t border-border/60 bg-surface-light/30 p-4"
      >
        <Button
          variant="text"
          severity="secondary"
          class="bg-surface-light text-surface-foreground"
          :label="t('common.actions.cancel')"
          @click="close()"
        />
        <Button
          class="bg-primary text-white hover:bg-primary-hover"
          :label="t('modals.agenda.createSlides')"
          @click="onSubmit"
        />
      </div>
    </div>
  </Modal>
</template>
