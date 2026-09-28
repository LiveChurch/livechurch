<script setup lang="ts">
/** System information with a button to copy and paste into a help request. */
import { onUnmounted, ref } from "vue";
import Button from "primevue/button";
import { SystemInfoService } from "@/core/services/SystemInfoService";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const COPIED_FEEDBACK_MS = 2000;

const info = SystemInfoService.format(SystemInfoService.collect());
const copyStatus = ref<"idle" | "copied" | "failed">("idle");
let resetTimer: ReturnType<typeof setTimeout> | undefined;

const copy = async () => {
  clearTimeout(resetTimer);
  try {
    await navigator.clipboard.writeText(info);
    copyStatus.value = "copied";
  } catch (error) {
    console.error("Falha ao copiar as informações do sistema", error);
    copyStatus.value = "failed";
  }
  resetTimer = setTimeout(() => (copyStatus.value = "idle"), COPIED_FEEDBACK_MS);
};

onUnmounted(() => clearTimeout(resetTimer));

const COPY_LABELS = {
  idle: t("modals.support.copy"),
  copied: t("modals.support.copied"),
  failed: t("modals.support.copyFailed"),
} as const;
</script>

<template>
  <section class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <h4
        class="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground"
      >
        {{ t('modals.support.systemInfo') }}
      </h4>
      <Button
        type="button"
        variant="text"
        severity="secondary"
        size="small"
        :icon="copyStatus === 'copied' ? 'pi pi-check' : 'pi pi-copy'"
        :label="COPY_LABELS[copyStatus]"
        class="text-muted-foreground hover:text-surface-foreground"
        @click="copy"
      />
    </div>
    <pre
      class="custom-scrollbar select-text overflow-x-auto whitespace-pre-wrap break-words rounded-lg border border-border bg-background p-3 font-mono text-xs text-muted-foreground"
      >{{ info }}</pre
    >
  </section>
</template>
