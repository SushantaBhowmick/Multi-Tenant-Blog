import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { tenantContext } from "../../middlewares/tenantConext.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { commentsController } from "./comments.controller.js";



export const commentsRoutes = Router();

//All comments are tenant-scoped
commentsRoutes.use(auth,tenantContext);

commentsRoutes.route("/posts/:postId/comments").get(requireRole("reader"),commentsController.list)
commentsRoutes.route("/posts/:postId/comments").post(requireRole("reader"),commentsController.create);



commentsRoutes.route("/:commentId").delete(requireRole("reader"),commentsController.remove)