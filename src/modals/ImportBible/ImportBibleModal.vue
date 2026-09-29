<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import FileUpload from "primevue/fileupload";
import { useI18n } from "vue-i18n";
import Input from "@/components/ui/Input.vue";
import Select from "@/components/ui/Select.vue";
import { LOCALE_OPTIONS, type AppLocale } from "@/core/i18n/AppLocale";
import Modal from "../Modal.vue";
import BibleJsonFormat from "./BibleJsonFormat.vue";
import { useImportBible } from "./useImportBible";

const { t } = useI18n();

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const close = () => modalRef.value?.hide();

const { form, books, fileName, errorMessage, canSave, selectFile, save } = useImportBible(close);

const handleSelect = (event: { files?: File[] }) => {
  const [file] = event.files ?? [];
  if (file) void selectFile(file);
};
</script>

<template>
  <Modal ref="modalRef" :title="t('modals.importBible.title')" class-name="max-w-xl">
    <div class="flex flex-col gap-4">
      <p class="text-xs text-warning" role="note">{{ t('modals.importBible.freeOnly') }}</p>

      <BibleJsonFormat />

      <div class="flex flex-col gap-2">
        <FileUpload
          mode="basic"
          accept=".json,application/json"
          auto
          custom-upload
          :show-clear="false"
          :choose-label="t('modals.importBible.chooseFile')"
          @select="handleSelect"
        />
        <p v-if="books" class="text-xs text-muted-foreground">
          {{ t('modals.importBible.fileLoaded', { name: fileName, count: books.length }) }}
        </p>
        <p v-if="errorMessage" class="text-xs text-danger" role="alert">{{ errorMessage }}</p>
      </div>

      <Input id="bible-name" v-model="form.name" :label="t('modals.importBible.name')" :maxlength="60" />
      <Input id="bible-tag" v-model="form.tag" :label="t('modals.importBible.tag')" :maxlength="12" />
      <Select
        v-model="form.locale"
        :label="t('modals.importBible.language')"
        :options="LOCALE_OPTIONS"
        @update:model-value="form.locale = $event as AppLocale"
      />
    </div>

    <template #footer>
      <div class="ml-auto flex gap-3">
        <Button
          variant="text"
          severity="secondary"
          class="text-muted-foreground hover:text-surface-foreground"
          :label="t('common.actions.cancel')"
          @click="close()"
        />
        <Button
          class="bg-primary text-white hover:bg-primary-hover"
          :label="t('common.actions.save')"
          :disabled="!canSave"
          @click="save"
        />
      </div>
    </template>
  </Modal>
</template>
