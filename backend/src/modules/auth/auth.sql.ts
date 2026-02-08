export const authSql = {
  findUserByEmail: `SELECT id, email, password, display_name, is_active FROM users WHERE email = $1 LIMIT 1`,

  findUserById: `SELECT id, email, display_name, is_active FROM users WHERE id = $1 LIMIT 1`,

  insertUser: `INSERT INTO users (email, password, display_name)
    VALUES ($1,$2,$3)
    RETURNING id, email, display_name, created_at`,

  insertRefreshToken: `INSERT INTO refresh_tokens (user_id, token_hash, expires_at)
    VALUES ($1,$2,$3)
    RETURNING id, user_id, token_hash, expires_at, created_at`,

  findValidRefreshToken: `SELECT id, user_id, token_hash, expires_at, created_at
    FROM refresh_tokens
    WHERE token_hash = $1 AND revoked = false AND expires_at > NOW()
    LIMIT 1`,

  revokeRefreshTokenById: `UPDATE refresh_tokens
    set revoked = true
    WHERE id = $1`,
};
