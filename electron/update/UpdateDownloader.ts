import { once } from "node:events";
import fs from "node:fs";
import path from "node:path";
import { Readable, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";

export const UpdateDownloader = {
  /** Downloads `url` to `destination`. `onProgress` receives 0..1. */
  async download(url: string, destination: string, onProgress: (progress: number) => void) {
    const response = await fetch(url);
    if (!response.ok || !response.body) {
      throw new Error(`Download falhou com HTTP ${response.status}`);
    }

    const total = Number(response.headers.get("content-length")) || 0;
    let received = 0;
    const counter = new Transform({
      transform(chunk: Buffer, _encoding, callback) {
        received += chunk.length;
        if (total) onProgress(received / total);
        callback(null, chunk);
      },
    });

    fs.mkdirSync(path.dirname(destination), { recursive: true });
    const output = fs.createWriteStream(destination);
    await pipeline(Readable.fromWeb(response.body), counter, output);
    // On Windows the file can only be renamed after the handle is closed.
    if (!output.closed) await once(output, "close");
  },
};
