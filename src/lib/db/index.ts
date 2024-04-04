import { NodePgDatabase, drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import * as schema from "./schema";

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL!,
});
const db = drizzle(pool, { schema }) as NodePgDatabase<typeof schema>;

export default db;
