import { pool } from "../../db/pool.js";
import { rank, Role } from "../../middlewares/requireRole.js";
import { AppError } from "../../utils/AppError.js";
import { getPagination } from "../../utils/pagination.js";
import { commentsSql } from "./comments.sql.js";

export const commentsService = {
  async createForPost(
    tenantId: number,
    postId: number,
    userId: number,
    content: string,
  ) {
    const r = await pool.query(commentsSql.insertIfPostPublished, [
      tenantId,
      postId,
      userId,
      content,
    ]);
    const row = r.rows[0];
    if (!row) {
      throw new AppError(
        "Cannot comment on this post",
        403,
        "COMMENT_NOT_FOUND",
      );
    }
    return row;
  },

  async listByPost(
    tenantId: number,
    postId: number,
    page: number,
    limit: number,
  ) {
    const { offset, page: p, limit: l } = getPagination(page, limit);

    const countRes = await pool.query(commentsSql.countByPost, [
      tenantId,
      postId,
    ]);

    const total = countRes.rows[0].total ?? 0;

    const dataRes = await pool.query(commentsSql.listByPost,[tenantId,postId,l,offset,])

    return {items:dataRes.rows,page:p,limit:l,total}
  },

  async softDelete(tenantId:number,commentId:number,actor:{userId:number;role:Role}){
    const r = await pool.query(commentsSql.getById,[tenantId,commentId]);
    
    const comment = r.rows[0];
    if(!comment) throw new AppError("Comment not found",404,"COMMENT_NOT_FOUND");

    const isAuthor = Number(comment.author_id)===actor.userId;
    const canDeleteAny = rank[actor.role]>=rank["editor"];

    if(!isAuthor && !canDeleteAny) throw new AppError("Forbidden",403,"FORBIDDEN");

    const del = await pool.query(commentsSql.softDelete,[tenantId,commentId])
    const row = del.rows[0];

    if(!row) return {alreadyDelete:true}

    return {deleted:true}
  }
};
