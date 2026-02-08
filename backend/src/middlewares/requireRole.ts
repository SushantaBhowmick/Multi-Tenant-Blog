// src/middlewares/requireRole.ts
import type { RequestHandler } from "express";
import { AppError } from "../utils/AppError.js";

export type Role = "owner" | "editor" | "writer" | "reader";

export const rank: Record<Role, number> = {
  owner: 4,
  editor: 3,
  writer: 2,
  reader: 1,
};

export function requireRole(minRole: Role): RequestHandler {
  return (req, _res, next) => {
    if (!(req as any).user) {
      return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));
    }

    if (!(req as any ).tenant) {
      return next(new AppError("Tenant context missing", 400, "TENANT_REQUIRED"));
    }

    const tenantRole:Role = (req as any).tenant.role

    if (rank[tenantRole] < rank[minRole]) {
      return next(new AppError("Forbidden", 403, "FORBIDDEN"));
    }

    next();
  };
}
