import { z } from "zod";

export const createPostSchema = z.object({
  title: z.string().min(3).max(200),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "slug must be kebab-case"),
  content: z.string().min(1),
});

export const updatePostSchema = z.object({
  title: z.string().min(3).max(200).optional(),
  slug: z.string().min(2).max(120).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/).optional(),
  content: z.string().min(1).optional(),
});

export const listPostsSchema = z.object({
  status: z.enum(["draft", "published", "archived"]).optional(),
  authorId: z.coerce.number().int().positive().optional(),
  q: z.string().min(1).max(100).optional(), // search in title (simple)
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(50).default(10),
  sort: z.enum(["newest", "oldest"]).default("newest"),
});
