import { RequestHandler } from "express";



export const notFound:RequestHandler = (req,res)=>{
    res.status(404).json({
        ok:false,
        code:"NOT_FOUND",
        message:"Route not found",
        requestId:(req as any).id,
    })
}