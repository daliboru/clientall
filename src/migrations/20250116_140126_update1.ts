import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-vercel-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "users_rels_spaces_id_idx";
  ALTER TABLE "users" ALTER COLUMN "role" DROP DEFAULT;
  ALTER TABLE "notes" ALTER COLUMN "user_id" SET NOT NULL;
  ALTER TABLE "notes" ALTER COLUMN "space_id" SET NOT NULL;
  CREATE UNIQUE INDEX IF NOT EXISTS "users_rels_spaces_id_idx" ON "users_rels" USING btree ("spaces_id","path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP INDEX IF EXISTS "users_rels_spaces_id_idx";
  ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'client';
  ALTER TABLE "notes" ALTER COLUMN "user_id" DROP NOT NULL;
  ALTER TABLE "notes" ALTER COLUMN "space_id" DROP NOT NULL;
  CREATE INDEX IF NOT EXISTS "users_rels_spaces_id_idx" ON "users_rels" USING btree ("spaces_id");`)
}
