<script setup lang="ts">
import { computed } from "vue";
import Input from "@/components/ui/Input.vue";
import Select from "@/components/ui/Select.vue";
import type { NoticeTemplateState } from "./useNoticeTemplate";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Template choice and filling in the variables that form the notice text. */
const props = defineProps<{
  template: NoticeTemplateState;
}>();

const options = computed(() =>
  props.template.templates.value.map(({ id, name }) => ({ label: name, value: id })),
);
</script>

<template>
  <p v-if="options.length === 0" class="text-sm text-muted-foreground">
    {{ t('modals.notice.noTemplates') }}
  </p>
  <div v-else class="flex flex-col gap-3">
    <Select
      :label="t('modals.notice.template')"
      :model-value="template.templateId.value"
      :options="options"
      :placeholder="t('modals.notice.selectTemplate')"
      @update:model-value="template.selectTemplate(String($event))"
    />
    <Input
      v-for="name in template.variables.value"
      :key="name"
      :label="name"
      :model-value="template.values[name]"
      :placeholder="`Digite o valor para ${name}...`"
      @update:model-value="template.setValue(name, String($event ?? ''))"
    />
  </div>
</template>
