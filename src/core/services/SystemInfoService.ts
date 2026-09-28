import { APP_VERSION } from "../constants/appVersion";
import { desktop } from "./DesktopService";

export interface SystemInfo {
  appVersion: string;
  runtime: string;
  system: string;
  language: string;
  screen: string;
}

/** Environment data that helps reproduce a problem. */
export const SystemInfoService = {
  collect(): SystemInfo {
    return {
      appVersion: APP_VERSION,
      runtime: desktop.platform === "electron" ? "Aplicativo desktop" : "Navegador",
      system: navigator.userAgent,
      language: navigator.language,
      screen: `${window.screen.width}x${window.screen.height}`,
    };
  },

  /** Markdown list, ready to paste into a ticket. */
  format(info: SystemInfo): string {
    return [
      `- Versão do app: ${info.appVersion}`,
      `- Execução: ${info.runtime}`,
      `- Sistema: ${info.system}`,
      `- Idioma: ${info.language}`,
      `- Tela: ${info.screen}`,
    ].join("\n");
  },
};
