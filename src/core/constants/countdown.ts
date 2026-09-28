import type { CountdownFinishAction, CountdownTransition } from "@/core/types/playlist";
import { I18n } from "@/core/i18n/I18n";

/** Default time the countdown's final message stays on air before the automatic actions. */
export const DEFAULT_FINAL_MESSAGE_SECONDS = 5;

export const COUNTDOWN_TRANSITION_OPTIONS: { label: string; value: CountdownTransition }[] = [
  { get label() { return I18n.t("core.countdown.transitionNone"); }, value: "none" },
  { get label() { return I18n.t("core.countdown.transitionRollUp"); }, value: "roll-up" },
  { get label() { return I18n.t("core.countdown.transitionRollDown"); }, value: "roll-down" },
  { get label() { return I18n.t("core.countdown.transitionFade"); }, value: "fade" },
];

export const COUNTDOWN_FINISH_ACTION_OPTIONS: { label: string; value: CountdownFinishAction }[] = [
  { get label() { return I18n.t("core.countdown.finishNone"); }, value: "none" },
  { get label() { return I18n.t("core.countdown.finishNextItem"); }, value: "next-item" },
  { get label() { return I18n.t("core.countdown.finishWaitingScreen"); }, value: "waiting-screen" },
];
