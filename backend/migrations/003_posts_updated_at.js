

export async function up(pgm) {
    //function
    pgm.createFunction(
        "set_updated_at",
        [],
        {
            returns:"trigger",
            language:"plpgsql",
        },
        `
        BEGIN
          NEW.updated_at=now();
          RETURN NEW;
        END;`
    );

    //trigger
    pgm.createTrigger("posts","trg_posts_updated_at",{
        when:"BEFORE",
        operation:"UPDATE",
        function:"set_updated_at",
        level:"ROW",
    });
}

export async function down(pgm) {
    pgm.dropTrigger("posts","trg_posts_updated_at");
    pgm.dropFuncation("set_updated_at",[])
}