<script setup lang="ts">
import LiveOutput from "@/components/slides/LiveOutput.vue";
import { useLivePayload } from "@/core/composables/useLivePayload";

const { content } = useLivePayload();
</script>

<template>
  <div class="flex h-screen">
    <LiveOutput :content="content" />
  </div>
</template>
