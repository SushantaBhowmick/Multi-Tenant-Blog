import { Request, RequestHandler, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { createInviteSchema, listInviteSchema } from "./invites.validation.js";
import { invitesService } from "./invites.service.js";
import { created, ok } from "../../utils/respond.js";
import { pageMeta } from "../../utils/pagination.js";

export const invitesController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    if (!(req as any).user)
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    if (!(req as any).tenant)
      throw new AppError("Tenant required", 400, "TENANT_REQUIRED");

    const body = createInviteSchema.parse(req.body);

    const tenantId = (req as any).tenantId?.id;
    const userId = (req as any).user?.id;

    const out = invitesService.createInvite(tenantId, userId, body);

    return created(res, out);
  }) as RequestHandler,

  list: asyncHandler(async (req: Request, res: Response) => {
    if (!(req as any).user)
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    if (!(req as any).tenant)
      throw new AppError("Tenant required", 400, "TENANT_REQUIRED");

    const q = listInviteSchema.parse(req.query);

    const tenantId = (req as any).tenantId?.id;
    const userId = (req as any).user?.id;

    const result = invitesService.listPending(tenantId, q.page, q.limit);

    return ok(
      res,
      (await result).items,
      pageMeta((await result).page, (await result).limit, (await result).total),
    );
  }) as RequestHandler,

  revoke: asyncHandler(async (req: Request, res: Response) => {
    if (!(req as any).tenant)
      throw new AppError("Tenant required", 400, "TENANT_REQUIRED");
    const inviteId = Number(req.params.inviteId)
    if (!(inviteId))
      throw new AppError("Invalid invite id", 400, "BAD_REQUEST");

    const tenantId = (req as any).tenantId?.id;

    const result = await invitesService.revoke(tenantId,inviteId)

    return ok(res,result);
  }) as RequestHandler,

  accept: asyncHandler(async (req: Request, res: Response) => {
    if (!(req as any).user)
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");

    const token = String(req.params.token|| "").trim();

    const tenantId = (req as any).tenantId?.id;
    const userId = (req as any).user?.id;

    const result = await invitesService.accept(token,tenantId,userId)

    return ok(res,result);
  }) as RequestHandler,

};
