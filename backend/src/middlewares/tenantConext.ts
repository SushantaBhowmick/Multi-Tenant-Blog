import { RequestHandler } from "express";
import { AppError } from "../utils/AppError.js";
import { pool } from "../db/pool.js";
import { tenantsSql } from "../modules/tenants/tenants.sql.js";


export const tenantContext:RequestHandler= async(req,_res,next)=>{
    try {
        if(!(req as any).user) return next(new AppError("Unauthorized",401,"UNAUTHORIZED"));

        const rawTenantId = req.headers["x-tenant-id"];
        const tenantId = Number(Array.isArray(rawTenantId)? rawTenantId[0]: rawTenantId)
        if (!tenantId) return next(new AppError("Missing x-tenant-id header", 400, "TENANT_REQUIRED"));

        const m = await pool.query(tenantsSql.getMemberShip,[tenantId,(req as any).user.id])
        const membership = m.rows[0] as {role:"owner"|"editor"|"writer"|"reader"}|undefined;

        if (!membership) return next(new AppError("Forbidden (not a member of tenant)", 403, "TENANT_FORBIDDEN"));

        (req as any).tenant = {id:tenantId, role:membership.role}
    } catch (error) {
        next(error)
    }
}