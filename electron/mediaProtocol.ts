import fs from "node:fs";
import path from "node:path";
import { Readable } from "node:stream";
import { protocol } from "electron";

/** Mesmo esquema usado por `MediaUtils.localFileUrl` no renderer. */
const MEDIA_SCHEME = "livechurch-media";

const VIDEO_MIME_TYPES: Record<string, string> = {
  ".mp4": "video/mp4",
  ".m4v": "video/mp4",
  ".webm": "video/webm",
  ".mov": "video/quicktime",
  ".ogv": "video/ogg",
  ".mkv": "video/x-matroska",
};

/** Must be called before the app is ready. */
export function registerMediaScheme() {
  protocol.registerSchemesAsPrivileged([
    {
      scheme: MEDIA_SCHEME,
      privileges: { standard: true, secure: true, stream: true, supportFetchAPI: true },
    },
  ]);
}

/** `[start, end]` range requested by the Range header, or null if absent/invalid. */
function parseRange(header: string | null, size: number): { start: number; end: number } | null {
  const match = /^bytes=(\d*)-(\d*)$/.exec(header ?? "");
  if (!match || (match[1] === "" && match[2] === "")) return null;

  const isSuffix = match[1] === "";
  const start = isSuffix ? Math.max(size - Number(match[2]), 0) : Number(match[1]);
  const end = isSuffix || match[2] === "" ? size - 1 : Math.min(Number(match[2]), size - 1);
  return start <= end && start < size ? { start, end } : null;
}

async function serveVideo(request: Request): Promise<Response> {
  const filePath = decodeURIComponent(new URL(request.url).pathname.slice(1));
  const mimeType = VIDEO_MIME_TYPES[path.extname(filePath).toLowerCase()];
  if (!path.isAbsolute(filePath) || !mimeType) {
    return new Response(null, { status: 403 });
  }

  let size: number;
  try {
    size = (await fs.promises.stat(filePath)).size;
  } catch (error) {
    console.error(`Vídeo indisponível: ${filePath}`, error);
    return new Response(null, { status: 404 });
  }

  const range = parseRange(request.headers.get("range"), size);
  const { start, end } = range ?? { start: 0, end: size - 1 };
  const headers: Record<string, string> = {
    "Content-Type": mimeType,
    "Content-Length": String(end - start + 1),
    "Accept-Ranges": "bytes",
  };
  if (range) headers["Content-Range"] = `bytes ${start}-${end}/${size}`;

  const body = Readable.toWeb(fs.createReadStream(filePath, { start, end }));
  return new Response(body, { status: range ? 206 : 200, headers });
}

export function handleMediaProtocol() {
  protocol.handle(MEDIA_SCHEME, serveVideo);
}
