import crypto from "node:crypto";
import fs from "node:fs";
import type { ReleaseType } from "../shared/ReleaseTypes";
import { KeyPair } from "./KeyPair";

interface SignedFields {
  platform: string;
  version: string;
  type: ReleaseType;
  sha256: string;
}

export const ReleaseSigner = {
  sha256File(filePath: string): string {
    return crypto.createHash("sha256").update(fs.readFileSync(filePath)).digest("hex");
  },

  /**
   * Signs `platform|version|type|sha256`, binding the file to the platform, version and type.
   * The app checks it in the same format (`electron/update/UpdateIntegrity.ts`).
   */
  sign({ platform, version, type, sha256 }: SignedFields): string {
    const payload = Buffer.from(`${platform}|${version}|${type}|${sha256}`);
    return crypto.sign(null, payload, KeyPair.loadPrivate()).toString("base64");
  },
};
