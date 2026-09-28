<script setup lang="ts">
import Button from "primevue/button";
import { useI18n } from "vue-i18n";
import ImportBibleModal from "@/modals/ImportBible/ImportBibleModal.vue";
import { openModal } from "@/modals/openModal";

const { t } = useI18n();

const emit = defineEmits<{ (event: "import"): void }>();

const openImport = () => {
  emit("import");
  openModal(ImportBibleModal);
};
</script>

<template>
  <div class="mt-2 flex flex-col gap-2 border-t border-border pt-3">
    <p class="text-xs text-muted-foreground">{{ t('control.statusBar.freeOnlyNotice') }}</p>
    <Button
      type="button"
      variant="text"
      severity="secondary"
      icon="pi pi-upload"
      size="small"
      class="self-start text-xs"
      :label="t('control.statusBar.importBible')"
      @click="openImport"
    />
  </div>
</template>
