import { Request, RequestHandler, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { pool } from "../../db/pool.js";
import { memberSql } from "./members.sql.js";
import { ok } from "../../utils/respond.js";
import { z } from "zod";

export const roleSchema = z.object({
  role: z.enum(["owner", "reader", "editor", "writer"]),
});

export const membersController = {
  list: asyncHandler(async (req: Request, res: Response) => {
    if (!(req as any).tenant)
      throw new AppError("Tenant required", 400, "TENANT_REQUIRED");
    const tenantId = (req as any).tenantId?.id;

    const r = await pool.query(memberSql.listMembers, [tenantId]);

    return ok(res, r.rows);
  }) as RequestHandler,

  updateRole: asyncHandler(async (req: Request, res: Response) => {
    if (!(req as any).user)
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    if (!(req as any).tenant)
      throw new AppError("Tenant required", 400, "TENANT_REQUIRED");

    const body = roleSchema.parse(req.body);

    const tenantId = (req as any).tenantId?.id;
    const userId = (req as any).user?.id;

    const r = await pool.query(memberSql.updateRole, [
      tenantId,
      userId,
      body.role,
    ]);

    const row = r.rows[0];

    return ok(res, row);
  }) as RequestHandler,

  remove: asyncHandler(async (req: Request, res: Response) => {
    if (!(req as any).user)
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    if (!(req as any).tenant)
      throw new AppError("Tenant required", 400, "TENANT_REQUIRED");

    const tenantId = (req as any).tenantId?.id;
    const userId = (req as any).user?.id;

    const r = await pool.query(memberSql.removeMember, [tenantId, userId]);
    if (!r.rows[0])
      throw new AppError("Member not found", 404, "MEMBER_NOT_FOUND");
    const row = r.rows[0];

    return ok(res, {removed:true});
  }) as RequestHandler,
};
