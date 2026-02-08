import { Request, RequestHandler, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { createCommentSchema, listCommentsSchema } from "./comments.validation.js";
import { commentsService } from "./comments.service.js";
import { created, ok } from "../../utils/respond.js";
import { pageMeta } from "../../utils/pagination.js";

//     create:asyncHandler(async(req:Request,res:Response)=>{

//     })

export const commentsController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    if (!(req as any).user)
      throw new AppError("Unahtorized", 401, "UNAUTHORIZED");
    if (!(req as any).tenant)
      throw new AppError("Tenant required", 401, "TENANT_REQUIRED");

    const postId = Number(req.params.postId);
    if (!postId) throw new AppError("Invalid post id", 400, "BAD_REQUEST");

    const body = createCommentSchema.parse(req.body);

    const tenantId = (req as any).tenant.id;
    const userId = (req as any).user.id;

    const comment = await commentsService.createForPost(
      tenantId,
      postId,
      userId,
      body.content,
    );
    return created(res, comment);
  }) as RequestHandler,

  list: asyncHandler(async (req: Request, res: Response) => {
     if (!(req as any).user)
      throw new AppError("Unahtorized", 401, "UNAUTHORIZED");
    if (!(req as any).tenant)
      throw new AppError("Tenant required", 401, "TENANT_REQUIRED");

    const postId = Number(req.params.postId);
    if (!postId) throw new AppError("Invalid post id", 400, "BAD_REQUEST");

    const body = createCommentSchema.parse(req.body);

    const tenantId = (req as any).tenant.id;

    const q = listCommentsSchema.parse(req.query);
    const result = await commentsService.listByPost(tenantId,postId,q.page,q.limit);
    return ok(res,result.items,pageMeta(result.page,result.limit,result.total))
  }) as RequestHandler,

    remove:asyncHandler(async(req:Request,res:Response)=>{
        if (!(req as any).user)
      throw new AppError("Unahtorized", 401, "UNAUTHORIZED");
    if (!(req as any).tenant)
      throw new AppError("Tenant required", 401, "TENANT_REQUIRED");

    const tenantId = (req as any).tenant.id;
    const userId = (req as any).user.id;
    const tenantRole = (req as any).tenant.role;


    const commentId = Number(req.params.commentId)
    
    const result = await commentsService.softDelete(tenantId,commentId,{
        userId,
        role:tenantRole
    });
    return ok(res,result)
    }) as RequestHandler,
};
