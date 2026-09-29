import type { LiveContent, PersistedPlaylistState } from "@/core/types/playlist";
import { BibleVersions } from "@/core/data/bibleVersions";
import {
  PlaylistPersistence,
  PLAYLIST_STORAGE_KEY,
} from "./PlaylistPersistence";
import type { PlaylistState } from "./playlistTypes";
import { DEFAULT_PLAYLIST } from "./playlistTypes";

export function normalizePlaylistState(state: PlaylistState) {
  if (state.playlists.length === 0) {
    state.playlists = [{ ...DEFAULT_PLAYLIST, items: [] }];
  }

  const active =
    state.playlists.find((p) => p.id === state.activePlaylistId) ??
    state.playlists[0];

  state.activePlaylistId = active.id;
  state.activeItemId = active.items.some((i) => i.id === state.activeItemId)
    ? state.activeItemId
    : (active.items[0]?.id ?? null);
}

/** Old versions persisted the whole Bible along with the live content. */
function withBibleMetadataOnly(content: LiveContent): LiveContent {
  return { ...content, bibleVersion: BibleVersions.find(content.bibleVersion?.id) };
}

export async function loadPersistedPlaylistState(state: PlaylistState) {
  // Imported Bibles must be listed before validating the saved version.
  await BibleVersions.ready;
  try {
    const saved =
      await PlaylistPersistence.read<Partial<PersistedPlaylistState>>(
        PLAYLIST_STORAGE_KEY,
      );
    if (!saved) return;

    if (Array.isArray(saved.playlists)) {
      state.playlists = saved.playlists;
    }
    if (typeof saved.activePlaylistId === "string") {
      state.activePlaylistId = saved.activePlaylistId;
    }
    if (typeof saved.activeItemId === "string" || saved.activeItemId === null) {
      state.activeItemId = saved.activeItemId;
    }
    if (typeof saved.liveItemId === "string" || saved.liveItemId === null) {
      state.liveItemId = saved.liveItemId;
    }
    if ("liveContent" in saved) {
      state.liveContent = saved.liveContent ? withBibleMetadataOnly(saved.liveContent) : null;
    }
    const background = saved.background;
    if (
      typeof background?.itemId === "string" &&
      typeof background.slideIndex === "number"
    ) {
      state.background = background;
    }
    if (
      typeof saved.bibleVersionId === "string" &&
      state.bibleVersions.some((v) => v.id === saved.bibleVersionId)
    ) {
      state.bibleVersionId = saved.bibleVersionId;
    }
    if (
      typeof saved.projectorMonitorId === "string" ||
      saved.projectorMonitorId === null
    ) {
      state.projectorMonitorId = saved.projectorMonitorId;
    }

    normalizePlaylistState(state);
  } catch (error) {
    console.error("Falha ao carregar playlists", error);
  }
}

export function snapshotForPersistence(
  state: PlaylistState,
): PersistedPlaylistState {
  return JSON.parse(
    JSON.stringify({
      playlists: state.playlists,
      activePlaylistId: state.activePlaylistId,
      activeItemId: state.activeItemId,
      liveItemId: state.liveItemId,
      liveContent: state.liveContent,
      background: state.background,
      bibleVersionId: state.bibleVersionId,
      projectorMonitorId: state.projectorMonitorId,
    }),
  );
}
