import { onMounted, watch } from "vue";
import { BibleVersions } from "@/core/data/bibleVersions";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";

/**
 * Downloads the active Bible version in the background, after the control window
 * has been shown, so the first verse put on air does not wait for the download.
 * Lives here (and not in the store) so the projector/broadcast windows never load the Bible.
 */
export function usePreloadBibleVersion() {
  const { state } = usePlaylistStore();

  onMounted(() => {
    watch(
      () => state.bibleVersionId,
      (versionId) => {
        // The failure is already logged in `BibleVersions.load()`.
        BibleVersions.load(versionId).catch(() => null);
      },
      { immediate: true },
    );
  });
}
