<script setup lang="ts">
/**
 * Projector monitor selection menu (port of
 * `src/pages/Control/StatusBar/MonitorMenu.tsx`). Includes the empty state
 * ("MonitorMenuEmptyState") inline in the template.
 */
import { computed, ref } from "vue";
import Button from "primevue/button";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { useMonitors } from "@/core/composables/useMonitors";
import { useClickOutside } from "@/core/composables/useClickOutside";
import { cn } from "@/core/utils/ClassNameUtils";
import type { DesktopMonitor } from "@/core/types/desktop";
import MonitorOption from "./MonitorOption.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const playlistCtx = usePlaylistStore();
const { monitors, loading, error, load } = useMonitors();

const menuRef = ref<HTMLElement | null>(null);
const open = ref(false);
const identifyingKey = ref<string | null>(null);

useClickOutside(menuRef, () => (open.value = false), open);

const close = () => {
  open.value = false;
};

const toggle = async () => {
  open.value = !open.value;
  if (open.value) await load();
};

const identify = async (monitor: DesktopMonitor, index: number) => {
  const key = `${monitor.name ?? "monitor"}-${index}`;
  identifyingKey.value = key;
  try {
    await playlistCtx.actions.identifyMonitor(monitor.id);
  } finally {
    if (identifyingKey.value === key) identifyingKey.value = null;
  }
};

const selectedMonitorId = computed(
  () => playlistCtx.state.projectorMonitorId,
);
const fallbackIndex = computed(() =>
  monitors.value.length > 1 ? 1 : 0,
);

const identifyKeyFor = (monitor: DesktopMonitor, index: number) =>
  `${monitor.name ?? "monitor"}-${index}`;
</script>

<template>
  <div ref="menuRef" class="relative z-80">
    <Button
      type="button"
      variant="text"
      severity="secondary"
      aria-haspopup="menu"
      :aria-expanded="open"
      :title="t('control.statusBar.selectMonitor')"
      :aria-label="t('control.statusBar.selectMonitor')"
      :class="
        cn(
          'p-1 text-muted-foreground transition-colors',
          open ? 'bg-surface-light' : 'hover:bg-surface-light/60',
        )
      "
      icon="pi pi-desktop"
      @click="() => void toggle()"
    />

    <div
      v-if="open"
      class="absolute bottom-11 right-0 z-90 w-[320px] rounded-xl border border-border bg-surface p-3 text-xs text-surface-foreground/80 shadow-2xl backdrop-blur-xl"
    >
      <div class="border-b border-border pb-3">
        <p class="text-xs uppercase text-bold text-muted-foreground">
          {{ t('control.statusBar.monitors') }}
        </p>
        <p class="text-xs text-muted-foreground/80">
          {{ t('control.statusBar.chooseProjector') }}
        </p>
      </div>

      <div class="mt-3 space-y-2" role="menu">
        <p v-if="loading" class="text-xs text-muted-foreground">
          {{ t('control.statusBar.loadingMonitors') }}
        </p>
        <p v-else-if="error" class="text-xs text-danger">{{ error }}</p>

        <template v-else>
          <MonitorOption
            v-for="(monitor, index) in monitors"
            :key="identifyKeyFor(monitor, index)"
            :monitor="monitor"
            :index="index"
            :selected="
              selectedMonitorId
                ? monitor.id === selectedMonitorId
                : index === fallbackIndex
            "
            :identifying="identifyingKey === identifyKeyFor(monitor, index)"
            @select="
              () => {
                playlistCtx.actions.setProjectorMonitorId(monitor.id);
                close();
              }
            "
            @identify="() => void identify(monitor, index)"
          />

          <div v-if="monitors.length === 0" class="space-y-2">
            <p class="text-xs text-muted-foreground">
              {{ t('control.statusBar.noMonitor') }}
            </p>
            <p class="text-xs leading-relaxed text-muted-foreground/80">
              {{ t('control.statusBar.externalMonitorHelp') }}
            </p>
            <Button
              type="button"
              variant="text"
              severity="secondary"
              class="mt-2 w-full rounded-lg border border-border px-3 py-2 text-surface-foreground hover:bg-surface-light/30"
              @click="() => void load()"
            >
              {{ t('control.statusBar.reloadList') }}
            </Button>
          </div>
        </template>

        <p v-if="monitors.length === 1" class="text-xs text-muted-foreground">
          {{ t('control.statusBar.onlyMainMonitor') }}
        </p>
      </div>
    </div>
  </div>
</template>
