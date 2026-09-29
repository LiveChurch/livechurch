import { inject, provide, type InjectionKey } from "vue";

/**
 * Where the video is displayed:
 * - `preview`: player time reference; no sound and no autoplay;
 * - `monitor`: Live Output of the control window; follows the live one, no sound;
 * - `output`: projector window; follows the live one, with sound.
 */
export type VideoRole = "preview" | "monitor" | "output";

const VIDEO_ROLE_KEY: InjectionKey<VideoRole> = Symbol("videoRole");

export const provideVideoRole = (role: VideoRole) => {
  provide(VIDEO_ROLE_KEY, role);
};

export const useVideoRole = (): VideoRole => inject(VIDEO_ROLE_KEY, "output");
