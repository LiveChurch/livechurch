import { Pool, type PoolConfig } from "pg";

// A single pool per process, even with `next dev` hot reload.
const globalForPool = globalThis as unknown as { leadsPool?: Pool };

/**
 * Managed databases (RDS etc.) require SSL. If the URL already carries `sslmode`, `pg` handles it;
 * otherwise we turn SSL on (without verifying the chain, since the RDS certificate does not ship with Node).
 * For a local Postgres without SSL, set DATABASE_SSL=false.
 */
function sslConfig(connectionString: string): PoolConfig["ssl"] {
  if (process.env.DATABASE_SSL === "false") return undefined;
  if (connectionString.includes("sslmode=")) return undefined;
  return { rejectUnauthorized: false };
}

export function getPool(): Pool {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error("DATABASE_URL não configurada. Veja .env.example.");
  }
  globalForPool.leadsPool ??= new Pool({ connectionString, max: 3, ssl: sslConfig(connectionString) });
  return globalForPool.leadsPool;
}
