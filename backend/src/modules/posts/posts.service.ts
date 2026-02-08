import { pool } from "../../db/pool.js";
import { rank, Role } from "../../middlewares/requireRole.js";
import { AppError } from "../../utils/AppError.js";
import { postsSql } from "./posts.sql.js";

export const postService = {
  async createDraft(
    input: { title: string; slug: string; content: string },
    tenantId: number,
    userId: number,
  ) {
    const r = await pool.query(postsSql.insertDraft, [
      tenantId,
      userId,
      input.title.trim(),
      input.slug.trim(),
      input.content,
    ]);
    return r.rows[0];
  },

  async list(
    params: {
      status?: string;
      authorId?: number;
      q?: string;
      page: number;
      limit: number;
      sort: "newest" | "oldest";
    },
    tenantId: number,
  ) {
    const values: any[] = [tenantId];
    let where = "";
    let i = 2;

    if (params.status) {
      where += ` AND status = $${i++}`;
      values.push(params.status);
    }
    if (params.authorId) {
      where += ` AND author_id = $${i++}`;
      values.push(params.authorId);
    }

    const offset = (params.page - 1) * params.limit;
    // count
    let countSql = `SELECT COUNT(*)::int AS total FROM posts WHERE tenant_id = $1${where}`;
    let countValues = [...values];

    // data query
    let dataSql = "";
    let dataValues: any[] = [];

    if (params.q) {
      where += ` AND search_tsv @@ websearch_to_tsquery('english',$${i++})`;
      values.push(params.q);

      countSql = `SELECT COUNT(*)::int AS total FROM posts WHERE tenant_id=$1${where}`;
      countValues = [...values];

      //data
      dataSql = `
      SELECT id, tenant_id, author_id, title, slug, status, published_at, created_at, updated_at
      ts_rank(search_tsv, websearch_to_tsquery('english',$${i - 1})) AS rank
      FROM posts
      WHERE tenant_id = $1${where}
      ORDER BY rank DESC, crated_at DESC
      LIMIT $${i++} OFFSET $${i++}
      `;
      dataValues = [...values, params.limit, offset];
    }else{

      //normal listing no FTS
       const orderBy = params.sort === "oldest" ? "created_at ASC" : "created_at DESC";
    dataSql = `
      SELECT id, tenant_id, author_id, title, slug, status, published_at, created_at, updated_at
      FROM posts
      WHERE tenant_id = $1${where}
      ORDER BY ${orderBy}
      LIMIT $${i++} OFFSET $${i++}
    `;
    dataValues = [...values, params.limit, offset];
    }

    const countRes = await pool.query(countSql,countValues);
    const total = countRes.rows[0]?.total??0;

    const dataRes = await pool.query(dataSql, dataValues);

    return {
      total,
      page: params.page,
      limit: params.limit,
      items: dataRes.rows,
    };
  },

  async getBySlug(tenantId: number, slug: string) {
    const r = await pool.query(postsSql.getBySlug, [tenantId, slug]);
    return r.rows[0] ?? null;
  },

  async getById(tenantId: number, id: number) {
    const r = await pool.query(postsSql.getById, [tenantId, id]);
    return r.rows[0] ?? null;
  },

  async updatePost(
    tenantId: number,
    postId: number,
    input: { title?: string; slug?: string; content?: string },
    actor: { userId: number; role: Role },
  ) {
    const post = await this.getById(tenantId, postId);
    if (!post) throw new AppError("Post not found", 404, "POST_NOT_FOUND");

    const canEditAny = rank[actor.role];
    const isAuthor = Number(post.author_id) === actor.userId;

    if (!canEditAny && !isAuthor)
      throw new AppError("ForBidden", 403, "FORBIDDEN");

    const r = await pool.query(postsSql.updaetdById, [
      tenantId,
      postId,
      input.title?.trim() ?? null,
      input.slug?.trim() ?? null,
      input.content ?? null,
    ]);
    return r.rows[0];
  },

  async publish(tenantId: number, postId: number) {
    const r = await pool.query(postsSql.publish, [tenantId, postId]);
    const row = r.rows[0];
    if (!row)
      throw new AppError(
        "Post not found or already published",
        409,
        "PUBLISH_CONFLICT",
      );
    return row;
  },

  async archive(tenantId: number, postId: number) {
    const r = await pool.query(postsSql.archive, [tenantId, postId]);
    const row = r.rows[0];

    if (!row)
      throw new AppError(
        "Post not found or already archived",
        409,
        "ARCHIVE_CONFLICT",
      );
    return row;
  },
};
