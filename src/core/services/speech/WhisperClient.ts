import { Locales } from "@/core/i18n/AppLocale";
import { I18n } from "@/core/i18n/I18n";

interface WorkerResponse {
  id: number;
  text?: string;
  error?: string;
}

interface PendingRequest {
  resolve: (text: string) => void;
  reject: (error: Error) => void;
}

let worker: Worker | null = null;
let nextId = 0;
const pending = new Map<number, PendingRequest>();

function getWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL("./whisper.worker.ts", import.meta.url), {
    type: "module",
  });
  worker.onmessage = ({ data }: MessageEvent<WorkerResponse>) => {
    const request = pending.get(data.id);
    pending.delete(data.id);
    if (data.error) request?.reject(new Error(data.error));
    else request?.resolve(data.text ?? "");
  };
  return worker;
}

/** Transcribes mono 16 kHz audio with Whisper running in a Web Worker. */
export const WhisperClient = {
  transcribe(audio: Float32Array, language = Locales.whisperLanguage(I18n.locale)): Promise<string> {
    return new Promise((resolve, reject) => {
      const id = nextId++;
      pending.set(id, { resolve, reject });
      getWorker().postMessage({ id, audio, language });
    });
  },
};
