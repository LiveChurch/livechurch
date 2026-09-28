<script setup lang="ts">
import { computed, reactive, ref } from "vue";
import Button from "primevue/button";
import Input from "@/components/ui/Input.vue";
import SlideDisplay from "@/components/slides/SlideDisplay/SlideDisplay.vue";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { StringUtils } from "@/core/utils/StringUtils";
import Modal from "../Modal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Porta src/modals/TemplateInstanceCreator.tsx (modal aberto via openModal()). */
const props = defineProps<{
  templateId: string;
}>();

const playlistCtx = usePlaylistStore();

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const close = () => modalRef.value?.hide();

const template = computed(() =>
  playlistCtx.state.slideTemplates.find((t) => t.id === props.templateId),
);
const variables = computed(() => template.value?.variables ?? []);

const values = reactive<Record<string, string>>(
  Object.fromEntries((template.value?.variables ?? []).map((name) => [name, ""])),
);
const isCreating = ref(false);

const renderedContent = computed(() =>
  template.value
    ? playlistCtx.actions.renderTemplate(template.value.content, values)
    : "",
);
const allFilled = computed(() =>
  variables.value.every((name) => (values[name] || "").trim()),
);

const handleCreate = () => {
  if (!template.value || !allFilled.value) return;
  const stanzas = StringUtils.splitStanzas(renderedContent.value);
  const slides = (stanzas.length > 0 ? stanzas : [renderedContent.value]).map(
    (text) => ({ text, title: template.value!.name }),
  );

  playlistCtx.actions.addToPlaylist({
    id: crypto.randomUUID(),
    name: template.value.name,
    type: "template-instance",
    activeSlideIndex: 0,
    slides,
  });
  close();
};
</script>

<template>
  <Modal
    v-if="template"
    ref="modalRef"
    :title="t('modals.templateInstance.title', { name: template.name })"
    class-name="w-full max-w-4xl"
    content-class-name="flex gap-6"
  >
    <div class="flex flex-1 flex-col gap-4">
      <p
        v-if="variables.length === 0"
        class="text-sm text-muted-foreground"
      >
        {{ t('modals.templateInstance.noVariables') }}
      </p>
      <template v-else>
        <p class="text-sm font-medium text-muted-foreground">
          {{ variables.length }} Campo{{ variables.length !== 1 ? "s" : "" }} para
          {{ t('modals.templateInstance.fill') }}
        </p>
        <div class="space-y-3">
          <Input
            v-for="variableName in variables"
            :key="variableName"
            v-model="values[variableName]"
            :label="variableName"
            :placeholder="`Digite o valor para ${variableName}...`"
          />
        </div>
      </template>
    </div>

    <div class="flex w-96 flex-col gap-3">
      <span class="text-sm font-medium text-muted-foreground">{{ t('modals.templateEditor.preview') }}</span>
      <div
        class="relative aspect-video flex-1 overflow-hidden rounded border border-border bg-media"
      >
        <SlideDisplay :slide="{ title: template.name, text: renderedContent }" />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end gap-3 w-full">
        <Button
          variant="text"
          severity="secondary"
          class="text-muted-foreground hover:text-surface-foreground"
          :label="t('common.actions.cancel')"
          @click="close()"
        />
        <Button
          class="bg-primary text-white hover:bg-primary-hover"
          :label="t('modals.templateInstance.createSlide')"
          :disabled="!allFilled"
          :loading="isCreating"
          @click="handleCreate"
        />
      </div>
    </template>
  </Modal>
</template>
