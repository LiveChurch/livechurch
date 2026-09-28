import { I18n } from "@/core/i18n/I18n";
const WHISPER_SAMPLE_RATE = 16000;

/** Records the microphone and returns the audio in the format Whisper expects. */
export class AudioRecorder {
  private stream: MediaStream | null = null;
  private recorder: MediaRecorder | null = null;
  private chunks: Blob[] = [];

  async start(): Promise<void> {
    this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    this.chunks = [];
    this.recorder = new MediaRecorder(this.stream);
    this.recorder.ondataavailable = (event) => this.chunks.push(event.data);
    this.recorder.start();
  }

  /** Stops recording and returns the mono audio at 16 kHz. */
  stop(): Promise<Float32Array> {
    return new Promise((resolve, reject) => {
      const recorder = this.recorder;
      if (!recorder) return reject(new Error(I18n.t("core.errors.recordingNotStarted")));
      recorder.onstop = async () => {
        this.stream?.getTracks().forEach((track) => track.stop());
        try {
          resolve(await this.decode(new Blob(this.chunks)));
        } catch (error) {
          reject(error);
        }
      };
      recorder.stop();
    });
  }

  private async decode(blob: Blob): Promise<Float32Array> {
    const context = new AudioContext({ sampleRate: WHISPER_SAMPLE_RATE });
    try {
      const buffer = await context.decodeAudioData(await blob.arrayBuffer());
      return buffer.getChannelData(0);
    } finally {
      await context.close();
    }
  }
}
