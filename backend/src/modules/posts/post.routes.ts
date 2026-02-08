import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { tenantContext } from "../../middlewares/tenantConext.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { postsController } from "./post.controller.js";



export const postRoutes = Router();

// all posts routes require auth + tenant context
postRoutes.use(auth,tenantContext);

// reader + can list and view
postRoutes.route('/').get(requireRole("reader"),postsController.list)
postRoutes.route('/:slug').get(requireRole("reader"),postsController.create);

//writer+ can create
postRoutes.route("/").post(requireRole("writer"),postsController.create);

// author or editor+ can edit(service checks author vs editor+)
postRoutes.route("/:id").patch(requireRole("writer"),postsController.create)

// editor+ can publish/archive
postRoutes.route("/:id/publish").post(requireRole("editor"),postsController.publish)
postRoutes.route("/:id/archive").post(requireRole("editor"),postsController.archive)