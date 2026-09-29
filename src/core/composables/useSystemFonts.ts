import { ref } from "vue";
import { desktop } from "@/core/services/DesktopService";
import { I18n } from "@/core/i18n/I18n";

let cachedFonts: string[] | null = null;
let pendingLoad: Promise<string[]> | null = null;

/**
 * Lists the fonts installed on the operating system (via Electron/font-list,
 * with a fallback to the Local Font Access API in the browser). The result is
 * cached in memory between uses, since the list does not change during the session.
 */
export function useSystemFonts() {
  const fonts = ref<string[]>(cachedFonts ?? []);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const load = async () => {
    if (cachedFonts) {
      fonts.value = cachedFonts;
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      pendingLoad ??= desktop.getSystemFonts();
      const result = await pendingLoad;
      cachedFonts = result;
      fonts.value = result;
    } catch (err) {
      console.error("Falha ao listar fontes do sistema", err);
      error.value = I18n.t("core.errors.listFonts");
    } finally {
      pendingLoad = null;
      loading.value = false;
    }
  };

  return { fonts, loading, error, load };
}
