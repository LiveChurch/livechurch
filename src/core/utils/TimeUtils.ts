import { differenceInSeconds, parse } from "date-fns";

const TIME_FORMAT = "HH:mm";

const twoDigits = (value: number) => String(value).padStart(2, "0");

export const TimeUtils = {
  /** Seconds as a player clock: "3:07" or "1:02:09". */
  formatClock(totalSeconds: number): string {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = String(seconds % 60).padStart(2, "0");
    if (hours === 0) return `${minutes}:${secs}`;
    return `${hours}:${String(minutes).padStart(2, "0")}:${secs}`;
  },

  /** Seconds until today's "HH:mm" time; 0 when it has already passed or the time is invalid. */
  secondsUntil(time: string, now: Date): number {
    const target = parse(time, TIME_FORMAT, now);
    const seconds = differenceInSeconds(target, now, { roundingMethod: "ceil" });
    return Number.isNaN(seconds) ? 0 : Math.max(0, seconds);
  },

  /** Countdown: "05:07", or "01:05:07" when an hour or more remains. */
  formatCountdown(totalSeconds: number): string {
    const seconds = Math.max(0, Math.floor(totalSeconds));
    const hours = Math.floor(seconds / 3600);
    const minutes = twoDigits(Math.floor((seconds % 3600) / 60));
    const secs = twoDigits(seconds % 60);
    return hours === 0 ? `${minutes}:${secs}` : `${twoDigits(hours)}:${minutes}:${secs}`;
  },
};
