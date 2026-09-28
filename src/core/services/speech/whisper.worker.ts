import { pipeline } from "@huggingface/transformers";

const MODEL = "onnx-community/whisper-small";

interface TranscribeRequest {
  id: number;
  audio: Float32Array;
  language: string;
}

type Transcriber = (
  audio: Float32Array,
  options: { language: string; task: string },
) => Promise<{ text: string } | { text: string }[]>;

let transcriberPromise: Promise<Transcriber> | null = null;

function loadTranscriber(): Promise<Transcriber> {
  transcriberPromise ??= pipeline("automatic-speech-recognition", MODEL, {
    dtype: "q8",
    device: "wasm",
  }) as unknown as Promise<Transcriber>;
  return transcriberPromise;
}

self.onmessage = async ({ data }: MessageEvent<TranscribeRequest>) => {
  try {
    const transcriber = await loadTranscriber();
    const output = await transcriber(data.audio, {
      language: data.language,
      task: "transcribe",
    });
    const text = Array.isArray(output) ? output[0].text : output.text;
    self.postMessage({ id: data.id, text: text.trim() });
  } catch (error) {
    transcriberPromise = null;
    self.postMessage({ id: data.id, error: String(error) });
  }
};
