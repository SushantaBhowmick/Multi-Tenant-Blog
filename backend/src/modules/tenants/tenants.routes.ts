
import { Router } from "express";
import { auth } from "../../middlewares/auth.js";
import { tenantsController } from "./tenants.controller.js";

export const tenantsRoutes = Router();

tenantsRoutes.route("/").post(auth,tenantsController.create);
tenantsRoutes.route("/me").get(auth,tenantsController.myTenants);