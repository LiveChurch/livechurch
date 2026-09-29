import { computed } from "vue";
import { useI18n } from "vue-i18n";
import type { MenuItem } from "primevue/menuitem";
import { useWindowControls } from "@/core/composables/useWindowControls";
import { APP_VERSION } from "@/core/constants/appVersion";
import { useLanguageStore } from "@/core/state/language/languageStore";
import { usePlaylistStore } from "@/core/state/playlist/playlistStore";
import { useThemeStore } from "@/core/state/theme/themeStore";
import AddToPlaylistModal from "@/modals/AddToPlaylist/AddToPlaylistModal.vue";
import Alert from "@/modals/Alert";
import CalendarModal from "@/modals/Calendar/CalendarModal.vue";
import CreatePlaylistModal from "@/modals/CreatePlaylist/CreatePlaylistModal.vue";
import GlobalThemesModal from "@/modals/GlobalThemes/GlobalThemesModal.vue";
import ReportBugModal from "@/modals/ReportBug/ReportBugModal.vue";
import ShortcutsModal from "@/modals/Shortcuts/ShortcutsModal.vue";
import SupportModal from "@/modals/Support/SupportModal.vue";
import TemplateEditor from "@/modals/TemplateEditor/TemplateEditor.vue";
import { openModal } from "@/modals/openModal";
import { useCheckForUpdates } from "./useCheckForUpdates";

const SEPARATOR: MenuItem = { separator: true };

/** Title bar menu items (Playlist, Slides, Calendar, Appearance, Language, Window, Help). */
export function useTitleBarMenuItems() {
  const { t } = useI18n();
  const playlistCtx = usePlaylistStore();
  const themeCtx = useThemeStore();
  const languageCtx = useLanguageStore();
  const { isMaximized, minimize, toggleMaximize, close } = useWindowControls();
  const checkForUpdates = useCheckForUpdates();

  return computed<MenuItem[]>(() => [
    {
      label: "LiveChurch",
      disabled: true,
      class: "[&_.p-tieredmenu-item-label]:text-muted-foreground",
    },
    {
      label: t("common.terms.playlist"),
      items: [
        {
          label: t("control.menu.newPlaylist"),
          command: () =>
            openModal(CreatePlaylistModal, {
              onCreate: (name: string) => playlistCtx.actions.createPlaylist(name),
            }),
        },
        {
          label: t("control.menu.addToPlaylist"),
          command: () => openModal(AddToPlaylistModal),
        },
      ],
    },
    {
      label: t("control.menu.slides"),
      items: [
        { label: t("control.menu.slideTemplates"), command: () => openModal(TemplateEditor) },
        { label: t("control.menu.slideThemes"), command: () => openModal(GlobalThemesModal) },
      ],
    },
    {
      label: t("control.menu.agenda"),
      items: [{ label: t("control.menu.eventCalendar"), command: () => openModal(CalendarModal) }],
    },
    {
      label: t("control.menu.appearance"),
      items: [
        {
          label:
            themeCtx.state.uiTheme === "dark"
              ? t("control.header.useLightTheme")
              : t("control.header.useDarkTheme"),
          command: themeCtx.actions.toggleUiTheme,
        },
      ],
    },
    {
      label: t("common.actions.language"),
      items: languageCtx.state.options.map((option) => ({
        label: option.label,
        icon: option.value === languageCtx.state.locale ? "pi pi-check" : undefined,
        command: () => languageCtx.actions.setLocale(option.value),
      })),
    },
    {
      label: t("control.menu.window"),
      items: [
        { label: t("control.titleBar.minimize"), command: minimize },
        {
          label: isMaximized.value ? t("control.titleBar.restore") : t("control.titleBar.maximize"),
          command: toggleMaximize,
        },
        SEPARATOR,
        { label: t("common.actions.close"), command: close },
      ],
    },
    {
      label: t("control.menu.help"),
      items: [
        { label: t("control.menu.shortcuts"), command: () => openModal(ShortcutsModal) },
        { label: t("control.menu.support"), command: () => openModal(SupportModal) },
        { label: t("control.menu.reportBug"), command: () => openModal(ReportBugModal) },
        { label: t("common.terms.checkTitle"), command: checkForUpdates },
        SEPARATOR,
        {
          label: t("control.menu.about"),
          command: () =>
            void Alert.show({
              title: t("control.menu.about"),
              message: t("control.menu.aboutMessage", { version: APP_VERSION }),
              confirmText: t("common.actions.ok"),
            }),
        },
      ],
    },
  ]);
}
