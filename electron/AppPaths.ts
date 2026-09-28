import path from "node:path";
import { app } from "electron";

interface AppPathSet {
  /** true when running from a bundle (installer or update). */
  isBundle: boolean;
  preload: string;
  rendererIndex: string | null;
  splash: string;
  icon: string;
}

const bundleDir = process.env.LIVECHURCH_BUNDLE_DIR;
const projectDir = app.getAppPath();
const iconPath = app.isPackaged
  ? path.join(process.resourcesPath, "icon.png")
  : path.join(projectDir, "public", "icon.png");

/**
 * Where the app's files live. In development they come from the source code; when running from
 * a bundle (`loader.ts` sets LIVECHURCH_BUNDLE_DIR) they come from inside it.
 */
export const AppPaths: AppPathSet = bundleDir
  ? {
      isBundle: true,
      preload: path.join(bundleDir, "preload.cjs"),
      rendererIndex: path.join(bundleDir, "renderer", "index.html"),
      splash: path.join(bundleDir, "renderer", "splashscreen.html"),
      icon: iconPath,
    }
  : {
      isBundle: false,
      preload: path.join(projectDir, "build", "electron", "preload.cjs"),
      rendererIndex: null,
      splash: path.join(projectDir, "public", "splashscreen.html"),
      icon: iconPath,
    };
