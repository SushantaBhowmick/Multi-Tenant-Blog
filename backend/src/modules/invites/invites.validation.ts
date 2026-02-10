import {z} from "zod"

export const createInviteSchema = z.object({
    email:z.string().email(),
    role:z.enum(["owner","editor","writer","reader"]).default("reader"),
    expiresInDays:z.coerce.number().int().min(1).max(30).default(7),
})

export const listInviteSchema = z.object({
    page:z.coerce.number().int().min(1).default(1),
    limit:z.coerce.number().int().min(1).max(50).default(10)
})