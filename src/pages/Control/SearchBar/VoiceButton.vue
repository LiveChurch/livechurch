<script setup lang="ts">
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import AppIcon from "@/components/ui/AppIcon.vue";
import { useSpeechRecognition } from "@/core/composables/useSpeechRecognition";

const { t } = useI18n();

const emit = defineEmits<{
  (event: "transcript", text: string): void;
}>();

const { status, error, toggle } = useSpeechRecognition((text) => emit("transcript", text));

const LABELS = computed(() => ({
  idle: t("control.search.voiceIdle"),
  listening: t("control.search.voiceListening"),
  transcribing: t("control.search.voiceTranscribing"),
}));

const label = computed(() => error.value || LABELS.value[status.value]);
</script>

<template>
  <button
    type="button"
    class="absolute right-2 top-1/2 z-10 flex -translate-y-1/2 items-center rounded-full p-1 hover:bg-surface-light/50 disabled:cursor-wait"
    :class="{
      'text-danger': error,
      'animate-pulse text-primary': !error && status !== 'idle',
      'text-muted-foreground': !error && status === 'idle',
    }"
    :title="label"
    :aria-label="label"
    :aria-pressed="status === 'listening'"
    :disabled="status === 'transcribing'"
    @click="toggle"
  >
    <AppIcon :name="status === 'transcribing' ? 'hourglass_top' : 'mic'" size="1.1rem" />
  </button>
</template>
