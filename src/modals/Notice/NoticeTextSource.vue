<script setup lang="ts">
import { ref } from "vue";
import SubsectionTabs from "@/components/theme-selector/SubsectionTabs.vue";
import type { LiveNotice } from "@/core/types/live";
import NoticeTemplateFields from "./NoticeTemplateFields.vue";
import NoticeTextField from "./NoticeTextField.vue";
import { useNoticeTemplate } from "./useNoticeTemplate";
import type { NoticeTextMode } from "./useNoticeTemplate";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Source of the notice text: typed ("Text") or built from a template. */
const props = defineProps<{
  draft: LiveNotice;
}>();

const emit = defineEmits<{
  submit: [];
}>();

const TABS: { id: NoticeTextMode; label: string }[] = [
  { id: "text", label: t("components.themeSelector.sections.text") },
  { id: "template", label: t("modals.notice.template") },
];

const textFieldRef = ref<InstanceType<typeof NoticeTextField> | null>(null);
const template = useNoticeTemplate(props.draft);

/** Goes back to the typed text (e.g. notice from the history) and focuses the field. */
const focus = () => {
  template.mode.value = "text";
  void textFieldRef.value?.focus();
};

defineExpose({ focus });
</script>

<template>
  <div class="flex flex-col gap-3">
    <SubsectionTabs v-model="template.mode.value" :tabs="TABS" class="-mx-1 px-0" />
    <NoticeTextField
      v-if="template.mode.value === 'text'"
      ref="textFieldRef"
      :draft="draft"
      @submit="emit('submit')"
    />
    <NoticeTemplateFields v-else :template="template" />
  </div>
</template>
