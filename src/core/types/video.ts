export type VideoAction = "play" | "pause" | "seek";

/** Playback command sent to the screens that show the live video. */
export interface VideoCommand {
  action: VideoAction;
  /** Video position (in seconds) at the moment of the command. */
  time: number;
}
