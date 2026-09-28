import { defineStore } from "pinia";
import { reactive, watch } from "vue";
import { BibleVersions } from "@/core/data/bibleVersions";
import type {
  BibleVersion,
  Playlist,
  PlaylistItem,
  Slide,
} from "@/core/types/playlist";
import type { SlidesTheme } from "@/core/types/theme";
import { BibleSlides } from "./BibleSlides";
import { createPlaylistActions } from "./playlistActions";
import { createBackgroundActions } from "./backgroundActions";
import { createBibleActions } from "./bibleActions";
import { createLiveActions } from "./liveActions";
import { createTemplateActions } from "./templateActions";
import {
  loadPersistedPlaylistState,
  normalizePlaylistState,
  snapshotForPersistence,
} from "./playlistHydration";
import {
  PlaylistPersistence,
  PLAYLIST_STORAGE_KEY,
  TEMPLATE_STORAGE_KEY,
} from "./PlaylistPersistence";
import type { PlaylistState } from "./playlistTypes";
import { DEFAULT_PLAYLIST } from "./playlistTypes";
import { ThemeCategories } from "../theme/themeCategories";
import { useThemeStore } from "../theme/themeStore";
import { PersistenceUtils } from "@/core/utils/PersistenceUtils";
import { BibleBooks } from "@/core/utils/BibleBooks";

function bibleSlidesFor(state: PlaylistState): Slide[] {
  const item = state.activeItem;
  if (!item) return [];
  const bookName = item.bibleData?.book ?? "";
  const chapterNumber = parseInt(item.bibleData?.chapter || "0");
  const bookIndex = BibleBooks.indexOf(bookName);
  if (bookIndex === -1 || !chapterNumber) return [];
  const book = BibleSlides.getBook(
    BibleVersions.books(state.bibleVersionId),
    bookIndex,
  );
  if (!book) return [];
  return BibleSlides.chapterSlides(book, bookName, chapterNumber);
}

/**
 * Playlist store (replaces MobX's PlaylistStore + React's PlaylistContext).
 * Keeps the `{ state, actions }` API to ease porting.
 */
export const usePlaylistStore = defineStore("playlist", () => {
  const themeStore = useThemeStore();

  const state: PlaylistState = reactive({
    playlists: [structuredClone(DEFAULT_PLAYLIST)] as Playlist[],
    slideTemplates: [] as PlaylistState["slideTemplates"],
    activePlaylistId: "default",
    activeItemId: null as string | null,
    liveContent: null as PlaylistState["liveContent"],
    liveItemId: null as string | null,
    livePaused: false,
    background: null as PlaylistState["background"],
    notice: null as PlaylistState["notice"],
    activeThemePanelSection: null as PlaylistState["activeThemePanelSection"],
    bibleVersionId: "blivre",
    projectorMonitorId: null as string | null,
    isHydrated: false,

    get activePlaylist() {
      return (
        this.playlists.find((p) => p.id === this.activePlaylistId) ??
        this.playlists[0]
      );
    },
    get playlist() {
      return this.activePlaylist.items;
    },
    get bibleVersions() {
      return BibleVersions.all;
    },
    get activeBibleVersion(): BibleVersion {
      return BibleVersions.find(this.bibleVersionId);
    },
    get activeItem(): PlaylistItem | undefined {
      return this.playlist.find((item) => item.id === this.activeItemId);
    },
    get activeSlideIndex() {
      return this.activeItem?.activeSlideIndex ?? 0;
    },
    get isPreviewLive() {
      return (
        !!this.liveContent &&
        this.liveContent.playlistItemId === this.activeItem?.id &&
        this.liveContent.slideIndex === this.activeSlideIndex
      );
    },
    get canPauseLive() {
      return (
        !!this.liveContent &&
        !this.livePaused &&
        this.activeItemId === this.liveItemId
      );
    },
    get canFocusLive() {
      const liveItemId = this.liveContent?.playlistItemId;
      return (
        !this.isPreviewLive &&
        this.playlists.some((playlist) =>
          playlist.items.some((item) => item.id === liveItemId),
        )
      );
    },
    get isLiveBackground() {
      const { liveContent, background } = this;
      return (
        !!liveContent &&
        !!background &&
        liveContent.playlistItemId === background.itemId &&
        liveContent.slideIndex === background.slideIndex
      );
    },
    get isPreviewBackground() {
      const { background } = this;
      return (
        !!background &&
        background.itemId === this.activeItemId &&
        background.slideIndex === this.activeSlideIndex
      );
    },
    get canStopLive() {
      return !!this.liveContent && !this.isLiveBackground;
    },
    get slides(): Slide[] {
      const item = this.activeItem;
      if (!item) return [];
      if (item.type === "bible" || item.type === "bible-verse") {
        return bibleSlidesFor(this);
      }
      return item.slides ?? [];
    },
    get canGoToPreviousChapter() {
      const item = this.activeItem;
      if (!item || item.type !== "bible-verse") return false;
      const chapter = parseInt(item.bibleData?.chapter || "0");
      return (
        chapter > 1 && BibleBooks.indexOf(item.bibleData?.book) !== -1
      );
    },
    get canGoToNextChapter() {
      const item = this.activeItem;
      if (!item || item.type !== "bible-verse") return false;
      const chapter = parseInt(item.bibleData?.chapter || "0");
      if (!chapter) return false;
      const bookIndex = BibleBooks.indexOf(item.bibleData?.book);
      if (bookIndex === -1) return false;
      const book = BibleSlides.getBook(
        BibleVersions.books(this.bibleVersionId),
        bookIndex,
      );
      return !!book && chapter < book.chapters.length;
    },
  });

  const playlistActions = createPlaylistActions(state, (itemType) =>
    themeStore.actions.resolveDefaultBinding(ThemeCategories.forItemType(itemType)),
  );
  const liveActions = createLiveActions(state);
  const bibleActions = createBibleActions(state, {
    addToPlaylist: playlistActions.addToPlaylist,
    setActiveItemId: playlistActions.setActiveItemId,
    setLiveItemId: liveActions.setLiveItemId,
  });
  const backgroundActions = createBackgroundActions(
    state,
    liveActions,
    (item) => themeStore.actions.resolveThemeBinding(item.themeBinding),
  );
  const templateActions = createTemplateActions(state);

  const actions = {
    ...playlistActions,
    ...bibleActions,
    ...liveActions,
    ...backgroundActions,
    ...templateActions,

    async hydrate() {
      await loadPersistedPlaylistState(state);
      try {
        const savedTemplates =
          await PlaylistPersistence.read<PlaylistState["slideTemplates"]>(
            TEMPLATE_STORAGE_KEY,
          );
        if (savedTemplates) state.slideTemplates = savedTemplates;
      } catch (error) {
        console.error("Falha ao carregar templates", error);
      } finally {
        normalizePlaylistState(state);
        state.isHydrated = true;
      }
    },

    persistSnapshot() {
      if (!state.isHydrated) return;
      void PlaylistPersistence.write(
        PLAYLIST_STORAGE_KEY,
        snapshotForPersistence(state),
      ).catch((error) => {
        console.error("Falha ao persistir playlists", error);
      });
    },
  };

  // Replaces PlaylistContext's automatic go-live `reaction`:
  // when the active slide or the resolved theme changes and the preview is the live item,
  // updates the projector.
  watch(
    () =>
      [
        state.activeSlideIndex,
        themeStore.actions.resolveThemeBinding(
          state.activeItem?.themeBinding,
        ),
      ] as [number, SlidesTheme],
    ([activeSlideIndex, theme]) => {
      if (state.activeItemId !== state.liveItemId) return;
      console.log("Active slide index:", activeSlideIndex, "Theme:", theme);
      const activeSlide = state.slides[activeSlideIndex];
      if (activeSlide) void actions.updateLive(activeSlide, theme);
    },
  );

  // Replaces PlaylistContext's persistence `reaction`. Debounced so it does
  // not rewrite the whole playlist on every reactive change (e.g. switching items).
  // `deep` only traverses the state; serializing here would copy everything (including inline
  // slide images) on every change.
  const debouncedPersistSnapshot = PersistenceUtils.debouncePersist(() =>
    actions.persistSnapshot(),
  );
  watch(
    () => [
      state.isHydrated,
      state.playlists,
      state.activePlaylistId,
      state.activeItemId,
      state.liveItemId,
      state.liveContent,
      state.background,
      state.bibleVersionId,
      state.projectorMonitorId,
    ],
    () => {
      if (state.isHydrated) debouncedPersistSnapshot();
    },
    { deep: true },
  );

  // Each item draws its rotation background once; it stays saved with the item.
  watch(
    () => state.activeItem,
    (item) => {
      if (item && !item.backgroundSeed) item.backgroundSeed = String(Math.random());
    },
    { immediate: true },
  );

  void actions.hydrate();

  return { state, actions };
});
