import {pinoHttp} from "pino-http";
import { randomUUID } from "crypto";
import { logger } from "./logger.js";

export const httpLogger = pinoHttp({
  logger,
  genReqId: (req) => (req.headers["x-request-id"] as string) || randomUUID(),

  // ✅ remove noisy fields
  serializers: {
    req(req) {
      return {
        id: (req as any).id,
        method: req.method,
        url: req.url,
        remoteAddress: req.socket?.remoteAddress,
      };
    },
    res(res) {
      return { statusCode: res.statusCode };
    },
  },

  // ✅ disable automatic "request completed" full log if you want
  // (we will log via customSuccessMessage + customLogLevel)
  customSuccessMessage: (req, res) => `${req.method} ${req.url} ${res.statusCode}`,
  customErrorMessage: (req, res, err) => `${req.method} ${req.url} ${res.statusCode} - ${err?.message}`,

  // ✅ quiet /health logs
  autoLogging: {
    ignore: (req) => req.url === "/health",
  },
});
