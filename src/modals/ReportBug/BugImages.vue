<script setup lang="ts">
/** Report attachments: upload of several images with removable thumbnails. */
import { computed } from "vue";
import Button from "primevue/button";
import ImageUpload from "@/components/ui/ImageUpload.vue";
import { BUG_REPORT_LIMITS, type BugAttachment } from "@/core/services/BugReportService";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const images = defineModel<BugAttachment[]>({ required: true });

const isFull = computed(() => images.value.length >= BUG_REPORT_LIMITS.images);

const addImage = (dataUrl: string, name: string) => {
  if (isFull.value) return;
  images.value = [...images.value, { id: crypto.randomUUID(), name, dataUrl }];
};

const removeImage = (id: string) => {
  images.value = images.value.filter((image) => image.id !== id);
};
</script>

<template>
  <section class="flex flex-col gap-2">
    <div class="flex items-baseline justify-between">
      <h4 class="text-sm font-medium text-muted-foreground">{{ t('modals.reportBug.images') }}</h4>
      <span class="font-mono text-xs text-muted-foreground">
        {{ images.length }}/{{ BUG_REPORT_LIMITS.images }}
      </span>
    </div>

    <ImageUpload
      v-if="!isFull"
      multiple
      compact
      :aria-label="t('modals.reportBug.attachImages')"
      @select="addImage"
    />

    <ul v-if="images.length" class="flex flex-wrap gap-2">
      <li
        v-for="image in images"
        :key="image.id"
        class="relative overflow-hidden rounded-lg border border-border"
      >
        <img :src="image.dataUrl" :alt="image.name" class="size-20 object-cover" />
        <Button
          type="button"
          variant="text"
          severity="secondary"
          icon="pi pi-times"
          size="small"
          :aria-label="`Remover ${image.name}`"
          class="absolute right-1 top-1 rounded-full bg-surface/80 p-1 text-surface-foreground hover:bg-danger hover:text-white"
          @click="removeImage(image.id)"
        />
      </li>
    </ul>
  </section>
</template>
