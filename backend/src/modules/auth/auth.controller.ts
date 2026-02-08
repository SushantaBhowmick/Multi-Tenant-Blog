import { Request, RequestHandler, Response } from "express";
import { env } from "../../config/env.js";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { loginSchema, registerSchema } from "./auth.validation.js";
import { authServices } from "./auth.service.js";


function commonCookieOpts(expires:Date){
  return {
    httpOnly:true,
    secure:env.auth.cookieSecure,
    samsite:"lax" as const,
    expires,
  }
}


function setRefreshTokenCookie(
  res: Response,
  refreshToken: string,
  expiresAt: Date,
) {
  res.cookie("refreshToken", refreshToken, {
    ...commonCookieOpts(expiresAt),
    path: "/auth",
  });
}

function setAccessTokenCookie(
  res: Response,
  accessToken: string,
  accessExpiresAt: Date,
) {
  res.cookie("accessToken", accessToken, {
    ...commonCookieOpts(accessExpiresAt),
    path: "/",
  });
}


function clearAuthCookies(res: any) {
  res.clearCookie("refreshToken", { path: "/auth", domain: env.auth.cookieDomain });
  res.clearCookie("accessToken", { path: "/", domain: env.auth.cookieDomain });
}

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const body = registerSchema.parse(req.body);
    const result = await authServices.register(body);

    setRefreshTokenCookie(
      res,
      result.refreshToken,
      result.refreshTokenExpiresAt,
    );
    setAccessTokenCookie(
      res,
      result.accessToken,
      result.accessExpiresAt,
    );

    return res.status(201).json({
      ok: true,
      user: result.user,
      accessToken: result.accessToken,
    });
  }) as RequestHandler,

  login: asyncHandler(async (req: Request, res: Response) => {
    const body = loginSchema.parse(req.body);
    const result = await authServices.login(body);


    setRefreshTokenCookie(
      res,
      result.refreshToken,
      result.refreshTokenExpiresAt,
    );
    setAccessTokenCookie(
      res,
      result.accessToken,
      result.accessExpiresAt,
    );

    return res.status(200).json({
      ok: true,
      user: result.user,
      accessToken: result.accessToken,
    });
  }) as RequestHandler,

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken as string;
    const result = await authServices.refresh(token);


    setRefreshTokenCookie(
      res,
      result.refreshToken,
      result.refreshTokenExpiresAt,
    );
    setAccessTokenCookie(
      res,
      result.accessToken,
      result.accessExpiresAt,
    );

    return res.status(200).json({
      ok: true,
      accessToken: result.accessToken,
    });
  }) as RequestHandler,

  profile: asyncHandler(async (req: Request, res: Response) => {

    const userId = (req as any).user.id;

    const user = await authServices.profile(userId);
 
    return res.json({ ok: true,user });
  }) as RequestHandler,

  logout: asyncHandler(async (req: Request, res: Response) => {
    const token = req.cookies.refreshToken as string;

    await authServices.logout(token);

    // clear cookie
  clearAuthCookies(res);

    return res.json({ ok: true });
  }) as RequestHandler,
};
