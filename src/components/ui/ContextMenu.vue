<script setup lang="ts">
// API: v-model (boolean) + x/y in px (fixed position in the viewport) + default slot for items.
import { nextTick, onBeforeUnmount, ref, watch } from "vue";

/**
 * Portaled context menu (Teleport to body), port of
 * `src/components/ui/ContextMenu.tsx`.
 *
 * Public API:
 *  - props: x: number; y: number (click coordinates, px)
 *  - v-model (boolean): visibility. The parent opens it with `v-model="open"` after
 *    a contextmenu and closes it by calling `open = false` (or automatically on
 *    outside click/scroll/resize, which emit update:modelValue false).
 *  - default slot: items (use <ContextMenuItem/>).
 *  - closes on outside click, on scroll (capture) and on window resize,
 *    identical to the React behavior.
 */
const props = defineProps<{
  x: number;
  y: number;
}>();

const visible = defineModel<boolean>({ required: true });

const menuRef = ref<HTMLElement | null>(null);
const style = ref<Record<string, string>>({});

const close = () => {
  visible.value = false;
};

const handleMouseDownOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    close();
  }
};

const updatePosition = async () => {
  style.value = { top: `${props.y}px`, left: `${props.x}px` };
  await nextTick();
  const el = menuRef.value;
  if (!el) return;
  // Keeps the menu inside the viewport (React only had the comment here).
  const rect = el.getBoundingClientRect();
  let top = props.y;
  let left = props.x;
  if (rect.bottom > window.innerHeight) {
    top = Math.max(4, window.innerHeight - rect.height - 4);
  }
  if (rect.right > window.innerWidth) {
    left = Math.max(4, window.innerWidth - rect.width - 4);
  }
  style.value = { top: `${top}px`, left: `${left}px` };
};

let attached = false;
const attach = () => {
  if (attached) return;
  document.addEventListener("mousedown", handleMouseDownOutside);
  window.addEventListener("scroll", close, true);
  window.addEventListener("resize", close);
  attached = true;
};
const detach = () => {
  if (!attached) return;
  document.removeEventListener("mousedown", handleMouseDownOutside);
  window.removeEventListener("scroll", close, true);
  window.removeEventListener("resize", close);
  attached = false;
};

watch(
  visible,
  (open) => {
    if (open) {
      attach();
      void updatePosition();
    } else {
      detach();
    }
  },
  { immediate: true },
);

onBeforeUnmount(detach);
</script>

<template>
  <Teleport to="body">
    <Transition name="context-menu">
      <div
        v-if="visible"
        ref="menuRef"
        :style="style"
        class="fixed z-[9999] min-w-[160px] rounded-lg border border-border bg-surface p-1 shadow-2xl"
        @click.stop
        @contextmenu.prevent
      >
        <slot />
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
/* Substitui animate-in fade-in zoom-in-95 duration-100 ease-out (CSS puro). */
.context-menu-enter-active,
.context-menu-leave-active {
  transition:
    opacity 100ms ease-out,
    transform 100ms ease-out;
}
.context-menu-enter-from,
.context-menu-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
