<script setup lang="ts">
import MediaItemForm from "@/components/media/MediaItemForm.vue";
import { CustomItemService } from "@/core/services/CustomItemService";
import type { PlaylistItem } from "@/core/types/playlist";

const emit = defineEmits<{
  create: [item: PlaylistItem];
  cancel: [];
}>();
</script>

<template>
  <MediaItemForm
    @submit="
      (name, assets) =>
        emit('create', CustomItemService.buildMediaItem(name, assets))
    "
    @cancel="emit('cancel')"
  />
</template>
