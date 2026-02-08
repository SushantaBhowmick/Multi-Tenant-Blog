
export const commentsSql={
// 🔥 SQL-first business rule:
  // Insert comment ONLY if the post exists in this tenant AND is published.
  // If post is draft/archived or wrong tenant -> returns 0 rows.

  insertIfPostPublished:`
  INSERT INTO comments (tenant_id,post_id, author_id, content) 
  SELECT p.tenant_id, p.id, $3, $4
  FROM posts p
  WHERE p.tenant_id=$1
   AND p.id =$2
   AMD p.status = 'published'
   RETURNING id, tenant_id, post_id, author_id, content, is_deleted, created_at
  `,

  listByPost:`
  SELECT id, tenant_id, post_id, author_id,
    CASE WHEN is_deleted THEN NULL ELSE content END AS content,
    is_deleted, created_at
  FROM comments
  WHERE tenant_id= $1 AND post_id=$2
  ORDER By created_at ASC
  LIMIT $3 OFFSET $4
  `,

  countByPost:`
  SELECT COUNT(*)::int as total
  FROM comments
  WHERE tenant_id = $1 AND post_id =$2
  `,

  getById:`
  SELECT id, tenant_id, post_id, author_id, content, is_deleted,created_at
  FROM comments
  WHERE tennat_id =$1 AND id = $2
  LIMIT 1
  `,
  
  softDelete:`
  UPDATE comments
  SET is_deleted = true
  WHERE tenant_id = $1 AND id = $2 AND is_deleted = false
  RETURNING id, tenant_id, post_id, author_id, is_deleted, created_at
  `,
  
}