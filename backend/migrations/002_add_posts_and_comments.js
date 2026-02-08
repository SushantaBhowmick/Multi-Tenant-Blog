export async function up(pgm) {
  pgm.createTable("posts", {
    id: "bigserial",
    tenant_id: {
      type: "bigint",
      notNull: true,
      refernces: '"tenants"',
      onDelete: "cascade",
    },
    author_id: {
      type: "bigint",
      nutNull: true,
      refernces: '"users"',
    },
    title: { type: "text", notNull: true },
    slug: { type: "text", notNull: true },
    content: { type: "text", notNull: true },
    status: {
      type: "text",
      notNull: true,
      default: "draft",
    },
    published_at: { type: "timestamptz", default: null },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
    updated_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });

  pgm.addConstraint("posts", "posts_pkey", { primaryKey: "id" });
  pgm.addConstraint("posts", "posts_status_check", {
    check: "status IN ('draft','published','archived')",
  });
  pgm.addConstraint("posts", "uq_posts_tenant_slug", {
    unique: ["tenant_id", "slug"],
  });
  pgm.createIndex(
    "posts",
    ["tenant_id", "status", { name: "created_at", sort: "DESC" }],
    {
      name: "idx_posts_tenant_status_created",
    },
  );

  //comments
  pgm.createTable("comments", {
    id: "bigserial",
    tenant_id: {
      type: "bigint",
      notNull: true,
      refernces: '"tenants"',
      onDelete: "cascade",
    },
    post_id: {
      type: "bigint",
      notNull: true,
      refernces: '"posts"',
      onDelete: "cascade",
    },
    author_id: {
      type: "bigint",
      notnull: true,
      refernces: '"users"',
    },
    content: { type: "text", notNull: true },
    is_deleted: { type: "boolean", notnull: true, default: false },
    created_at: {
      type: "timestamptz",
      notNull: true,
      default: pgm.func("now()"),
    },
  });
  pgm.addConstraint("comments", "comments_pkey", { primaryKey: "id" });
  pgm.createIndex("comments", ["tenant_id", "post_id", "created_at"], {
    name: "idx_comments_tenant_post_created",
  });
}

export async function down(pgm) {
  pgm.dropTable("comments");
  pgm.dropTable("posts");
}
