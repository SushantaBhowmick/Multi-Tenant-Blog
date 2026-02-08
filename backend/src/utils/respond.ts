import { Response } from "express";


export function ok<T>(res:Response,data:T,meta?:Record<string,any>){
    return res.status(200).json({ok:true})
}

export function created<T>(res:Response,data:T,meta?:Record<string,any>){
    return res.status(201).json({ok:true,data,meta})
}