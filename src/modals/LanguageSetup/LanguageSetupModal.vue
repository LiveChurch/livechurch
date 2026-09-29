<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import { useLanguageStore } from "@/core/state/language/languageStore";
import type { AppLocale } from "@/core/i18n/AppLocale";
import Modal from "../Modal.vue";

/** First-run choice of the interface language. Not translated: it shows every language at once. */
const language = useLanguageStore();
const modalRef = ref<InstanceType<typeof Modal> | null>(null);

const choose = (locale: AppLocale) => {
  language.actions.setLocale(locale);
  modalRef.value?.hide();
};
</script>

<template>
  <Modal ref="modalRef" title="Language · Idioma" class-name="max-w-sm" :show-close-button="false" :dismissable="false">
    <div class="flex flex-col gap-2">
      <Button
        v-for="option in language.state.options"
        :key="option.value"
        :label="option.label"
        :severity="option.value === language.state.locale ? 'primary' : 'secondary'"
        variant="outlined"
        @click="choose(option.value)"
      />
    </div>
  </Modal>
</template>
