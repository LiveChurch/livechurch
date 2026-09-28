<script setup lang="ts">
import { KEYBOARD_SHORTCUT_GROUPS } from "@/core/constants/keyboardShortcuts";
import Modal from "../Modal.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
</script>

<template>
  <Modal :title="t('control.menu.shortcuts')" class-name="max-w-xl">
    <div class="flex flex-col gap-5">
      <section
        v-for="group in KEYBOARD_SHORTCUT_GROUPS"
        :key="group.title"
        class="flex flex-col gap-2"
      >
        <h3 class="text-xs font-semibold uppercase text-muted-foreground">{{ group.title }}</h3>
        <ul class="flex flex-col divide-y divide-border rounded-lg border border-border">
          <li
            v-for="shortcut in group.shortcuts"
            :key="shortcut.keys.join('+') + shortcut.description"
            class="flex items-center justify-between gap-4 px-3 py-2"
          >
            <span class="text-sm">{{ shortcut.description }}</span>
            <span class="flex shrink-0 items-center gap-1">
              <kbd
                v-for="(key, index) in shortcut.keys"
                :key="index"
                class="rounded border border-border bg-surface px-1.5 py-0.5 text-xs font-medium"
              >
                {{ key }}
              </kbd>
            </span>
          </li>
        </ul>
      </section>
    </div>
  </Modal>
</template>
