import type { UpdateState } from "@/core/types/update";

/** State of someone with no update to offer (browser, or app already on the newest version). */
export const NO_UPDATE_STATE: UpdateState = {
  status: "idle",
  version: null,
  type: null,
  notes: null,
  progress: 0,
  error: null,
};
