export const invitesSql = {
  createInvite: `
    INSERT INTO tenant_invites (tenant_id, email, role, token_hash, invited_by, expires_at)
    VALUES($1,$2,$3,$4,$5,$6)
    RETURNING id, tenant_id, email, role, revoked, accepted_at, expires_at, created_at
    `,

  listPending: `
    SELECT id, email, role, invited_by, expires_at, created_at
    FROM tenant_invites
    WHERE tenant_id = $1
    AND revoked = false
    AND accepted_at IS NULL
    AND expires_at > now()
    ORDER BY created_at DESC
    LIMIT $2 OFFSET $3
    `,

  countPending: `
  SELECT COUNT(*)::int AS total
  FROM tenant_invites
  WHERE tenant_id = $1
  AND revoked = false
    AND accepted_at IS NULL
    AND expires_at > now()
  `,

  findByTokenHash: `
    SELECT id, email, role, revoked, accepted_at, expires_at
    FROM tenant_invites
    WHERE token_hash = $1
    LIMIT 1
  `,

  markAccepted: `
  UPDATE tenant_invites
  SET accepted_at = now()
  WHERE id = $1 AND revoked = false AND accepted_at IS NULL AND expires_at>now()
  RETURNING id, tenant_id, email, role
  `,

  revokeById: `
  UPDATE tenant_invites
  SET revoked = true 
  WHERE tenant_id = $1 AND id = $2 AND revoked = false AND accepted_at IS NULL
  RETURNING id
  `,

  //membership upsert (join tenant)
  upsertMember: `
  INSERT INTO tenant_members (tenant_id, user_id, role)
  VALUES ($1,$2,$3)
  ON CONFLICT (tenant_id, user_id)
  DO UPDATE SET role = EXCLUDED.role
  RETURNING tenant_id, user_id, role
  `,
};
