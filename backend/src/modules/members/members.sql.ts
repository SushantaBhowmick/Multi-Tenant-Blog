export const memberSql = {
    listMembers:`
    SELECT tm.user_id, tm.role, tm.created_at,
    u.email, u.display_name
    FROM tenant_members tm
    JOIN users u ON u.id = tm.user_id
    WHERE tm.tenant_id = $1
    ORDER BY tm.creted_at ASC
    `,

    updateRole:`
    UPDATE tenant_membbers
    SET role = $3
    WHERE tenant_id = $1 AND user_id = $2
    RETURNING tenant_id, user_id, role
    `,

    removeMember:`
    DELETE FROM tenant_members
    WHERE tenant_id = $1 AND user_id = $2
    RETURNING tenant_id, user_id
    `,
};