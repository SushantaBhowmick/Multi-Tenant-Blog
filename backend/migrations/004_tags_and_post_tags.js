export async function up(pgm) {
  pgm.createTable("tags", {
    id: "bigserial",
    tenant_id: {
      type: "bigint",
      notNull: true,
      references: '"tenants"',
      onDelete: "cascade",
    },
    name: { type: "text", notNull: true },
    created_at: {
      type: "timestamptz",
      notNull: true,
      defualt: pgm.func("now()"),
    },
  });

  pgm.addConstraint("tags", "tags_pkey", { primaryKey: "id" });

  //normalize: unique per tanant (simple version)
  pgm.addConstraint("tags", "uq_tags_tenant_name", {
    unique: ["tenant_id", "name"],
  });

  //  juncation
  pgm.createTable("post_tags", {
    tenant_id: {
      type: "bigint",
      notNull: true,
      references: '"tenants"',
      onDelete: "cascade",
    },
    post_id: {
      type: "bigint",
      notNull: true,
      references: '"posts"',
      onDelete: "cascade",
    },
    tag_id: {
      type: "bigint",
      notNull: true,
      references: '"tags"',
      onDelete: "cascade",
    },
    created_at: {
      type: "timestamptz",
      notNull: true,
      defualt: pgm.func("now()"),
    },

    //prevent duplicates
  });
  pgm.addConstraint("post_tags", "post_tags_pkey", {
    primaryKey: ["tenant_id", "post_id", "tag_id"],
  });

  //indexs for fast filtering
  pgm.createIndex("post_tags", ["tenant_id", "tag_id", "post_id"], {
    name: "idx_post_tags_tenant_tag_post",
  });
  pgm.createIndex("tags", ["tenant_id", "name"], {
    name: "idx_tags_tenant_name",
  });
}


export async function down(pgm) {
    pgm.dropTable("post_tags");
    pgm.dropTable("tags")
}
