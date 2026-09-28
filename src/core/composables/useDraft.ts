import { computed, ref, watch } from "vue";
import { JsonUtils } from "@/core/utils/JsonUtils";

/**
 * Editable copy of a store value: edits stay in the draft until
 * `save()`. The draft is recreated whenever the source changes (selected item
 * switch, save, external change). Only works for JSON data.
 */
export function useDraft<T extends object>(
  source: () => T | undefined,
  commit: (value: T) => void,
) {
  const draft = ref<T | null>(null);

  const reset = () => {
    const current = source();
    draft.value = current ? JsonUtils.clone(current) : null;
  };

  const isDirty = computed(
    () => JSON.stringify(draft.value) !== JSON.stringify(source() ?? null),
  );

  const save = () => {
    if (!draft.value) return;
    commit(JsonUtils.clone(draft.value));
    reset();
  };

  watch(source, reset, { immediate: true, deep: true });

  return { draft, isDirty, reset, save };
}
