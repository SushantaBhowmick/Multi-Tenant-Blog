export async function up(pgm) {
  // add tsvector column
  pgm.addColumn("posts", {
    search_tsv: { type: "tsvector" },
  });

  // backfill existing rows
  pgm.sql(`
    UPDATE posts
    SET search_tsv =
      to_tsvector('english', coalesce(title,'') || ' ' || coalesce(content,''));
  `);

  // ✅ trigger function MUST return trigger
  pgm.createFunction(
    "posts_search_tsv_update",
    [],
    { returns: "trigger", language: "plpgsql" },
    `
    BEGIN
      NEW.search_tsv :=
        to_tsvector('english', coalesce(NEW.title,'') || ' ' || coalesce(NEW.content,''));
      RETURN NEW;
    END;
    `
  );

  pgm.createTrigger("posts", "trg_posts_search_tsv", {
    when: "BEFORE",
    operation: ["INSERT", "UPDATE"],
    function: "posts_search_tsv_update",
    level: "ROW",
  });

  pgm.createIndex("posts", "search_tsv", {
    name: "idx_posts_search_tsv_gin",
    method: "gin",
  });

  pgm.createIndex("posts", ["tenant_id", "created_at"], {
    name: "idx_posts_tenant_created",
  });
}

export async function down(pgm) {
    pgm.dropIndex("posts","search_tsv",{name:"idx_posts_search_tsv_gin"});
    pgm.dropTrigger("posts","trg_posts_search_tsv");
    pgm.dropFunction("post_search_tsv_update",[]);
    pgm.dropColumn("posts","search_tsv");
    pgm.dropIndex("posts",["tenant_id","created_at"],{name:"idx_posts_tenant_created"})
}
