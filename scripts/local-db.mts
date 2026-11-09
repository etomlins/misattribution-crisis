// A real Postgres database that runs inside Node, for working on the site
// without Supabase. Data is kept in the .pglite folder; delete it to start fresh.
//
//   npm run db:local     (leave it running, then `npm run dev` in another terminal)
import { PGlite } from "@electric-sql/pglite";
import { PGLiteSocketServer } from "@electric-sql/pglite-socket";
import { setupDatabase } from "./setup.mts";

const port = Number(process.env.LOCAL_DB_PORT ?? 5433);
const url = `postgres://postgres:postgres@127.0.0.1:${port}/postgres`;

const db = await PGlite.create({ dataDir: process.env.LOCAL_DB_DIR ?? ".pglite" });
const server = new PGLiteSocketServer({ db, port, host: "127.0.0.1", maxConnections: 10 });
await server.start();

await setupDatabase(url);

console.log(`\nLocal database running at ${url}`);
console.log("Put that in .env.local as DATABASE_URL, then run `npm run dev`. Ctrl+C to stop.\n");

const stop = async () => {
  await server.stop();
  await db.close();
  process.exit(0);
};
process.on("SIGINT", stop);
process.on("SIGTERM", stop);
