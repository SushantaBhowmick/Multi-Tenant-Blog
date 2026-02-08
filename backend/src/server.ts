// src/server.ts
import { createApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./logger/logger.js";
import { initDb } from "./db/pool.js";

async function main() {
  try {
    await initDb(); // ✅ logs DB connection
    const app = createApp();

    app.listen(env.port, () => {
      logger.info({ port: env.port }, "Server is running on port " + env.port);
    });
  } catch (err) {
    logger.error({ err }, "Failed to start server");
    process.exit(1);
  }
}

main();
