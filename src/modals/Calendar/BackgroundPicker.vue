<script setup lang="ts">
import Button from "primevue/button";
import ImageUpload from "@/components/ui/ImageUpload.vue";
import type { EventFormData } from "./types";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Event background image. Use not yet defined in the UI — for now it only
 * captures and persists the image in the event (see EventFormData.background).
 */
const props = defineProps<{
  form: EventFormData;
}>();

const setBackground = (dataUrl: string) => {
  props.form.background = dataUrl;
};

const removeBackground = () => {
  props.form.background = "";
};
</script>

<template>
  <div>
    <div class="mb-2 text-sm font-medium text-surface-foreground">{{ t('modals.calendar.eventBackground') }}</div>

    <div v-if="form.background" class="relative">
      <img
        :src="form.background"
        :alt="t('modals.calendar.eventBackground')"
        class="aspect-video w-full rounded-lg object-cover"
      />
      <Button
        type="button"
        variant="text"
        severity="secondary"
        icon="pi pi-trash"
        :aria-label="t('modals.calendar.removeBackground')"
        class="absolute right-2 top-2 rounded bg-surface p-1 text-inherit hover:text-danger-hover"
        @click="removeBackground"
      />
    </div>

    <ImageUpload
      v-else
      compact
      :aria-label="t('modals.calendar.uploadBackground')"
      @select="setBackground"
    />
  </div>
</template>
