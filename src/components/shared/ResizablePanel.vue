<script setup lang="ts">
// API: v-slot default + props { direction, position, minSize, maxSize,
// defaultSize, storageKey, className, handleClassName } (same names as React).
import { computed, onBeforeUnmount, ref, useAttrs, watch } from "vue";
import { cn } from "@/core/utils/ClassNameUtils";
import { NumberUtils } from "@/core/utils/NumberUtils";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Resizable panel (port of `src/components/shared/ResizablePanel.tsx`).
 * position "right": handle to the right of the content; position "top": handle above.
 * The size is persisted in `localStorage` via `storageKey`.
 *
 * Public API:
 *  - props:
 *      direction?: "vertical" | "horizontal" (default "vertical")
 *      position?: "top" | "bottom" | "left" | "right" (default "top")
 *      minSize?: number (200) | maxSize?: number (800) | defaultSize?: number (256)
 *      storageKey?: string (localStorage key; no key = no persistence)
 *      className?: string classes of the slot container
 *      handleClassName?: string extra classes of the handle
 *  - `class`/attrs passed to the component are applied to the content
 *    container (inherited from the React pattern, where `className` was the container).
 *  - no emits: manages its own size.
 */
defineOptions({ inheritAttrs: false });

const props = withDefaults(
  defineProps<{
    direction?: "vertical" | "horizontal";
    position?: "top" | "bottom" | "left" | "right";
    minSize?: number;
    maxSize?: number;
    defaultSize?: number;
    storageKey?: string;
    className?: string;
    handleClassName?: string;
  }>(),
  {
    direction: "vertical",
    position: "top",
    minSize: 200,
    maxSize: 800,
    defaultSize: 256,
    storageKey: undefined,
    className: undefined,
    handleClassName: undefined,
  },
);

const attrs = useAttrs();
const contentClass = computed(() =>
  cn(props.className, attrs.class as string | undefined),
);

function readStoredSize(): number {
  if (!props.storageKey || typeof localStorage === "undefined") {
    return props.defaultSize;
  }
  const saved = parseInt(localStorage.getItem(props.storageKey) ?? "", 10);
  return !Number.isNaN(saved) && saved >= props.minSize && saved <= props.maxSize
    ? saved
    : props.defaultSize;
}

const size = ref(readStoredSize());
const isResizing = ref(false);

const setSize = (value: number) => {
  size.value = NumberUtils.clamp(value, props.minSize, props.maxSize);
};

watch(size, (value) => {
  if (props.storageKey) localStorage.setItem(props.storageKey, String(value));
});

const containerStyle = computed(() =>
  props.direction === "vertical"
    ? { height: `${size.value}px` }
    : {
        width: `${size.value}px`,
        minWidth: `${props.minSize}px`,
        maxWidth: `${props.maxSize}px`,
      },
);

const handleClasses = computed(() =>
  cn(
    props.direction === "vertical"
      ? "h-1 flex-shrink-0 cursor-ns-resize"
      : "w-1 flex-shrink-0 cursor-ew-resize",
    "group/handle relative z-20 flex items-end justify-end bg-transparent transition-colors hover:bg-brand/40",
    isResizing.value && "bg-brand/60",
    props.handleClassName,
  ),
);

const isHandleAfterContent = computed(
  () => props.direction === "horizontal" && props.position === "right",
);

type Cleanup = (() => void) | null;
let cleanup: Cleanup = null;

const stopResizing = () => {
  cleanup?.();
  cleanup = null;
  isResizing.value = false;
  document.body.style.cursor = "";
  document.body.style.userSelect = "";
};

const handleMouseDown = (event: MouseEvent) => {
  event.preventDefault();
  event.stopPropagation();
  isResizing.value = true;

  const startPos =
    props.direction === "vertical" ? event.clientY : event.clientX;
  const startSize = size.value;

  document.body.style.cursor =
    props.direction === "vertical" ? "ns-resize" : "ew-resize";
  document.body.style.userSelect = "none";

  const onMove = (moveEvent: MouseEvent) => {
    const current =
      props.direction === "vertical" ? moveEvent.clientY : moveEvent.clientX;
    const delta =
      props.direction === "vertical"
        ? startPos - current
        : current - startPos;
    setSize(startSize + delta);
  };

  document.addEventListener("mousemove", onMove);
  document.addEventListener("mouseup", stopResizing);
  cleanup = () => {
    document.removeEventListener("mousemove", onMove);
    document.removeEventListener("mouseup", stopResizing);
  };
};

onBeforeUnmount(() => {
  if (cleanup) stopResizing();
});
</script>

<template>
  <!-- React renders a fragment [handle, content] (or [content, handle]);
       in Vue two mutually exclusive fragments are used to preserve the order. -->
  <template v-if="isHandleAfterContent">
    <div :class="contentClass" :style="containerStyle">
      <slot />
    </div>
    <div
      :class="handleClasses"
      :style="{ touchAction: 'none' }"
      :title="t('components.resizablePanel.dragToResize')"
      @mousedown="handleMouseDown"
    >
      <div
        v-if="direction === 'vertical'"
        class="absolute inset-x-0 bottom-0 h-0.5 -translate-y-1/2 bg-border"
      />
      <div v-else class="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 rounded-full bg-transparent transition-colors group-hover/handle:bg-brand/60 group-active/handle:bg-brand/60" />
    </div>
  </template>
  <template v-else>
    <div
      :class="handleClasses"
      :style="{ touchAction: 'none' }"
      :title="t('components.resizablePanel.dragToResize')"
      @mousedown="handleMouseDown"
    >
      <div
        v-if="direction === 'vertical'"
        class="absolute inset-x-0 bottom-0 h-0.5 -translate-y-1/2 bg-border"
      />
      <div v-else class="absolute inset-y-0 left-0 w-0.5 -translate-x-1/2 rounded-full bg-transparent transition-colors group-hover/handle:bg-brand/60 group-active/handle:bg-brand/60" />
    </div>
    <div :class="contentClass" :style="containerStyle">
      <slot />
    </div>
  </template>
</template>
