import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { tenantContext } from "../../middlewares/tenantConext.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { tagsController } from "./tags.controller.js";


export const  tagsRoutes = Router();
tagsRoutes.use(auth,tenantContext)

//writer can set tags (usually editorial action)
tagsRoutes.route('/posts/:postId/tags').put(requireRole("writer"), tagsController.setForPost)

// reader can view tags
tagsRoutes.route('/posts/:postId/tags').get(requireRole("writer"), tagsController.listForPost)