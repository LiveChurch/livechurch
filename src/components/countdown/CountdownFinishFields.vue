<script setup lang="ts">
import { computed } from "vue";
import Checkbox from "primevue/checkbox";
import InputNumber from "primevue/inputnumber";
import Input from "@/components/ui/Input.vue";
import Select from "@/components/ui/Select.vue";
import { COUNTDOWN_FINISH_ACTION_OPTIONS } from "@/core/constants/countdown";
import type { CountdownFinishAction } from "@/core/types/playlist";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Fields for what happens when time runs out: final message and automatic actions. */
const finalMessage = defineModel<string>("finalMessage", { required: true });
const finalMessageSeconds = defineModel<number>("finalMessageSeconds", { required: true });
const finishAction = defineModel<CountdownFinishAction>("finishAction", { required: true });
const removeWhenDone = defineModel<boolean>("removeWhenDone", { required: true });

/** The message only needs a duration when the item goes off air by itself after it. */
const showMessageDuration = computed(
  () =>
    !!finalMessage.value.trim() && (finishAction.value !== "none" || removeWhenDone.value),
);
</script>

<template>
  <Input
    id="countdown-final-message"
    v-model="finalMessage"
    :label="t('components.countdown.finalMessage')"
    :placeholder="t('components.countdown.finalMessageExample')"
    :maxlength="80"
  />

  <Select
    v-model="finishAction"
    :options="COUNTDOWN_FINISH_ACTION_OPTIONS"
    :label="t('components.countdown.whenFinished')"
  />

  <label for="countdown-remove-when-done" class="flex cursor-pointer items-center gap-2">
    <Checkbox v-model="removeWhenDone" :binary="true" input-id="countdown-remove-when-done" />
    <span>{{ t('components.countdown.removeWhenDone') }}</span>
  </label>

  <div v-if="showMessageDuration" class="flex items-center gap-2 text-sm text-muted-foreground">
    <label for="countdown-final-message-seconds">{{ t('components.countdown.showMessageFor') }}</label>
    <InputNumber
      v-model="finalMessageSeconds"
      input-id="countdown-final-message-seconds"
      :min="1"
      :max="600"
      size="small"
      input-class="w-16 text-center"
    />
    <span>{{ t('components.countdown.seconds') }}</span>
  </div>
</template>
