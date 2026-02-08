export const postsSql = {
  insertDraft: `
    INSERT INTO posts (tenant_id,author_id,title,slug,contnet,status)
    VALUES ($1,$2,$3,$4,$5,'draft')
    RETURNING id, tenant_id, author_id, title, slug, status, created_at, updated_at
    `,

  listBase: `
    SELECT id, tenant_id, author_id, title, slug, status, published_at, created_at, updated_at
    FROM posts
    WHERE tenant_id=$1`,

  getBySlug:`
  SELECT id, tenant_id, author_id, title, slug, status, published_at, created_at, updated_at
  FROM posts
  WHERE tenant_id = $1 AND slug= $2
  LIMIT 1`,

  getById:`
  SELECT id, tenant_id, author_id, title, slug, status, published_at, created_at, updated_at
  FROM posts
  WHERE tenant_id = $1 AND id= $2
  LIMIT 1`,

  updaetdById:`
  UPDATE posts 
  SET 
  title = COALESCE($3,title),
  slug = COALESCE($4, slug),
  content = COALESCE($5, content),
  WHERE tenant_id= $1 AND id = $2
  RETURNING id, tenant_id, author_id, title, slug, content, status,published_at, created_at, updated_at
  `,

  publish:`
  UPDATE posts
  SET status='published', published_at = COALESCE(published_at,now())
  WHERE tenant_id = $1 AND id = $2 AND status = 'draft'
  RETURNING id, tenant_id, author_id, title, slug, content, status, published_at, created_at,updated_at
  `,

  archive:`
  UPDATE posts
  SET status = 'archived'
  WHERE tenant_id = $1 AND id = $2 AND status <> 'archived'
  RETURNINNG id, tenant_id, author_id, title, slug, status, published_at, created_at, updated_at
  `,
};
