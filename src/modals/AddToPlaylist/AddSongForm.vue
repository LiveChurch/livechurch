<script setup lang="ts">
import { computed, ref } from "vue";
import SlidesTextEditor from "@/components/slides/SlidesTextEditor.vue";
import ItemFormFrame from "@/components/playlist/ItemFormFrame.vue";
import Input from "@/components/ui/Input.vue";
import { useI18n } from "vue-i18n";
import { CustomItemService } from "@/core/services/CustomItemService";
import type { PlaylistItem } from "@/core/types/playlist";
import { StringUtils } from "@/core/utils/StringUtils";

defineProps<{
  initialName?: string;
}>();

const emit = defineEmits<{
  create: [item: PlaylistItem];
  cancel: [];
}>();

const { t } = useI18n();

const author = ref("");
const lyrics = ref("");
const hasSlides = computed(() => StringUtils.splitStanzas(lyrics.value).length > 0);

const handleSubmit = (name: string) => {
  emit("create", CustomItemService.buildSongItem(name, author.value, lyrics.value));
};
</script>

<template>
  <ItemFormFrame
    :can-submit="hasSlides"
    :initial-name="initialName"
    @submit="handleSubmit"
    @cancel="emit('cancel')"
  >
    <Input
      id="song-author"
      v-model="author"
      :label="t('modals.addToPlaylist.songAuthor')"
      :placeholder="t('modals.addToPlaylist.songAuthorPlaceholder')"
      :maxlength="80"
    />
    <SlidesTextEditor
      v-model="lyrics"
      class="rounded-lg border border-border"
    />
  </ItemFormFrame>
</template>
