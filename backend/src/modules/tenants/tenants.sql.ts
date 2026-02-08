export const tenantsSql = {
  insertTernant: `
    INSERT INTO tenants (name,slug)
    VALUES ($1,$2)
    RETURNING id, name,slug,created_at`,
    
    insertMember:`
    INSERT INTO tenant_members (tenant_id,user_id,role)
    VALUES($1,$2,$3)
    ON CONFLICT (tenant_id,uesr_id) DO NOTHING`,

    listMyTenants:`
    SELECT t.id, t.name, t.slug, tm.role, t.created_at
    FROM tenant_members tm
    JOIN tenants t ON t.id=tm.tenant_id
    WHERE tm.user_id = $1
    ORDER BY t.created_at DESC`,

    getMemberShip:`
    SELECT tenant_id,user_id, role
    FROM tenant_members
    WHERE tenant_id = $1 AND user_id=$2
    LIMIT 1`
};
