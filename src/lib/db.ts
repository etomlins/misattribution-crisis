import "server-only";
import postgres from "postgres";

// One shared connection pool per server instance.
const globalForDb = globalThis as unknown as { sql?: postgres.Sql };

export function getSql(): postgres.Sql {
  if (globalForDb.sql) return globalForDb.sql;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error("DATABASE_URL is not set. See README: Setting up the database.");
  }
  const isLocal = /@(localhost|127\.0\.0\.1)[:/]/.test(url);

  globalForDb.sql = postgres(url, {
    // Supabase's connection pooler (port 6543) doesn't support prepared statements.
    prepare: false,
    // Not needed (we don't use arrays of custom types) and it trips up the local test database.
    fetch_types: false,
    ssl: isLocal ? false : "require",
    // The local test database (npm run db:local) is a single in-process Postgres
    // that can't run two queries at once, so use one connection there.
    max: isLocal ? 1 : 3,
    idle_timeout: 20,
    onnotice: () => {},
  });
  return globalForDb.sql;
}
