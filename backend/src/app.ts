import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";

import { httpLogger } from "./logger/httpLogger.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { notFound } from "./middlewares/notFound.js";
import morgan from "morgan";
import { logger } from "./logger/logger.js";
import { authRoutes } from "./modules/auth/auth.routes.js";
import { tenantsRoutes } from "./modules/tenants/tenants.routes.js";
import { postRoutes } from "./modules/posts/post.routes.js";
import { commentsRoutes } from "./modules/comments/comments.routes.js";

export function createApp() {
  const app = express();

  //  app.use(
  //   morgan("dev", {
  //     stream: {
  //       write: (message) => logger.info(message.trim()),
  //     },
  //   })
  // );
  // app.use(httpLogger);
  
  app.use(helmet());
  app.use(morgan("dev"));
  app.use(cors({ origin: true, credentials: true }));
  app.use(compression());
  app.use(express.json({ limit: "1mb" }));
  app.use(cookieParser());

  app.use(
    rateLimit({
      windowMs: 60 * 1000, // 1 minute
      max: 120,
      standardHeaders: true,
      legacyHeaders: false,
    }),
  );

  app.get("/health", (req, res) => {
    res.status(200).json({ ok: true });
  });

  //   Mount modules routes here
  app.use("/api/auth", authRoutes);
  app.use("/api/tenants", tenantsRoutes);
  app.use("/api/posts", postRoutes);
  app.use("/api/comments", commentsRoutes);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
