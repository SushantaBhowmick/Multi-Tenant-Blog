import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { tenantContext } from "../../middlewares/tenantConext.js";
import { requireRole } from "../../middlewares/requireRole.js";
import { membersController } from "./members.controller.js";


export const membersRoutes = Router();


membersRoutes.use("tenants/:tenantId",auth,tenantContext)

membersRoutes.route("/tenants/:tenantId").get(requireRole("editor"),membersController.list)

membersRoutes.route("/tenants/:tenantId/:userId").patch(requireRole("owner"),membersController.updateRole)
membersRoutes.route("/tenants/:tenantId/:userId").delete(requireRole("owner"),membersController.remove)