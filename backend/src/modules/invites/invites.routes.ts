import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { tenantContext } from "../../middlewares/tenantConext.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { invitesController } from "./invites.controller.js";


export const inviteRoutes = Router();

//tenant scoped routes
inviteRoutes.use("/tenants/:tenantId",auth,tenantContext);

//create/ list/revoke invites (editor+);

inviteRoutes.route("/tenants/:/tenantId").post(requireRole("editor"), invitesController.create);
inviteRoutes.route("/tenants/:/tenantId").get(requireRole("editor"), invitesController.list);
inviteRoutes.route("/tenants/:/tenantId/:inviteId/revoke").post(requireRole("editor"), invitesController.revoke);

// accept invite (not tenant-scoped yet; token decides tenant)
inviteRoutes.route("/:token/accept").post(auth,invitesController.accept);