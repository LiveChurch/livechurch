import crypto from "node:crypto";
import fs from "node:fs";
import type { UpdateRelease } from "./UpdateTypes";

export const UpdateIntegrity = {
  sha256File(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash("sha256");
      fs.createReadStream(filePath)
        .on("data", (chunk) => hash.update(chunk))
        .on("error", reject)
        .on("end", () => resolve(hash.digest("hex")));
    });
  },

  /**
   * Binds the file (hash) to the release's platform, version and type.
   * Same format used by `update-server/src/cli/ReleaseSigner.ts`.
   */
  signedPayload(release: UpdateRelease): Buffer {
    const { platform, version, type, sha256 } = release;
    return Buffer.from(`${platform}|${version}|${type}|${sha256}`);
  },

  isSignatureValid(release: UpdateRelease, publicKeyPem: string): boolean {
    const signature = Buffer.from(release.signature, "base64");
    return crypto.verify(null, UpdateIntegrity.signedPayload(release), publicKeyPem, signature);
  },
};
