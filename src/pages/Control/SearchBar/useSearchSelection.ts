import { computed, ref } from "vue";
import { useCalendarStore } from "@/core/state/calendar/calendarStore";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { usePresentItem } from "@/core/composables/usePresentItem";
import { useSearch } from "@/core/composables/useSearch";
import { PlaylistItemMapper } from "@/core/services/PlaylistItemMapper";
import type { DateRange } from "@/core/types/calendar";
import type { SearchCommand, SearchResult } from "@/core/types/search";
import { buildSongCommands, buildTemplateCommands } from "./commands";
import { showSongCreator, showTemplateCreator, showTemplateEditor } from "./actions";

type SelectableItem = SearchCommand | SearchResult;

/** Verse with book and chapter: reuses the chapter's item if it is already in the playlist. */
function isVerseWithReference(
  item: SearchResult,
): item is SearchResult & { data: { book: string; chapter: string; verse?: string } } {
  return item.type === "bible-verse" && !!item.data?.book && !!item.data?.chapter;
}

/**
 * Selection and keyboard navigation logic of the search (port of
 * `useSearchSelection.ts`). useSearch's `ref`s require `.value` in the script;
 * `commands`/`allItems` became computeds (they were derived per re-render).
 */
export function useSearchSelection() {
  const playlistCtx = usePlaylistStore();
  const calendarCtx = useCalendarStore();
  const presentItem = usePresentItem();
  const { store, results, isLoading } = useSearch();
  const keyboardNavigationRef = ref(false);

  const commands = computed(() =>
    buildTemplateCommands(store.query.value, playlistCtx.state.slideTemplates),
  );

  const songCommands = computed(() => buildSongCommands(store.query.value));

  const allItems = computed<SelectableItem[]>(() => [
    ...commands.value,
    ...results.value,
    ...songCommands.value,
  ]);

  /** Adds the result to the playlist; with `present`, also puts it live. */
  const addResult = async (item: SearchResult, present: boolean) => {
    const playlistItem = await PlaylistItemMapper.fromSearchResult(
      item,
      (range: DateRange) => calendarCtx.actions.getEventsInRange(range),
    );
    playlistCtx.actions.addToPlaylist(playlistItem);
    if (present) await presentItem(playlistItem.id);
  };

  const selectItem = (index: number, present = false) => {
    const item = allItems.value[index];
    if (!item) return;

    if ("songName" in item && item.songName) {
      showSongCreator(item.songName);
    } else if ("templateId" in item && item.templateId) {
      showTemplateCreator(item.templateId);
    } else if (item.id === "create-template") {
      showTemplateEditor();
    } else if ("type" in item && isVerseWithReference(item)) {
      const { book, chapter, verse } = item.data;
      const id = playlistCtx.actions.openVerse(book, Number(chapter), Number(verse ?? 1));
      if (present) void presentItem(id);
    } else if ("type" in item) {
      void addResult(item as SearchResult, present);
    }

    store.reset();
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    const total = allItems.value.length;

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        keyboardNavigationRef.value = true;
        store.selectNext(total);
        break;
      case "ArrowUp":
        event.preventDefault();
        keyboardNavigationRef.value = true;
        store.selectPrevious(total);
        break;
      case "Enter":
        event.preventDefault();
        selectItem(store.selectedIndex.value, event.ctrlKey);
        break;
      case "Tab": {
        const selected = allItems.value[store.selectedIndex.value];
        if (selected) {
          event.preventDefault();
          const completion =
            "title" in selected ? selected.title : selected.label;
          store.setQuery(`${completion} `);
        }
        break;
      }
      case "Escape":
        store.reset();
        break;
      default:
        break;
    }
  };

  const hoverItem = (index: number) => {
    if (!keyboardNavigationRef.value) store.select(index);
  };

  return {
    store,
    commands,
    songCommands,
    results,
    isLoading,
    keyboardNavigationRef,
    handleKeyDown,
    selectItem,
    hoverItem,
  };
}
