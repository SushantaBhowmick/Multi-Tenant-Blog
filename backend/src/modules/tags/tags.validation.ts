import {z} from "zod";


export const setTagsSchema = z.object({
    tags:z.array(z.string().min(1).max(40)).max(30),
})