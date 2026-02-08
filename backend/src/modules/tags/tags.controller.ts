import { Request, RequestHandler, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import { setTagsSchema } from "./tags.validation.js";
import { tagsService } from "./tags.service.js";
import { ok } from "../../utils/respond.js";


export const tagsController = {
 
    setForPost: asyncHandler(async(req:Request,res:Response)=>{
    if (!(req as any).user) throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    if (!(req as any).tenant) throw new AppError("Tenant required", 400, "TENANT_REQUIRED");

    const tenantId = (req as any).tenant.id;
    const postId = Number(req.params.postId);
    if(!postId) throw new AppError("Invalid post id",400,"BAD_REQUEST");

    const body = setTagsSchema.parse(req.body);
    const tags = await tagsService.setTagsForPost(tenantId,postId,body.tags)

    return ok(res,{postId,tags})

    })as RequestHandler,

    listForPost: asyncHandler(async(req:Request,res:Response)=>{
   if (!(req as any).user) throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    if (!(req as any).tenant) throw new AppError("Tenant required", 400, "TENANT_REQUIRED");

    const tenantId = (req as any).tenant.id;
    const postId = Number(req.params.postId);
    if(!postId) throw new AppError("Invalid post id",400,"BAD_REQUEST");

    const tags = await tagsService.listTagsForPost(tenantId,postId);
    return ok(res,{postId,tags});

    })as RequestHandler,
}