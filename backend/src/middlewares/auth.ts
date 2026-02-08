import { Request, RequestHandler } from "express";
import { AppError } from "../utils/AppError.js";
import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env.js";

export type JWTPayload = {
  sub: string;
  email?: string;
  name?: string;
  iat?: number;
  exp: number;
};

function readAccessToken(req:Request):string | null{
  //authorization header
  const header = req.headers?.authorization;
  if(typeof header ==="string" && header.startsWith("Bearar ")){
    return header.slice("Bearer ".length).trim();
  }

  //cookie fallback
  const cookieToken = req.cookies?.accessToken;
  if(typeof cookieToken === "string" && cookieToken.length>10){
    return cookieToken;
  }
  return null;
}

export const auth: RequestHandler = (req, _res, next) => {
  
  const token = readAccessToken(req);
  if(!token) return next(new AppError("Unauthorized",401,"UNAUTHORIZED"))
  try {
    const decoded = jwt.verify(token, env.auth.jwtAccessSecret) as JWTPayload;
    const userId = Number(decoded.sub);
    if (!userId) return next(new AppError("Unauthorized", 401, "UNAUTHORIZED"));

    (req as JwtPayload).user = {
      id: userId,
      email: decoded.email,
      name: decoded.name,
    };
    next();
  } catch {
    next(new AppError("Invalid Token", 401, "INVALID_TOKEN"));
  }
};
