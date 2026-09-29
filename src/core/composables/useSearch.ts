import { computed, ref, watch } from "vue";
import { LyricsService } from "@/core/services/LyricsService";
import { SearchService } from "@/core/services/SearchService";
import type { LyricsTrack } from "@/core/types/lyrics";

function createSearchState() {
  return {
    query: ref(""),
    selectedIndex: ref(0),
    isOpen: ref(false),
  };
}

/**
 * Search with debounce + local results (Bible/Harpa/Calendar/templates)
 * and remote ones (songs). Replaces the useSearch hook (react-query + MobX).
 */
export function useSearch() {
  const { query, selectedIndex, isOpen } = createSearchState();

  const setQuery = (value: string) => {
    query.value = value;
    selectedIndex.value = 0;
    isOpen.value = Boolean(value);
  };

  const select = (index: number) => {
    selectedIndex.value = index;
  };

  const selectNext = (total: number) => {
    if (total === 0) return;
    selectedIndex.value = (selectedIndex.value + 1) % total;
  };

  const selectPrevious = (total: number) => {
    if (total === 0) return;
    selectedIndex.value = (selectedIndex.value - 1 + total) % total;
  };

  const setOpen = (value: boolean) => {
    isOpen.value = value;
  };

  const reset = () => {
    query.value = "";
    isOpen.value = false;
    selectedIndex.value = 0;
  };

  // Remote search with a 400ms debounce (equivalent to useQuery + useDebounce).
  const remoteSongs = ref<LyricsTrack[]>([]);
  const isLoading = ref(false);
  const cache = new Map<string, LyricsTrack[]>();
  let debounceTimer: number | undefined;
  let requestVersion = 0;

  watch(query, (value) => {
    window.clearTimeout(debounceTimer);
    if (value.length < 3) {
      remoteSongs.value = [];
      isLoading.value = false;
      return;
    }
    debounceTimer = window.setTimeout(async () => {
      const cached = cache.get(value);
      if (cached) {
        remoteSongs.value = cached;
        return;
      }
      const version = ++requestVersion;
      isLoading.value = true;
      try {
        const tracks = await LyricsService.searchTracks(value);
        if (version !== requestVersion) return;
        cache.set(value, tracks);
        remoteSongs.value = tracks;
      } catch (error) {
        console.error("Falha na busca remota", error);
      } finally {
        if (version === requestVersion) isLoading.value = false;
      }
    }, 400);
  });

  const results = computed(() =>
    SearchService.buildLocalResults(query.value, remoteSongs.value),
  );

  watch(
    () => results.value.length,
    (length) => {
      selectedIndex.value = Math.min(
        selectedIndex.value,
        Math.max(length - 1, 0),
      );
    },
  );

  return {
    store: { query, selectedIndex, isOpen, setQuery, select, selectNext, selectPrevious, setOpen, reset },
    results,
    isLoading,
  };
}
