<script setup lang="ts">
import { computed } from "vue";

interface MonitorIdentifyPageProps {
  windowLabel: string;
}

const props = defineProps<MonitorIdentifyPageProps>();

const monitorNumber = computed(() => {
  const segments = props.windowLabel.split("-");
  const maybeNumber = parseInt(segments[segments.length - 1] ?? "", 10);
  return Number.isNaN(maybeNumber) ? props.windowLabel : maybeNumber;
});
</script>

<template>
  <div
    class="flex h-screen w-screen items-center justify-center bg-overlay/90"
  >
    <span
      class="text-monitor-identify font-black text-white drop-shadow-[0_10px_40px_rgba(0,0,0,0.8)]"
    >
      {{ monitorNumber }}
    </span>
  </div>
</template>
