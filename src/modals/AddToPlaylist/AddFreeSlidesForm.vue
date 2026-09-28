<script setup lang="ts">
import { computed, ref } from "vue";
import SlidesTextEditor from "@/components/slides/SlidesTextEditor.vue";
import { CustomItemService } from "@/core/services/CustomItemService";
import type { PlaylistItem } from "@/core/types/playlist";
import { StringUtils } from "@/core/utils/StringUtils";
import ItemFormFrame from "@/components/playlist/ItemFormFrame.vue";

const emit = defineEmits<{
  create: [item: PlaylistItem];
  cancel: [];
}>();

const text = ref("");
const hasSlides = computed(() => StringUtils.splitStanzas(text.value).length > 0);

const handleSubmit = (name: string) => {
  emit("create", CustomItemService.buildFreeSlidesItem(name, text.value));
};
</script>

<template>
  <ItemFormFrame
    :can-submit="hasSlides"
    @submit="handleSubmit"
    @cancel="emit('cancel')"
  >
    <SlidesTextEditor
      v-model="text"
      class="rounded-lg border border-border"
    />
  </ItemFormFrame>
</template>
