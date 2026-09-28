<script setup lang="ts">
import { computed, ref } from "vue";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import type { PlaylistItem } from "@/core/types/playlist";
import Modal from "../Modal.vue";
import AddTypeList from "./AddTypeList.vue";
import { ADD_TYPES, type AddTypeId } from "./addTypes";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const playlistCtx = usePlaylistStore();

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const close = () => modalRef.value?.hide();

const props = defineProps<{
  typeId?: AddTypeId;
  /** Suggested name; only passed on to the song form. */
  songName?: string;
}>();

const selectedTypeId = ref<AddTypeId>(props.typeId ?? ADD_TYPES[0].id);
const selectedType = computed(
  () => ADD_TYPES.find((type) => type.id === selectedTypeId.value) ?? ADD_TYPES[0],
);
const formProps = computed(() =>
  selectedType.value.id === "song" ? { initialName: props.songName } : {},
);

const handleCreate = (item: PlaylistItem) => {
  playlistCtx.actions.addToPlaylist(item);
  playlistCtx.actions.setActiveItemId(item.id);
  close();
};
</script>

<template>
  <Modal
    ref="modalRef"
    :title="t('control.playlist.addToPlaylist')"
    class-name="h-[90vh] w-full max-w-6xl"
    content-class-name="flex overflow-hidden p-0"
  >
    <AddTypeList
      v-model="selectedTypeId"
      class="w-56 shrink-0 overflow-y-auto border-r border-border/60"
    />
    <component
      :is="selectedType.form"
      :key="selectedType.id"
      v-bind="formProps"
      @create="handleCreate"
      @cancel="close()"
    />
  </Modal>
</template>
