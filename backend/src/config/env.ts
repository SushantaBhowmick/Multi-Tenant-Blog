import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const v = process.env[name];
  if (!v) {
    throw new Error(`Environment variable ${name} is required`);
  }
  return v;
}

export const env = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  port: Number(process.env.PORT ?? 4000),

  db: {
    host: required("DB_HOST"),
    port: Number(process.env.DB_PORT ?? 5432),
    database: required("DB_NAME"),
    user: required("DB_USER"),
    password: required("DB_PASSWORD"),
    ssl: process.env.DB_SSL === "true",
    max: Number(process.env.DB_MAX_CLIENTS ?? 10),
  },
  auth: {
    jwtAccessSecret: required("JWT_ACCESS_SECRET"),
    jwtAccessTttl: "15m",
    refreshTtlDays: Number(process.env.JWT_REFRESH_TTL_DAYS ?? 30),
    
    cookieSecure: process.env.COOKIE_SECURE === "true",

    authRefreshPepper: required("REFRESH_TOKEN_PEPPER"),
    cookieDomain: process.env.COOKIE_DOMAIN || undefined,
  },
} as const;
