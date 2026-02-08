import pg from "pg";

import { env } from "../config/env.js";
import { logger } from "../logger/logger.js";

const { Pool } = pg;

export const pool = new Pool({
  host: env.db.host,
  port: env.db.port,
  database: env.db.database,
  user: env.db.user,
  password: env.db.password,
  max: env.db.max,
  ssl: env.db.ssl ? { rejectUnauthorized: false } : undefined,
});

pool.on("error", (err) => {
  logger.error({err}, "PostgreSQL pool error");
  process.exit(-1);
});


export async function initDb():Promise<void>{
    // Test the connection
    const client = await pool.connect();
    try {
        const r = await client.query("SELECT 1 AS ok");
        logger.info({
            dbHost:env.db.host,
            dbName:env.db.database,
            ok:r.rows?.[0]?.ok === 1
        },"Database connected successfully");
    } finally {
        client.release();
    }
}