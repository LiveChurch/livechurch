import type { AppLocale } from "../i18n/AppLocale";
import type { BroadcastMode } from "../types/broadcast";

/** A broadcast window: what it shows and its number among the ones of the same mode. */
export interface BroadcastWindowInfo {
  mode: BroadcastMode;
  number: number;
}

const LABEL_PATTERN = /^broadcast-(caption|live)-(\d+)$/;

const MODE_NAMES: Record<AppLocale, Record<BroadcastMode, string>> = {
  "pt-BR": { caption: "Letra", live: "Ao vivo" },
  en: { caption: "Lyrics", live: "Live" },
  es: { caption: "Letra", live: "En vivo" },
};

/** Label and title of the broadcast windows (shared with Electron). */
export const BroadcastWindowUtils = {
  label({ mode, number }: BroadcastWindowInfo) {
    return `broadcast-${mode}-${number}`;
  },

  /** Mode and number of the window, or `null` if the window is not a broadcast one. */
  parse(windowLabel: string): BroadcastWindowInfo | null {
    const match = LABEL_PATTERN.exec(windowLabel);
    if (!match) return null;
    return { mode: match[1] === "live" ? "live" : "caption", number: Number(match[2]) };
  },

  /** Window title, which the operator picks in OBS's "Window Capture". */
  title({ mode, number }: BroadcastWindowInfo, locale: AppLocale) {
    return `LiveChurch — ${MODE_NAMES[locale][mode]} ${number}`;
  },

  /** Next window of the mode, with the lowest number that no open window uses. */
  next(mode: BroadcastMode, openLabels: Iterable<string>): BroadcastWindowInfo {
    const used = new Set<number>();
    for (const label of openLabels) {
      const info = BroadcastWindowUtils.parse(label);
      if (info?.mode === mode) used.add(info.number);
    }
    let number = 1;
    while (used.has(number)) number += 1;
    return { mode, number };
  },
};
