
import { createHash, randomBytes } from "crypto";
import { Role } from "../../middlewares/requireRole.js";
import { pool } from "../../db/pool.js";
import { invitesSql } from "./invites.sql.js";
import { AppError } from "../../utils/AppError.js";
import { withTx } from "../../db/tx.js";
import { PoolClient } from "pg";



export function makeInviteToken():string{
    return randomBytes(32).toString("base64url")
}

export function hashInviteToken(token:string):string{
    const pepper = process.env.INVITE_TOKEN_PEPPER || "dev-invite-pepper";
    return createHash("sha256").update(token+pepper).digest("hex")
}

export function expiresAtFromDays (days:number):Date{
    return new Date(Date.now()+ days * 24 * 60 * 60 * 1000)
}


export const invitesService={
    async createInvite(tenantId:number,actorUserId:number,input:{
        email:string,role:Role,expiresInDays:number
    }){

        const token = makeInviteToken()
        const tokenHash = hashInviteToken(token)

        const exp = expiresAtFromDays(input.expiresInDays)

        //email normalize
        const email = input.email.toLowerCase().trim();

        try {
            const r = await pool.query(invitesSql.createInvite,[tenantId,email,input.role,tokenHash,actorUserId,exp])

            return {
                invite:r.rows[0],
                token,
            }
        } catch (error) {
            throw error;
        }
    },

    async listPending(tenantId:number, page:number,limit:number){
        const offset = (page -1) * limit;
        const c = await pool.query(invitesSql.countPending,[tenantId]);
        const total = c.rows[0]?.total ?? 0;

        const r = pool.query(invitesSql.listPending,[tenantId,limit,offset]);

        return {items:(await r).rows, total, page,limit};
        
    },

    async revoke(tenantId:number,inviteId:number){
        const r = await pool.query(invitesSql.revokeById,[tenantId,inviteId]);
        if(!r.rows[0]) throw new AppError("Invite not found or cannot revoke",404, "INVITE_NOT_FOUND");
        return {revoked:true}
    },

    async accept(token:string,actorUserId:number,actorEmail?:string){
        if(!token) throw new AppError("Missing invite token",400,"BAD_REQUEST")
        
        const tokenHash = hashInviteToken(token);

        return withTx(async(client:PoolClient)=>{
            const ir = await client.query(invitesSql.findByTokenHash,[tokenHash]);
            const inv = ir.rows[0];

            if(!inv)  throw new AppError("Invite Invalid",404,"INVITE_INVALID")
            if(inv.revoked)  throw new AppError("Invite revoked",410,"INVITE_REVOKED")
            if(inv.accepted_at)  throw new AppError("Invite already used",409,"INVITE_USED")
            if(new Date(inv.expires_at).getTime()<=Date.now())  throw new AppError("Invite expired",409,"INVITE_EXPIRED")

            //optional security: if invite is email-bound, ensure actor email matches invite email
              if (actorEmail && String(inv.email).toLowerCase() !== actorEmail.toLowerCase()) {
                    throw new AppError("Invite email does not match your account", 403, "INVITE_EMAIL_MISMATCH");
                 }

            //mark accepeted (guarded)
            const accepeted = await client.query(invitesSql.markAccepted,[inv.id]);
            const row = accepeted.rows[0];
            if(!row)  throw new AppError("Invite cannot be accepted",409,"INVITE_CONFLICT")

            //add member
            await client.query(invitesSql.upsertMember,[row.tenan_id, actorUserId, row.role])
            return {joined:true,tenanId:row.tenan_id,role:row.role}

        })
    }
}