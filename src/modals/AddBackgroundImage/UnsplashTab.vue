<script setup lang="ts">
import { ref } from "vue";
import Button from "primevue/button";
import Input from "@/components/ui/Input.vue";
import { cn } from "@/core/utils/ClassNameUtils";
import {
  UnsplashService,
  type UnsplashPhoto,
} from "@/core/services/UnsplashService";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/** Porta src/modals/addBackgroundImage/UnsplashTab.tsx (observer → reatividade nativa). */
defineProps<{
  selectedUrl: string;
}>();

const emit = defineEmits<{
  (event: "image-selected", url: string): void;
}>();

const query = ref("");
const loading = ref(false);
const results = ref<UnsplashPhoto[]>([]);
const error = ref<string | null>(null);

async function search() {
  if (!query.value.trim()) return;
  if (!UnsplashService.hasClientId()) {
    error.value = UnsplashService.missingClientIdMessage;
    return;
  }
  loading.value = true;
  error.value = null;
  try {
    results.value = await UnsplashService.search(query.value);
  } catch (searchError) {
    console.error("Erro ao buscar imagens no Unsplash", searchError);
    error.value = t("modals.addBackground.searchFailed");
  } finally {
    loading.value = false;
  }
}
</script>

<template>
  <div class="space-y-4">
    <div class="flex gap-2">
      <Input
        v-model="query"
        :placeholder="t('modals.addBackground.searchUnsplash')"
        class="min-w-0 flex-1"
        @keyup.enter="search"
      />
      <Button
        class="bg-primary text-white hover:bg-primary-hover"
        :loading="loading"
        icon="pi pi-search"
        :label="t('common.actions.find')"
        @click="search"
      />
    </div>

    <p v-if="error" class="text-xs text-danger">{{ error }}</p>

    <div v-if="results.length > 0" class="grid grid-cols-3 gap-2">
      <img
        v-for="photo in results"
        :key="photo.url"
        :src="photo.url"
        :alt="photo.alt"
        role="button"
        tabindex="0"
        :class="
          cn(
            'h-32 w-full cursor-pointer rounded-lg border-2 object-cover transition-colors',
            selectedUrl === photo.url
              ? 'border-brand'
              : 'border-border/80 hover:border-surface-light',
          )
        "
        @click="emit('image-selected', photo.url)"
        @keydown.enter="emit('image-selected', photo.url)"
      />
    </div>
  </div>
</template>
