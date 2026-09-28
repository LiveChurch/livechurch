import { computed, reactive } from "vue";
import type { Ref } from "vue";
import { useResizeObserver } from "@/core/composables/useResizeObserver";
import { NumberUtils } from "@/core/utils/NumberUtils";

const BASE_WIDTH = 1280;
const BASE_HEIGHT = 720;

export interface SlideFrameStore {
  width: number;
  height: number;
  setSize(width: number, height: number): void;
}

/**
 * Replaces React's useSlideFrame hook: measures the slide frame via
 * ResizeObserver and returns the layout scale (reactive).
 */
export function useSlideFrame(elRef: Ref<HTMLElement | null | undefined>) {
  const frame = reactive<SlideFrameStore>({
    width: BASE_WIDTH,
    height: BASE_HEIGHT,
    setSize(width, height) {
      this.width = width;
      this.height = height;
    },
  });

  const handleResize = () => {
    const element = elRef.value;
    if (!element) return;
    const rect = element.getBoundingClientRect();
    if (rect.width && rect.height) frame.setSize(rect.width, rect.height);
  };

  useResizeObserver({ ref: elRef, onResize: handleResize });

  const scale = computed(() =>
    NumberUtils.clamp(
      Math.min(frame.width / BASE_WIDTH, frame.height / BASE_HEIGHT),
      0.1,
      1.6,
    ),
  );

  return { scale, frame };
}

export { BASE_WIDTH, BASE_HEIGHT };
