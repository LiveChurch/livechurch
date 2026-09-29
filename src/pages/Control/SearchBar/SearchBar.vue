<script setup lang="ts">
/**
 * Header search bar (port of `SearchBar/index.tsx`).
 * The outside click that closes the dropdown (React's useDismissOnOutsideClick)
 * uses the useClickOutside composable with the local containerRef.
 */
import { ref } from "vue";
import { useClickOutside } from "@/core/composables/useClickOutside";
import { useSearchSelection } from "./useSearchSelection";
import SearchDropdown from "./SearchDropdown.vue";
import SearchInput from "./SearchInput.vue";

const containerRef = ref<HTMLElement | null>(null);
const {
  store,
  commands,
  songCommands,
  results,
  isLoading,
  keyboardNavigationRef,
  handleKeyDown,
  selectItem,
  hoverItem,
} = useSearchSelection();

// destructured refs: in the template the unwrap is automatic.
const { query, isOpen } = store;
const { setQuery, setOpen } = store;

useClickOutside(containerRef, () => setOpen(false));

const onFocus = () => {
  if (query.value) setOpen(true);
};
</script>

<template>
  <div ref="containerRef" class="relative z-50 mx-auto flex-1 max-w-xl">
    <SearchInput :query="query" @update:query="setQuery" @focus="onFocus" @keydown="handleKeyDown" />

    <SearchDropdown
      v-if="isOpen"
      :commands="commands"
      :song-commands="songCommands"
      :results="results"
      :selected-index="store.selectedIndex.value"
      :command-count="commands.length"
      :is-loading="isLoading"
      :has-query="Boolean(query)"
      @mousemove="keyboardNavigationRef = false"
      @hover="hoverItem"
      @select="selectItem"
    />
  </div>
</template>
