
import { Request, RequestHandler, Response } from "express";
import { asyncHandler } from "../../utils/asyncHandler.js";
import { JWTPayload } from "../../middlewares/auth.js";
import { AppError } from "../../utils/AppError.js";
import { createTenantSchema } from "./tenants.validation.js";
import { tenantsService } from "./tenants.service.js";



export const tenantsController = {
    create:asyncHandler(async(req:Request,res:Response)=>{
        if(!(req as any)?.user) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
        }
        const body = createTenantSchema.parse(req.body);
        const tenant = await tenantsService.createTenant(body,(req as any).user.id);

        res.status(201).json({ok:true,tenant});
    })as RequestHandler,

    myTenants:asyncHandler(async(req:Request,res:Response)=>{
         if(!(req as any)?.user) {
            throw new AppError("Unauthorized", 401, "UNAUTHORIZED")
        }

        const items = await tenantsService.listMyTenants((req as any).user.id)
        res.json({ok:true,items});
    })as RequestHandler,
}