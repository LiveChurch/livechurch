<script setup lang="ts">
import { provide } from "vue";
import type { OpenedModal } from "@/core/types/modal";
import { MODAL_HANDLE } from "./openModal";

/** Renders an open modal and injects into it the handle that signals when it was hidden. */
const props = defineProps<{ modal: OpenedModal }>();

provide(MODAL_HANDLE, props.modal.handle);
</script>

<template>
  <component :is="modal.component" v-bind="modal.props" />
</template>
