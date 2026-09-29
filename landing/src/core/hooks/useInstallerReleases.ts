"use client";

import { useEffect, useState } from "react";
import { GitHubReleaseService } from "@/core/services/GitHubReleaseService";
import type { InstallerRelease } from "@/core/types/release";

export type InstallerReleasesState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; releases: InstallerRelease[] };

/** Fetches in the browser the versions with an installer published on GitHub (the landing has no server). */
export function useInstallerReleases(): InstallerReleasesState {
  const [state, setState] = useState<InstallerReleasesState>({ status: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    GitHubReleaseService.listInstallerReleases(controller.signal)
      .then((releases) => setState({ status: "ready", releases }))
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        console.error("Falha ao buscar as versões no GitHub", error);
        setState({ status: "error" });
      });
    return () => controller.abort();
  }, []);

  return state;
}
