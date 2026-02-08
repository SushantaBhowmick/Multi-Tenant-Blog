export async function up(pgm) {
  pgm.createTable("tenants", {
    id: "bigserial",
    name: { type: "text", notNull: true },
    slug: { type: "text", notNull: true, unique: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
  pgm.addConstraint("tenants", "tenants_pkey", { primaryKey: "id" });

  pgm.createTable("users", {
    id: "bigserial",
    // tenant_id:{type:"bigint", notNull:true, references:"tenants(id)", onDelete:"cascade"},
    email: { type: "text", notNull: true, unique: true },
    password: { type: "text", notNull: true },
    display_name: { type: "text", notNull: true },
    is_active: { type: "boolean", notNull: true, default: true },
    role: { type: "text", notNull: true, default: "user" },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });
  pgm.addConstraint("users", "users_pkey", { primaryKey: "id" });

  pgm.createTable("tenant_members", {
    tenant_id: {
      type: "bigint",
      notNull: true,
      references: "tenants",
      onDelete: "cascade",
    },
    user_id: {
      type: "bigint",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    role: { type: "text", notNull: true },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
  });

  pgm.addConstraint("tenant_members", "tenant_members_pkey", {
    primaryKey: ["tenant_id", "user_id"],
  });
  pgm.addConstraint("tenant_members", "tenant_members_role_check", {
    check: "role IN ('owner','editor','writer','reader')",
  });

  pgm.createTable("refresh_tokens", {
    id: "bigserial",
    user_id: {
      type: "bigint",
      notNull: true,
      references: "users",
      onDelete: "cascade",
    },
    token_hash: { type: "text", notNull: true, unique: true },
    revoked: { type: "boolean", notNull: true, default: false },
    created_at: {
      type: "timestamp",
      notNull: true,
      default: pgm.func("current_timestamp"),
    },
    expires_at: { type: "timestamp", notNull: true },
  });

  pgm.addConstraint("refresh_tokens", "refresh_tokens_pkey", {
    primaryKey: "id",
  });

  pgm.createIndex("refresh_tokens", ["user_id", "expires_at"], {
    name: "idx_refresh_tokens_user_exp",
  });
}


export async function down(pgm){
    pgm.dropTable("refresh_tokens");
    pgm.dropTable("tenant_members");
    pgm.dropTable("users");
    pgm.dropTable("tenants");
}