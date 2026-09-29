import { UpdateConfig } from "./UpdateConfig";
import type { UpdateRelease } from "./UpdateTypes";

export const UpdateApi = {
  /** Latest release for this platform (`<platform>.json`), or null if there is none yet. */
  async fetchLatest(): Promise<UpdateRelease | null> {
    const url = `${UpdateConfig.manifestBaseUrl}/${UpdateConfig.platform}.json`;

    const response = await fetch(url, {
      signal: AbortSignal.timeout(UpdateConfig.requestTimeoutMs),
    });
    if (response.status === 404) return null;
    if (!response.ok) throw new Error(`Manifesto de atualização respondeu HTTP ${response.status}`);
    return (await response.json()) as UpdateRelease;
  },
};
