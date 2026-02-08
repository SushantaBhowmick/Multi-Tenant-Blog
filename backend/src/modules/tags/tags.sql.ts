

export const tagsSql = {
    upsertTag:`
    INSERT INTO tags (tenant_id,name)
    VALUES($1,$2)
    ON CONFLICT (tenant_id, name)
    DO UPDATE SET name = EXCLUDE.name
    RETURNING id, name
    `,

    clearPostTags:`
    DELETE FROM post_tags
    WHERE tenant_id = $1 AND post_id=$2
    `,

    attachTag:`
    INSERT INTO post_tags(tenant_id, post_id, tag_id)
    VALUES ($1,$2,$3)
    ON CONFLICT DO NOTHING
    `,

    listPostTags:`
    SELECT t.id, t.name,
    FROM post_tags pt
    JOIN tags t ON t.id = pt.tag_id
    WHERE pt.tenant_id = $1 AND pt.post_id = $2
    ORDER BY t.name ASC
    `,
    
}