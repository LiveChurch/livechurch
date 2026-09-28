import { markRaw, type Component } from "vue";
import AddCountdownForm from "./AddCountdownForm.vue";
import AddFreeSlidesForm from "./AddFreeSlidesForm.vue";
import AddMediaForm from "./AddMediaForm.vue";
import AddSavedItemsForm from "./AddSavedItemsForm.vue";
import AddSongForm from "./AddSongForm.vue";
import { I18n } from "@/core/i18n/I18n";

export type AddTypeId = "media" | "song" | "free-slides" | "countdown" | "saved";

export interface AddType {
  id: AddTypeId;
  label: string;
  description: string;
  icon: string;
  form: Component;
}

/** Item types that can be created manually in the playlist. */
export const ADD_TYPES: AddType[] = [
  {
    id: "media",
    get label() { return I18n.t("modals.addToPlaylist.types.mediaLabel"); },
    get description() { return I18n.t("modals.addToPlaylist.types.mediaDescription"); },
    icon: "app~image",
    form: markRaw(AddMediaForm),
  },
  {
    id: "song",
    get label() { return I18n.t("modals.addToPlaylist.types.songLabel"); },
    get description() { return I18n.t("modals.addToPlaylist.types.songDescription"); },
    icon: "app~music",
    form: markRaw(AddSongForm),
  },
  {
    id: "free-slides",
    get label() { return I18n.t("modals.addToPlaylist.types.freeSlidesLabel"); },
    get description() { return I18n.t("modals.addToPlaylist.types.freeSlidesDescription"); },
    icon: "app~fileText",
    form: markRaw(AddFreeSlidesForm),
  },
  {
    id: "countdown",
    get label() { return I18n.t("modals.addToPlaylist.types.countdownLabel"); },
    get description() { return I18n.t("modals.addToPlaylist.types.countdownDescription"); },
    icon: "app~timer",
    form: markRaw(AddCountdownForm),
  },
  {
    id: "saved",
    get label() { return I18n.t("modals.addToPlaylist.types.savedLabel"); },
    get description() { return I18n.t("modals.addToPlaylist.types.savedDescription"); },
    icon: "app~bookmark",
    form: markRaw(AddSavedItemsForm),
  },
];
