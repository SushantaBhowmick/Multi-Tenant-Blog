export DATABASE_URL="postgres://postgres:abcd1234@localhost:5432/multi_tenant_blog"

sudo -u postgres dropdb multi_tenant_blog
sudo -u postgres createdb multi_tenant_blog


pnpm exec node-pg-migrate up
