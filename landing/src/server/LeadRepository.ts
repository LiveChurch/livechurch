import type { DownloadLead } from "@/core/types/lead";
import { getPool } from "./db";

const CREATE_TABLE = `
  create table if not exists download_leads (
    id bigint generated always as identity primary key,
    created_at timestamptz not null default now(),
    name text not null check (char_length(name) between 1 and 120),
    email text not null check (char_length(email) between 3 and 254),
    platform text not null,
    version text not null
  )
`;

// One request per email (case-insensitive) on each platform.
const CREATE_UNIQUE_INDEX = `
  create unique index if not exists download_leads_email_platform_key
    on download_leads (lower(email), platform)
`;

let tableReady: Promise<unknown> | null = null;

/** Creates the table and the index on the first write; if it fails, tries again on the next one. */
function ensureTable() {
  tableReady ??= getPool()
    .query(CREATE_TABLE)
    .then(() => getPool().query(CREATE_UNIQUE_INDEX))
    .catch((error) => {
      tableReady = null;
      throw error;
    });
  return tableReady;
}

export const LeadRepository = {
  /** Saves the request; if the email already asked for this platform, does not insert again. */
  async insert(lead: DownloadLead): Promise<void> {
    await ensureTable();
    await getPool().query(
      `insert into download_leads (name, email, platform, version)
       values ($1, $2, $3, $4)
       on conflict (lower(email), platform) do nothing`,
      [lead.name, lead.email, lead.platform, lead.version],
    );
  },
};
