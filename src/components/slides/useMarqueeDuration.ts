import { computed, ref } from "vue";
import type { Ref } from "vue";
import { useResizeObserver } from "@/core/composables/useResizeObserver";

/**
 * Duration of one lap of the ticker to keep the speed constant: proportional
 * to the width of the passing stretch, relative to the container width. Since everything scales
 * in `cqw`, the proportion (and the speed) is the same in the preview and on the projector.
 */
export function useMarqueeDuration(
  container: Ref<HTMLElement | null>,
  segment: Ref<HTMLElement | null>,
  secondsPerScreen: () => number,
) {
  const widthRatio = ref(1);

  const measure = () => {
    const containerWidth = container.value?.offsetWidth ?? 0;
    const segmentWidth = segment.value?.offsetWidth ?? 0;
    if (containerWidth > 0 && segmentWidth > 0) {
      widthRatio.value = segmentWidth / containerWidth;
    }
  };

  useResizeObserver({ ref: container, onResize: measure });
  useResizeObserver({ ref: segment, onResize: measure });

  return computed(() => `${widthRatio.value * secondsPerScreen()}s`);
}
