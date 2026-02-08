import { Router } from "express";
import { authController } from "./auth.controller.js";
import { auth } from "../../middlewares/auth.js";

export const authRoutes = Router();

authRoutes.route("/register").post( authController.register);
authRoutes.route("/login").post(authController.login);
authRoutes.route("/refresh").post(authController.refresh);
authRoutes.route("/profile").get(auth,authController.profile);
authRoutes.route("/logout").post(authController.logout);


