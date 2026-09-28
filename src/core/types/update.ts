export type UpdateStatus = "idle" | "available" | "downloading" | "ready" | "error";

/** `code`: only the app code (applied on restart). `full`: complete installer with Electron. */
export type UpdateType = "code" | "full";

export interface UpdateState {
  status: UpdateStatus;
  version: string | null;
  type: UpdateType | null;
  notes: string | null;
  /** From 0 to 1, during the download. */
  progress: number;
  error: string | null;
}
