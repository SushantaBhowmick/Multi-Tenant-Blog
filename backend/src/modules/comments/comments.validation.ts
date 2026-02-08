import {z} from "zod";


export const createCommentSchema = z.object({
    content: z.string().min(1).max(2000)
});

export const listCommentsSchema = z.object({
    page: z.coerce.number().int().min(1).default(1),
    limit:z.coerce.number().int().min(1).max(50).default(10)
})