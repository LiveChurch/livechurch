<script setup lang="ts">
import CountdownItemForm from "@/components/countdown/CountdownItemForm.vue";
import { CustomItemService } from "@/core/services/CustomItemService";
import type { PlaylistItem } from "@/core/types/playlist";

const emit = defineEmits<{
  create: [item: PlaylistItem];
  cancel: [];
}>();
</script>

<template>
  <CountdownItemForm
    @submit="
      (name, countdown, themeBinding, customTheme) =>
        emit(
          'create',
          CustomItemService.buildCountdownItem(name, countdown, themeBinding, customTheme),
        )
    "
    @cancel="emit('cancel')"
  />
</template>
