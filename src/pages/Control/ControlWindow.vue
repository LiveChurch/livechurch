<script setup lang="ts">
/**
 * Main window (port of `src/pages/Control/index.tsx`).
 * Composition: TitleBar + Header + (LeftSidebar | CenterPanel) + StatusBar.
 */
import TitleBar from "./TitleBar.vue";
import Header from "./Header.vue";
import LeftSidebar from "./LeftSidebar/LeftSidebar.vue";
import CenterPanel from "./CenterPanel/CenterPanel.vue";
import StatusBar from "./StatusBar/StatusBar.vue";
import BibleShortcutOverlay from "./BibleShortcut/BibleShortcutOverlay.vue";
import { useCountdownFinish } from "./useCountdownFinish";
import { useShowBackgroundOnStart } from "./useShowBackgroundOnStart";
import { usePreloadBibleVersion } from "./usePreloadBibleVersion";
import { useSuggestBibleVersion } from "./useSuggestBibleVersion";

useShowBackgroundOnStart();
useCountdownFinish();
usePreloadBibleVersion();
useSuggestBibleVersion();
</script>

<template>
  <div class="window-container flex select-none flex-col overflow-hidden">
    <TitleBar />
    <Header />
    <div class="flex min-h-0 flex-1 gap-2 overflow-hidden p-2">
      <LeftSidebar />
      <CenterPanel />
    </div>
    <StatusBar />
    <BibleShortcutOverlay />
  </div>
</template>
