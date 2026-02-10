

export function up(pgm) {
    pgm.createTable("tenant_invites",{
        id:"bigserial",
        tenant_id:{
            type:"bigint",
            notNull:true,
            references:'"tenants"',
            onDelete:"cascade",
        },
        email:{type:"text",notNull:true},
        role:{type:"text",notNull:true,default:"reader"},

        token_hash:{type:"text",notNull:true,unique:true},
        inviteBY:{
            type:"bigint",
            notNull:true,
            references:'"users"',
            onDelete:"cascade",
        },

        revoked:{type:"boolean",notNull:true,default:false},
        accepted_at:{type:"timestamptz"},
        expires_at:{type:"timestamptz",notNull:true},
        created_at:{type:"timestamptz",notNull:true,default:pgm.func("now()")}
    });

    pgm.addConstraint("tenant_invites","tenant_invites_pkey",{primaryKey:"id"});
    pgm.addConstraint("tenant_invites","tenant_invites_role_check",{
        check:"role IN ('owner','reader','editor','writer')",
    });
    
    // helpful index for listing pending invites per tenant
    pgm.createIndex("tenant_invites",["tenant_id","revoked","expires_at"],{
        name:"idx_invites_tenant_revoked_exp",
    })

    //optional; avoid spamming same email repeatedly with active invite
    pgm.createIndex("tenant_invites",["tenant_id","email"],{
        name:"idx_invites_tenant_email"
    });
}

export function down(pgm) {
    pgm.dropTable("tenant_invites");
}