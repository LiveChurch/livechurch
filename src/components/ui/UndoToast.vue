<script setup lang="ts">
/** Undo toast in the footer, with a bar that empties until the deadline ends. */
import Button from "primevue/button";
import { useUndoToastStore } from "@/core/state/undoToast/undoToastStore";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const undoToast = useUndoToastStore();
</script>

<template>
  <Transition name="undo-toast">
    <div
      v-if="undoToast.state.current"
      :key="undoToast.state.current.id"
      role="status"
      class="fixed bottom-10 left-4 z-50 flex flex-col overflow-hidden rounded-lg border border-border bg-surface shadow-lg"
    >
      <div class="flex items-center gap-4 py-2 pr-2 pl-4">
        <span class="text-sm text-foreground">
          {{ undoToast.state.current.message }}
        </span>
        <Button
          :label="t('common.actions.undo')"
          size="small"
          variant="text"
          @click="undoToast.actions.undo()"
        />
      </div>
      <div
        class="undo-toast-timer h-1 origin-left bg-primary"
        :style="{ animationDuration: `${undoToast.state.current.durationMs}ms` }"
      />
    </div>
  </Transition>
</template>

<style scoped>
.undo-toast-timer {
  animation: undo-toast-drain linear forwards;
}

@keyframes undo-toast-drain {
  to {
    transform: scaleX(0);
  }
}

.undo-toast-enter-active,
.undo-toast-leave-active {
  transition:
    opacity 0.2s,
    transform 0.2s;
}

.undo-toast-enter-from,
.undo-toast-leave-to {
  opacity: 0;
  transform: translateY(0.5rem);
}
</style>
