import type { IconName } from "@/components/ui/iconPaths";
import landingPackage from "../../../package.json";

export type PlatformId = "windows" | "linux";

export interface PlatformInfo {
  id: PlatformId;
  label: string;
  icon: IconName;
  fileKind: string;
  installHint: string;
}

export const PLATFORMS: readonly PlatformInfo[] = [
  {
    id: "windows",
    label: "Windows",
    icon: "windows",
    fileKind: "Instalador (.exe)",
    installHint:
      "Execute o instalador. Como ele não tem assinatura digital, o Windows pode mostrar um aviso: clique em Mais informações e depois em Executar assim mesmo.",
  },
  {
    id: "linux",
    label: "Linux",
    icon: "linux",
    fileKind: "AppImage",
    installHint:
      "Dê permissão de execução ao arquivo (chmod +x) e abra-o com duplo clique ou pelo terminal.",
  },
];

/**
 * Published versions, from the most recent to the oldest.
 * The most recent comes from the landing's package.json; when releasing a new one, leave the previous one down here.
 */
export const RELEASE_VERSIONS: readonly string[] = [landingPackage.version];
