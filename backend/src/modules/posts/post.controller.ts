import { Request, RequestHandler, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { AppError } from "../../utils/AppError.js";
import {
  createPostSchema,
  listPostsSchema,
  updatePostSchema,
} from "./posts.validation.js";
import { postService } from "./posts.service.js";

export const postsController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    if (!(req as any).user)
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    if (!(req as any).tenant)
      throw new AppError("Tenant required", 400, "TENANT_REQUIRED");

    const tenantId = (req as any)?.tenant.id;
    const userId = (req as any)?.user.id;

    const body = createPostSchema.parse(req.body);
    const post = await postService.createDraft(body, tenantId, userId);
    res.status(201).json({
      ok: true,
      post,
    });
  }) as RequestHandler,

  list: asyncHandler(async (req: Request, res: Response) => {
    if (!(req as any).user)
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    if (!(req as any).tenant)
      throw new AppError("Tenant required", 400, "TENANT_REQUIRED");

    const tenantId = (req as any)?.tenant.id;

    const q = listPostsSchema.parse(req.query);
    const result = await postService.list(q, tenantId);
    res.status(200).json({ ok: true, ...result });
  }) as RequestHandler,

  getBySlug: asyncHandler(async (req: Request, res: Response) => {
    if (!(req as any).user)
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    if (!(req as any).tenant)
      throw new AppError("Tenant required", 400, "TENANT_REQUIRED");

    const tenantId = (req as any)?.tenant.id;
    const userId = (req as any)?.user.id;

    const slug = String(req.params.slug || "").trim();
    const post = await postService.getBySlug(tenantId, slug);
    if (!post) throw new AppError("Post not found", 404, "POST_NOT_FOUND");

    //Draft visibility: author or editor +

    if (post.status === "draft") {
      const role = (req as any)?.tenant.role;
      const isAuthor = Number(post.author_id) === userId;
      const canSee = role === "owner" || role === "editor" || isAuthor;
      if (canSee) throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    res.status(200).json({ ok: true, post });
  }) as RequestHandler,

  update: asyncHandler(async (req: Request, res: Response) => {
    if (!(req as any).user)
      throw new AppError("Unauthorized", 401, "UNAUTHORIZED");
    if (!(req as any).tenant)
      throw new AppError("Tenant required", 400, "TENANT_REQUIRED");

    const tenantId = (req as any)?.tenant.id;
    const userId = (req as any)?.user.id;
    const role = (req as any)?.tenant.role;

    const postId = Number(req.params.id);
    if (!postId) throw new AppError("Invalid post id", 400, "BAD_REQUEST");

    const body = updatePostSchema.parse(req.body);

    const post = await postService.updatePost(tenantId, postId, body, {
      userId,
      role,
    });

    res.status(200).json({ ok: true, post });
  }) as RequestHandler,

  publish: asyncHandler(async (req: Request, res: Response) => {
    if (!(req as any).tenant)
      throw new AppError("Tenant required", 400, "TENANT_REQUIRED");

    const tenantId = (req as any)?.tenant.id;

    const postId = Number(req.params.id);
    if (!postId) throw new AppError("Invalid post id", 400, "BAD_REQUEST");

    const post = await postService.publish(tenantId, postId);

    res.status(200).json({ ok: true, post });
  }) as RequestHandler,

  archive: asyncHandler(async (req: Request, res: Response) => {
    if (!(req as any).tenant)
      throw new AppError("Tenant required", 400, "TENANT_REQUIRED");

    const tenantId = (req as any)?.tenant.id;

    const postId = Number(req.params.id);
    if (!postId) throw new AppError("Invalid post id", 400, "BAD_REQUEST");

    const post = await postService.archive(tenantId, postId);

    res.status(200).json({ ok: true, post });
  }) as RequestHandler,
};
