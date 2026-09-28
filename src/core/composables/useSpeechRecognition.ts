import { onScopeDispose, ref } from "vue";
import { AudioRecorder } from "@/core/services/speech/AudioRecorder";
import { WhisperClient } from "@/core/services/speech/WhisperClient";
import { I18n } from "@/core/i18n/I18n";

export type SpeechStatus = "idle" | "listening" | "transcribing";

/**
 * Voice dictation: records the microphone and transcribes with local Whisper.
 * Clicking once starts recording; clicking again transcribes and calls `onTranscript`.
 */
export function useSpeechRecognition(onTranscript: (text: string) => void) {
  const status = ref<SpeechStatus>("idle");
  const error = ref("");
  let recorder: AudioRecorder | null = null;

  const start = async () => {
    error.value = "";
    recorder = new AudioRecorder();
    try {
      await recorder.start();
      status.value = "listening";
    } catch (cause) {
      console.warn("Falha ao acessar o microfone:", cause);
      error.value = I18n.t("core.errors.microphone");
      recorder = null;
    }
  };

  const stopAndTranscribe = async () => {
    if (!recorder) return;
    status.value = "transcribing";
    try {
      const audio = await recorder.stop();
      onTranscript(await WhisperClient.transcribe(audio));
    } catch (cause) {
      console.warn("Falha na transcrição:", cause);
      error.value = I18n.t("core.errors.transcribe");
    } finally {
      recorder = null;
      status.value = "idle";
    }
  };

  const toggle = () => {
    if (status.value === "idle") return start();
    if (status.value === "listening") return stopAndTranscribe();
  };

  onScopeDispose(() => {
    recorder?.stop().catch((cause) => console.warn("Falha ao encerrar gravação:", cause));
  });

  return { status, error, toggle };
}
