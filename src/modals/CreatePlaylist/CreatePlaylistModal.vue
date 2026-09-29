<script setup lang="ts">
import { computed, ref } from "vue";
import Button from "primevue/button";
import Input from "@/components/ui/Input.vue";
import Select from "@/components/ui/Select.vue";
import Modal from "../Modal.vue";
import { useCreatePlaylistModal } from "./useCreatePlaylistModal";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = defineProps<{
  onCreate: (name: string) => void;
}>();

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const close = () => modalRef.value?.hide();

const { name, todayEvents, eventOptions, selectedEventId, setSelectedEventId, applyEventBackground } =
  useCreatePlaylistModal();

const trimmedName = computed(() => name.value.trim());

const submit = () => {
  if (!trimmedName.value) return;
  props.onCreate(trimmedName.value);
  applyEventBackground();
  close();
};
</script>

<template>
  <Modal ref="modalRef" :title="t('control.playlist.newPlaylistLabel')" class-name="max-w-md">
    <div class="space-y-4">
      <Input
        id="create-playlist-name"
        v-model="name"
        :label="t('modals.createPlaylist.name')"
        :placeholder="t('modals.createPlaylist.nameExample')"
        :maxlength="60"
        autofocus
        @keydown.enter="submit"
      />

      <Select
        v-if="todayEvents.length"
        :model-value="selectedEventId ?? ''"
        :options="eventOptions"
        :label="t('modals.createPlaylist.linkEvent')"
        :hint="t('modals.createPlaylist.linkEventHint')"
        @update:model-value="(value) => setSelectedEventId(String(value))"
      />
    </div>

    <template #footer>
      <div class="flex w-full justify-end gap-3">
        <Button
          variant="text"
          severity="secondary"
          class="text-muted-foreground hover:text-surface-foreground"
          :label="t('common.actions.cancel')"
          @click="close()"
        />
        <Button
          class="bg-primary text-white hover:bg-primary-hover"
          :label="t('common.actions.create')"
          :disabled="!trimmedName"
          @click="submit"
        />
      </div>
    </template>
  </Modal>
</template>
