<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import Input from "@/components/ui/Input.vue";
import { cn } from "@/core/utils/ClassNameUtils";
import { useThemeStore } from "@/core/state/theme/themeStore";
import Modal from "../Modal.vue";
import ImageUpload from "@/components/ui/ImageUpload.vue";
import UnsplashTab from "./UnsplashTab.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Porta src/modals/AddBackgroundImageModal.tsx (modal aberto via openModal()). */
const props = defineProps<{
  onSaveBackground?: (name: string, imageUrl: string) => void;
}>();

const themeCtx = useThemeStore();

const modalRef = ref<InstanceType<typeof Modal> | null>(null);
const close = () => modalRef.value?.hide();

type BackgroundTab = "upload" | "unsplash";

const TABS: Array<{ id: BackgroundTab; label: string; icon: string }> = [
  { id: "upload", label: t("modals.addBackground.upload"), icon: "pi pi-upload" },
  { id: "unsplash", label: "Unsplash", icon: "pi pi-search" },
];

const tab = ref<BackgroundTab>("upload");
const name = ref("");
const imageUrl = ref("");

const setImage = (url: string) => {
  imageUrl.value = url;
};

const save = () => {
  if (!name.value.trim() || !imageUrl.value) return;
  if (props.onSaveBackground) {
    props.onSaveBackground(name.value, imageUrl.value);
  } else {
    themeCtx.actions.addCustomBackground(name.value, imageUrl.value);
  }
  close();
};
</script>

<template>
  <Modal
    ref="modalRef"
    :title="t('modals.addBackground.title')"
    class-name="max-w-2xl"
  >
    <div class="space-y-6">
      <Input
        v-model="name"
        :label="t('modals.addBackground.name')"
        :placeholder="t('modals.addBackground.nameExample')"
      />

      <div class="flex gap-2 border-b border-border/80">
        <Button
          v-for="{ id, label, icon } in TABS"
          :key="id"
          variant="text"
          severity="secondary"
          class="rounded-none border-0 bg-transparent font-medium transition-colors"
          :class="
            cn(
              tab === id
                ? 'border-b-2 border-brand text-brand'
                : 'text-muted-foreground hover:text-surface-foreground',
            )
          "
            :icon="icon"
            :label="label"
          @click="tab = id"
          />
      </div>

      <ImageUpload
        v-if="tab === 'upload'"
        :aria-label="t('modals.addBackground.uploadLabel')"
        @select="setImage"
      />
      <UnsplashTab
        v-else
        :selected-url="imageUrl"
        @image-selected="setImage"
      />

      <div v-if="imageUrl">
        <p class="mb-2 text-sm text-muted-foreground">{{ t('modals.addBackground.preview') }}</p>
        <div class="relative">
          <img :src="imageUrl" :alt="t('modals.addBackground.previewAlt')" class="h-48 w-full rounded-lg object-cover" />
          <Button
            type="button"
            variant="text"
            severity="secondary"
            icon="pi pi-trash"
            :aria-label="t('modals.addBackground.removeImage')"
            class="absolute right-2 top-2 rounded bg-surface p-1 text-inherit hover:text-danger-hover"
            @click="imageUrl = ''"
          />
        </div>
      </div>
    </div>

    <template #footer>
      <div class="flex w-full justify-end gap-3">
        <Button
          variant="text"
          severity="secondary"
          class="bg-surface-light text-surface-foreground"
          :label="t('common.actions.cancel')"
          @click="close()"
        />
        <Button
          class="bg-primary text-white hover:bg-primary-hover"
          :label="t('modals.addBackground.addBackground')"
          :disabled="!name.trim() || !imageUrl"
          @click="save"
        />
      </div>
    </template>
  </Modal>
</template>
