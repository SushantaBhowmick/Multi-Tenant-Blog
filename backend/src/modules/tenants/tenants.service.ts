import { PoolClient } from "pg"
import { withTx } from "../../db/tx.js"
import { tenantsSql } from "./tenants.sql.js"
import { pool } from "../../db/pool.js"




export const tenantsService = {
    async createTenant(input:{name:string,slug:string},userId:number){
        return withTx(async(client:PoolClient)=>{
            const t = await client.query(tenantsSql.insertTernant,[input.name.trim(), input.slug.trim()])
            console.log({t})
            console.log(t.rows)
            const tenant= t.rows[0];

            // creator becom owner
            await client.query(tenantsSql.insertMember,[tenant.id,userId,"owner"]);

            return tenant;
        })
    },

    async listMyTenants(userId:number){
        const r = await pool.query(tenantsSql.listMyTenants,[userId]);
        return r.rows;
    }
}