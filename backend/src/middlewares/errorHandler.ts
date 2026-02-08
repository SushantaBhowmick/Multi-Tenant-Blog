import type { ErrorRequestHandler } from "express";
import {ZodError} from "zod";
import { AppError } from "../utils/AppError.js";
import { logger } from "../logger/logger.js";


export const errorHandler:ErrorRequestHandler = (err,req,res,next)=>{

    // Zod validation error
    if(err instanceof ZodError){
        const details = err.issues.map((i)=>({path:i.path.join("."),message:i.message}));
        return res.status(400).json({
            ok:false,
            code:"VALIDATION_ERROR",
            message:"Invalid request data",
            details,
            requestId:(req as any).id,
        })
    }

    // PostgreSQL duplicate key error
    if((err as any)?.code ==="23505"){
        return res.status(409).json({
            ok:false,
            code:"DUPLICATE_RESOURCE",
            message:"Resource already exists",
            details:{constraint:(err as any).constraint},
            requestId:(req as any).id,
        })
    }

    // Our known errors
    if(err instanceof AppError){
        return res.status(err.statusCode).json({
            ok:false,
            code:err.code,
            message:err.message,
            details:err.details,
            requestId:(req as any).id,
        })
    }

    // Unknown errors
    logger.error({err,requestId:(req as any).id},"handled error");
    return res.status(500).json({
        ok:false,
        code:"INTERNAL_SERVER_ERROR",
        message:"Something went wrong",
        requestId:(req as any).id,
    })
}