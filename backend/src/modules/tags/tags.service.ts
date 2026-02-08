import { PoolClient } from "pg";
import { withTx } from "../../db/tx.js";
import { AppError } from "../../utils/AppError.js";
import { tagsSql } from "./tags.sql.js";


export const tagsService ={
    async setTagsForPost(tenantId:number,postId:number,tags:string[]){
        const normalized = Array.from(
            new Set(tags.map((t)=>t.trim().toLowerCase()).filter(Boolean))
        );

        return withTx(async(client:PoolClient)=>{
            const pr = await client.query(
                `SELECT id from posts where tenant_id= $1 AND id = $2 LIMIT 1`,[tenantId,postId]
            );

            if(!pr.rows[0]) throw new AppError("Post not found", 404, "POST_NOT_FOUND")

            //clear existing
             await client.query(tagsSql.clearPostTags,[tenantId,postId]);

             //upsert tags + attach
             for (const name of normalized){
                const tr = await client.query(tagsSql.upsertTag,[tenantId,name]);
                const tagId = tr.rows[0].id;
                await client.query(tagsSql.attachTag,[tenantId,postId,tagId])
             }

             //return final tags
             const out = await client.query(tagsSql.listPostTags,[tenantId,postId]);
             return out.rows;
        });
    },

    async listTagsForPost(tenantId:number,postId:number){
        //no tx needed 
        return (await (await import ("../../db/pool.js")).pool.query(tagsSql.listPostTags,[tenantId,postId])).rows;
    }
}