import jwt, { type Secret, type SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.js";
import { createHash, randomBytes } from "crypto";
import { PoolClient } from "pg";
import bcrypt from "bcrypt";
import { authSql } from "./auth.sql.js";
import { pool } from "../../db/pool.js";
import { withTx } from "../../db/tx.js";
import { AppError } from "../../utils/AppError.js";
import ms from "ms";

type PublicUser = {
  id: number;
  email: string;
  displayName: string;
  createdAt: Date;
};

function signAccessToken(user: PublicUser): string {
  const secret: Secret = env.auth.jwtAccessSecret;
  const options: SignOptions = {
    expiresIn: env.auth.jwtAccessTttl,
  };
  return jwt.sign(
    { sub: String(user.id), email: user.email, name: user.displayName },
    secret,
    options,
  );
}

function accessExpiresAt(): Date {
  const ttlMs = ms(env.auth.jwtAccessTttl); // '15m' → 900000
  return new Date(Date.now() + ttlMs);
}
function makeRefreshToken(): string {
  return randomBytes(48).toString("base64url");
}

// (env as any).authRefreshPepper = () =>
//   process.env.REFRESH_TOKEN_PEPPER || "dev-paper";

function hashRefreshToken(token: string): string {
  // DB should never store raw tokens
  return createHash("sha256")
    .update(token + env.auth.authRefreshPepper)
    .digest("hex");
}

function refreshExpiresAt(): Date {
  const days = env.auth.refreshTtlDays;
  return new Date(Date.now() + days * 24 * 60 * 60 * 1000);
}

async function insertRefreshTokenTx(client: PoolClient, userId: number) {
  const raw = makeRefreshToken();
  const hashed = hashRefreshToken(raw);
  const expiresAt = refreshExpiresAt();

  await client.query(authSql.insertRefreshToken, [userId, hashed, expiresAt]);

  return { refreshToken: raw, refreshTokenHash: hashed, expiresAt };
}

export const authServices = {
  async register(input: {
    email: string;
    password: string;
    displayName: string;
  }) {
    const email = input.email.toLowerCase();
    const passwordHash = await bcrypt.hash(input.password, 12);

    try {
      const r = await pool.query(authSql.insertUser, [
        email,
        passwordHash,
        input.displayName.trim(),
      ]);
      const user = r.rows[0] as {
        id: number;
        email: string;
        display_name: string;
      };

      const accessToken = signAccessToken({
        id: user.id,
        email: user.email,
        displayName: user.display_name,
        createdAt: new Date(),
      });

      // create refresh token
      const { refreshToken, expiresAt } = await withTx(async (client) => {
        return insertRefreshTokenTx(client, user.id);
      });

      return {
        user: {
          id: user.id,
          email: user.email,
          displayName: user.display_name,
        },
        accessToken,
        accessExpiresAt: accessExpiresAt(),
        refreshToken,
        refreshTokenExpiresAt: expiresAt,
      };
    } catch (error) {
      throw error;
    }
  },

  async login(input: { email: string; password: string }) {
    const email = input.email.toLowerCase().trim();
    const r = await pool.query(authSql.findUserByEmail, [email]);
    const user = r.rows?.[0] as any;
    if (!user) {
      throw new AppError(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    const ok = await bcrypt.compare(input.password, user.password);
    if (!ok) {
      throw new AppError(
        "Invalid email or password",
        401,
        "INVALID_CREDENTIALS",
      );
    }

    if (!user.is_active) {
      throw new AppError("User account is inactive", 403, "USER_INACTIVE");
    }
    const accessToken = signAccessToken({
      id: user.id,
      email: user.email,
      displayName: user.display_name,
      createdAt: new Date(),
    });

    const { refreshToken, expiresAt } = await withTx(async (client) => {
      return insertRefreshTokenTx(client, user.id);
    });

    return {
      user: { id: user.id, email: user.email, displayName: user.display_name },
      accessToken,
      accessExpiresAt: accessExpiresAt(),
      refreshToken,
      refreshTokenExpiresAt: expiresAt,
    };
  },

  async refresh(rawRefreshToken: string) {
    if (!rawRefreshToken) {
      throw new AppError(
        "Refresh token is required",
        400,
        "REFRESH_TOKEN_REQUIRED",
      );
    }
    const tokenHash = createHash("sha256")
      .update(
        rawRefreshToken + (process.env.REFRESH_TOKEN_PEPPER || "dev-paper"),
      )
      .digest("hex");

    //Rotationmust be automic
    return withTx(async (client) => {
      const found = await client.query(authSql.findValidRefreshToken, [
        tokenHash,
      ]);
      const row = found.rows[0] as
        | { user_id: number; expires_at: Date }
        | undefined;

      if (!row) {
        throw new AppError(
          "Invalid or expired refresh token",
          401,
          "INVALID_REFRESH_TOKEN",
        );
      }
      // revoke old token
      await client.query(authSql.revokeRefreshTokenById, [row.user_id]);

      // issue new tokens
      const issued = await insertRefreshTokenTx(client, row.user_id);

      //fetch user for token payload
      const ur = await client.query(
        `SELECT id, email, display_name FROM users WHERE id = $1`,
        [row.user_id],
      );
      const u = ur.rows[0];
      if (!u) {
        throw new AppError("User not found", 500, "USER_NOT_FOUND");
      }

      const accessToken = signAccessToken({
        id: u.id,
        email: u.email,
        displayName: u.display_name,
        createdAt: new Date(),
      });

      return {
        accessToken,
        accessExpiresAt: accessExpiresAt(),
        refreshToken: issued.refreshToken,
        refreshTokenExpiresAt: issued.expiresAt,
      };
    });
  },

  async logout(rawRefreshToken: string) {
    if (!rawRefreshToken) return;

    const tokenHash = createHash("sha256")
      .update(
        rawRefreshToken + (process.env.REFRESH_TOKEN_PEPPER || "dev-paper"),
      )
      .digest("hex");

    await pool.query(
      `UPDATE refresh_tokens SET revoked = true WHERE token_hash = $1`,
      [tokenHash],
    );
  },

  async profile(userId: string) {
    const query = `SELECT * FROM users WHERE id = $1`;
    const r = await pool.query(authSql.findUserById, [userId]);
    const user = r.rows[0];
    return user;
  },
};
