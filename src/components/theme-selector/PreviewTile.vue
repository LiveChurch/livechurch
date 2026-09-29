<script setup lang="ts">
/** Selectable card with a visual preview (default slot) and name at the bottom. */
const props = defineProps<{
  label: string;
  active: boolean;
}>();

const emit = defineEmits<{
  select: [];
}>();
</script>

<template>
  <div
    role="button"
    tabindex="0"
    :aria-pressed="props.active"
    class="aspect-video rounded-lg border relative overflow-hidden cursor-pointer group transition-all"
    :class="
      props.active
        ? 'border-brand ring-2 ring-brand/50 shadow-lg shadow-brand/30'
        : 'border-border hover:border-surface-light'
    "
    @click="emit('select')"
    @keydown.enter.prevent="emit('select')"
    @keydown.space.prevent="emit('select')"
  >
    <slot />

    <div class="dark-mode absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2 z-10">
      <span
        class="text-xs font-bold truncate block"
        :class="props.active ? 'text-brand' : 'text-muted-foreground'"
      >
        {{ props.label }}
      </span>
    </div>

    <div
      v-if="props.active"
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
