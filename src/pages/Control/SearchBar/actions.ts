import AddToPlaylistModal from "@/modals/AddToPlaylist/AddToPlaylistModal.vue";
import TemplateEditor from "@/modals/TemplateEditor/TemplateEditor.vue";
import TemplateInstanceCreator from "@/modals/TemplateInstanceCreator/TemplateInstanceCreator.vue";
import { openModal } from "@/modals/openModal";

/**
 * Actions fired by the search commands (port of `SearchBar/actions.ts`).
 */
export function showTemplateEditor() {
  openModal(TemplateEditor);
}

export function showSongCreator(songName: string) {
  openModal(AddToPlaylistModal, { typeId: "song", songName });
}

export function showTemplateCreator(templateId: string) {
  openModal(TemplateInstanceCreator, { templateId });
}
