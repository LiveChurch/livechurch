import type { DownloadLead } from "@/core/types/lead";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 254;
const MAX_TAG_LENGTH = 40;

function readText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text.length > 0 && text.length <= maxLength ? text : null;
}

export const LeadValidator = {
  /** Returns the cleaned lead, or null when the request body is invalid. */
  parse(body: unknown): DownloadLead | null {
    if (typeof body !== "object" || body === null) return null;
    const input = body as Record<string, unknown>;

    const name = readText(input.name, MAX_NAME_LENGTH);
    const email = readText(input.email, MAX_EMAIL_LENGTH);
    const platform = readText(input.platform, MAX_TAG_LENGTH);
    const version = readText(input.version, MAX_TAG_LENGTH);

    if (!name || !email || !platform || !version) return null;
    if (!EMAIL_PATTERN.test(email)) return null;
    return { name, email, platform, version };
  },
};
