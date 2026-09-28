<script setup lang="ts">
// API: data props; emits "hover(index)" and "select(index)".
import { computed } from "vue";
import type { SearchCommand, SearchResult } from "@/core/types/search";
import AppIcon from "@/components/ui/AppIcon.vue";
import SearchCommandRow from "./SearchCommandRow.vue";
import { cn } from "@/core/utils/ClassNameUtils";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

/**
 * Search results dropdown (port of `SearchBar/SearchDropdown.tsx`).
 * React's `ItemRow`/`EnterBadge` became inline blocks in the v-for
 * (same classes). The `keyboardNavigationRef` is handled by the parent via
 * @mousemove on the component.
 */
const props = defineProps<{
  commands: SearchCommand[];
  songCommands: SearchCommand[];
  results: SearchResult[];
  selectedIndex: number;
  commandCount: number;
  isLoading: boolean;
  hasQuery: boolean;
}>();

const emit = defineEmits<{
  (event: "hover", index: number): void;
  (event: "select", index: number): void;
}>();

const songStartIndex = computed(() => props.commandCount + props.results.length);

const rowClasses = (selected: boolean) =>
  cn(
    "flex items-center gap-3 px-3 py-2.5 rounded-md cursor-pointer",
    selected
      ? "bg-brand text-white"
      : "text-muted-foreground hover:bg-surface-light/30",
  );
</script>

<template>
  <div
    role="listbox"
    class="absolute left-0 right-0 top-full mt-2 max-h-[60vh] overflow-y-auto rounded-lg border border-border bg-surface shadow-2xl"
  >
    <div v-if="commands.length > 0" class="space-y-0.5 border-b border-border/60 p-1.5">
      <SearchCommandRow
        v-for="(command, index) in commands"
        :key="command.id"
        :command="command"
        :selected="index === selectedIndex"
        @click="emit('select', index)"
        @mouseenter="emit('hover', index)"
      />
    </div>

    <div v-if="results.length > 0" class="space-y-0.5 p-1.5">
      <div
        v-for="(result, index) in results"
        :key="`${result.id}-${index}`"
        role="option"
        :aria-selected="commandCount + index === selectedIndex"
        :class="rowClasses(commandCount + index === selectedIndex)"
        @click="emit('select', commandCount + index)"
        @mouseenter="emit('hover', commandCount + index)"
      >
        <div class="rounded-md bg-surface-light/30 p-2">
          <AppIcon
            :name="
              result.type === 'song' || result.type === 'harpa'
                ? 'app~music'
                : 'app~book'
            "
            size="16px"
          />
        </div>
        <div class="min-w-0 flex-1">
          <div class="flex items-center justify-between">
            <span class="truncate text-sm font-medium">{{ result.title }}</span>
            <span
              v-if="commandCount + index === selectedIndex"
              class="rounded bg-surface-light/30 px-1.5 py-0.5 text-xs text-white/90"
            >
              Enter
            </span>
          </div>
          <p class="truncate text-xs opacity-80">{{ result.subtitle }}</p>
        </div>
      </div>
    </div>

    <div v-if="songCommands.length > 0" class="space-y-0.5 border-t border-border/60 p-1.5">
      <SearchCommandRow
        v-for="(command, index) in songCommands"
        :key="command.id"
        :command="command"
        :selected="songStartIndex + index === selectedIndex"
        @click="emit('select', songStartIndex + index)"
        @mouseenter="emit('hover', songStartIndex + index)"
      />
    </div>

    <div
      v-if="isLoading"
      class="flex items-center justify-center gap-3 border-b border-border/60 bg-background/30 p-4"
    >
      <div
        class="h-3 w-3 animate-spin rounded-full border-2 border-brand border-t-transparent"
      />
      <span
        class="animate-pulse text-xs font-black uppercase tracking-widest text-muted-foreground"
      >
        {{ t('control.search.searching') }}
      </span>
    </div>

    <div
      v-if="!(commands.length > 0 || results.length > 0) && hasQuery && !isLoading"
      class="p-8 text-center text-sm text-muted-foreground"
    >
      {{ t('control.search.noResults') }}
    </div>

    <div
      v-if="commands.length > 0 || results.length > 0 || songCommands.length > 0"
      class="sticky bottom-0 flex flex-col border-t border-border/60 bg-surface text-xs text-muted-foreground"
    >
      <div class="flex justify-between px-3 py-2">
        <span>{{ t('control.search.navigateHint') }}</span>
        <span>{{ t('control.search.selectHint') }}</span>
      </div>
      <p
        v-if="results.some((result) => result.type === 'song')"
        class="border-t border-border/60 px-3 py-2"
      >
        {{ t('control.search.lyricsNotice') }}
      </p>
    </div>
  </div>
</template>
