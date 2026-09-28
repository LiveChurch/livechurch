<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "primevue/button";
import Textarea from "primevue/textarea";
import Input from "@/components/ui/Input.vue";
import SlideDisplay from "@/components/slides/SlideDisplay/SlideDisplay.vue";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { TemplateUtils } from "@/core/state/playlist/TemplateUtils";
import Modal from "../Modal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Porta src/modals/TemplateEditor.tsx (modal aberto via openModal()). */
const props = defineProps<{
  templateId?: string;
}>();

const playlistCtx = usePlaylistStore();

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const close = () => modalRef.value?.hide();

const template = props.templateId
  ? playlistCtx.state.slideTemplates.find((t) => t.id === props.templateId)
  : null;

const name = ref(template?.name || "");
const content = ref(template?.content || "");
const isSaving = ref(false);

const variables = computed(() => TemplateUtils.extractVariables(content.value));
const canSave = computed(() => Boolean(name.value.trim() && content.value.trim()));

const handleSave = () => {
  if (!canSave.value) return;
  isSaving.value = true;
  if (props.templateId && template) {
    playlistCtx.actions.updateTemplate(props.templateId, name.value, content.value);
  } else {
    playlistCtx.actions.saveTemplate(name.value, content.value);
  }
  isSaving.value = false;
  close();
};
</script>

<template>
  <Modal
    ref="modalRef"
    :title="props.templateId ? 'Editar Template' : 'Criar Novo Template'"
    class-name="h-[80dvh] w-[140dvh] max-w-none"
    content-class-name="flex gap-6 overflow-hidden"
  >
    <div class="flex flex-1 flex-col gap-4">
      <Input
        v-model="name"
        :label="t('modals.templateEditor.name')"
        :placeholder="t('modals.templateEditor.nameExample')"
      />

      <div class="flex min-h-0 flex-1 flex-col">
        <label class="mb-2 block text-sm font-medium text-muted-foreground">
          {{ t('modals.templateEditor.content') }}
          <span v-if="variables.length > 0" class="ml-2 text-xs text-brand">
            ({{ t('modals.templateEditor.variablesDetected', { count: variables.length }, variables.length) }})
          </span>
        </label>
        <Textarea
          v-model="content"
          class="min-h-0 flex-1 resize-none rounded border-border bg-background placeholder:text-gray-500 font-mono text-sm text-foreground"
          :placeholder="t('modals.templateEditor.contentPlaceholder')"
        />
      </div>

      <div
        v-if="variables.length > 0"
        class="rounded border border-border/60 bg-background/50 p-3"
      >
        <p class="mb-2 text-xs font-medium text-muted-foreground">{{ t('modals.templateEditor.detected') }}</p>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="variable in variables"
            :key="variable"
            class="rounded border border-brand/30 bg-brand/20 px-2 py-1 text-xs text-brand"
          >
            #({{ variable }})
          </span>
        </div>
      </div>
    </div>

    <div class="flex flex-col gap-3">
      <span class="text-sm font-medium text-muted-foreground">{{ t('modals.templateEditor.preview') }}</span>
      <div
        class="relative aspect-video h-[40vh] self-center overflow-hidden rounded border border-border bg-media"
      >
        <SlideDisplay :slide="{ title: name || t('modals.templateEditor.preview'), text: content }" />
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
          :label="props.templateId ? 'Atualizar' : 'Criar'"
          :disabled="!canSave"
          :loading="isSaving"
          @click="handleSave"
        />
      </div>
    </template>
  </Modal>
</template>
