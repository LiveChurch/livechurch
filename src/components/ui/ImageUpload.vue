<script setup lang="ts">
import { computed, ref } from "vue";
import FileUpload from "primevue/fileupload";
import AppIcon from "@/components/ui/AppIcon.vue";
import { desktop } from "@/core/services/DesktopService";
import { UnsplashService } from "@/core/services/UnsplashService";
import { cn } from "@/core/utils/ClassNameUtils";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = withDefaults(
  defineProps<{
    ariaLabel?: string;
    multiple?: boolean;
    compact?: boolean;
    /** Also accepts videos, which are referenced by their path on disk. */
    acceptVideo?: boolean;
  }>(),
  { multiple: false, compact: false, acceptVideo: false },
);

/** Emitted once per file, in the order they were selected. */
const emit = defineEmits<{
  (event: "select", dataUrl: string, fileName: string): void;
  (event: "selectVideo", filePath: string, fileName: string): void;
}>();

const uploadRef = ref<InstanceType<typeof FileUpload> | null>(null);

const accept = computed(() => (props.acceptVideo ? "image/*,video/*" : "image/*"));

const promptText = computed(() => {
  const noun = props.acceptVideo ? t("components.imageUpload.nounImagesOrVideos") : t("components.imageUpload.nounImages");
  if (props.multiple) return t("components.imageUpload.dropMany", { noun });
  return props.acceptVideo
    ? t("components.imageUpload.dropOneImageOrVideo")
    : t("components.imageUpload.dropOneImage");
});

const hintText = computed(() =>
  props.acceptVideo ? t("components.imageUpload.hintWithVideo") : t("components.imageUpload.hint"),
);

const emitVideo = (file: File) => {
  const filePath = desktop.getPathForFile(file);
  if (!filePath) throw new Error(t("components.imageUpload.noPath", { name: file.name }));
  emit("selectVideo", filePath, file.name);
};

const readAndEmit = async (file: File) => {
  try {
    if (file.type.startsWith("video/")) emitVideo(file);
    else emit("select", await UnsplashService.readImageFile(file), file.name);
  } catch (error) {
    console.error("Falha ao ler o arquivo selecionado", error);
  }
};

const handleSelect = async (event: { files?: File[] }) => {
  const files = [...(event.files ?? [])];
  // FileUpload accumulates files across selections; we clear it so that each
  // selection emits only the new files.
  uploadRef.value?.clear();
  for (const file of files) await readAndEmit(file);
};
</script>

<template>
  <div
    :class="
      cn(
        'relative rounded-lg border-2 border-dashed border-border/80 text-center',
        props.compact ? 'px-4 py-2.5' : 'p-8',
      )
    "
  >
    <FileUpload
      ref="uploadRef"
      mode="basic"
      :accept="accept"
      :auto="true"
      custom-upload
      :multiple="props.multiple"
      :show-clear="false"
      choose-label=""
      :aria-label="props.ariaLabel ?? t('components.imageUpload.ariaLabel')"
      class="absolute! inset-0 h-full! w-full! cursor-pointer opacity-0"
      @select="handleSelect"
    />
    <div
      :class="
        cn(
          'pointer-events-none flex items-center gap-2',
          props.compact ? 'justify-center' : 'flex-col',
        )
      "
    >
      <AppIcon
        name="app~upload"
        :size="props.compact ? '20px' : '32px'"
        class="text-muted-foreground"
      />
      <span class="text-muted-foreground">{{ promptText }}</span>
      <span class="text-xs text-muted-foreground/70">{{ hintText }}</span>
    </div>
  </div>
</template>
