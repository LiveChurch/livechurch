<script setup lang="ts">
import Button from "primevue/button";
import type { SlideBackground } from "@/core/types/theme";

const props = defineProps<{
  background: SlideBackground;
  isActive: boolean;
  removable?: boolean;
}>();

const emit = defineEmits<{
  select: [id: string];
  remove: [id: string];
  contextMenu: [event: MouseEvent, id: string];
}>();

function handleClick() {
  emit("select", props.background.id);
}

function handleContextMenu(event: MouseEvent) {
  event.preventDefault();
  emit("contextMenu", event, props.background.id);
}
</script>

<template>
  <div
    class="aspect-video rounded-lg border relative overflow-hidden cursor-pointer group/item transition-all"
    :class="
      props.isActive
        ? 'border-brand ring-2 ring-brand/50 shadow-lg shadow-brand/30'
        : 'border-border hover:border-surface-light'
    "
    @click="handleClick"
    @contextmenu="handleContextMenu"
  >
    <img
      :src="props.background.backgroundImage"
      :alt="props.background.name"
      class="absolute inset-0 h-full w-full object-cover"
    />
    <div class="absolute inset-0 bg-overlay/15" />

    <!-- Theme Name Badge -->
    <div class="dark-mode absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/80 to-transparent p-2 z-20">
      <div
        class="text-xs font-bold truncate"
        :class="props.isActive ? 'text-brand' : 'text-muted-foreground'"
      >
        {{ props.background.name }}
      </div>
    </div>

    <Button
      v-if="props.removable"
      type="button"
      variant="text"
      severity="secondary"
      icon="pi pi-trash"
      :aria-label="`Remover ${props.background.name}`"
      class="absolute left-2 top-2 z-20 rounded bg-surface p-1 text-inherit opacity-0 transition-opacity focus-visible:opacity-100 group-hover/item:opacity-100 hover:text-danger-hover"
      @click.stop="emit('remove', props.background.id)"
    />

    <!-- Selected Indicator -->
    <div
      v-if="props.isActive"
      class="absolute top-2 right-2 z-20 flex h-5 w-5 items-center justify-center rounded-full bg-brand-solid text-white"
    >
      <svg class="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
        <path
          fill-rule="evenodd"
          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
          clip-rule="evenodd"
        />
      </svg>
    </div>
  </div>
</template>
