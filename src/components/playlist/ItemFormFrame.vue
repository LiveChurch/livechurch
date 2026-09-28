<script setup lang="ts">
import { computed, ref, watch } from "vue";
import Button from "primevue/button";
import Input from "@/components/ui/Input.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Common frame for playlist item forms (create/edit): name field
 * (required), form-specific content in the slot and cancel/confirm actions.
 */
const props = withDefaults(
  defineProps<{
    /** The form's specific content is ready to be confirmed. */
    canSubmit: boolean;
    /** Initial name (when editing an existing item). */
    initialName?: string;
    /** Name suggestion; replaces the name only if the user has not changed it. */
    suggestedName?: string;
    submitLabel?: string;
  }>(),
  { initialName: "", suggestedName: undefined },
);

const emit = defineEmits<{
  submit: [name: string];
  cancel: [];
}>();

const name = ref(props.initialName);
const trimmedName = computed(() => name.value.trim());
const isValid = computed(() => !!trimmedName.value && props.canSubmit);

watch(
  () => props.suggestedName,
  (next, previous) => {
    const untouched = !trimmedName.value || name.value === previous;
    if (next && untouched) name.value = next;
  },
);

const submit = () => {
  if (isValid.value) emit("submit", trimmedName.value);
};
</script>

<template>
  <div class="flex min-h-0 min-w-0 flex-1 flex-col">
    <div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
      <Input
        id="item-form-name"
        v-model="name"
        :label="t('components.itemForm.name')"
        :placeholder="t('components.itemForm.nameExample')"
        :maxlength="80"
        autofocus
        @keydown.enter="submit"
      />
      <slot />
    </div>

    <div class="flex justify-end gap-3 border-t border-border/60 p-4">
      <Button
        variant="text"
        severity="secondary"
        class="text-muted-foreground hover:text-surface-foreground"
        :label="t('common.actions.cancel')"
        @click="emit('cancel')"
      />
      <Button
        class="bg-primary text-white hover:bg-primary-hover"
        :label="props.submitLabel ?? t('common.actions.create')"
        :disabled="!isValid"
        @click="submit"
      />
    </div>
  </div>
</template>
