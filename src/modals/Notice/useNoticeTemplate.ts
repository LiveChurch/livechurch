import { computed, reactive, ref, watch } from "vue";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import type { LiveNotice } from "@/core/types/live";

export type NoticeTextMode = "text" | "template";

/**
 * Notice text coming from a template: picks the template, fills in the variables and
 * the result becomes the draft's text. While a variable is missing, the text stays empty.
 */
export function useNoticeTemplate(draft: LiveNotice) {
  const { state, actions } = usePlaylistStore();

  const mode = ref<NoticeTextMode>("text");
  const templateId = ref<string | null>(null);
  const values = reactive<Record<string, string>>({});

  const templates = computed(() => state.slideTemplates);
  const template = computed(() =>
    templates.value.find((item) => item.id === templateId.value),
  );
  const variables = computed(() => template.value?.variables ?? []);
  const allFilled = computed(() =>
    variables.value.every((name) => (values[name] ?? "").trim()),
  );
  const rendered = computed(() =>
    template.value && allFilled.value
      ? actions.renderTemplate(template.value.content, values).trim()
      : "",
  );

  const selectTemplate = (id: string) => {
    templateId.value = id;
    Object.keys(values).forEach((name) => delete values[name]);
    template.value?.variables.forEach((name) => (values[name] = ""));
  };

  const setValue = (name: string, value: string) => {
    values[name] = value;
  };

  watch(
    [mode, rendered],
    () => {
      if (mode.value === "template") draft.text = rendered.value;
    },
    { immediate: true },
  );

  return { mode, templates, templateId, variables, values, selectTemplate, setValue };
}

export type NoticeTemplateState = ReturnType<typeof useNoticeTemplate>;
