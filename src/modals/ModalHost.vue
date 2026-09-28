<script setup lang="ts">
import { useModalStore } from "@/core/state/modal/modalStore";
import ModalOutlet from "./ModalOutlet.vue";

/** Single place where the modals opened by `openModal` are rendered. */
const { state } = useModalStore();
</script>

<template>
  <ModalOutlet v-for="modal in state.opened" :key="modal.id" :modal="modal" />
</template>
