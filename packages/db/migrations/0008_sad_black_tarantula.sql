ALTER TABLE "guest" DROP CONSTRAINT IF EXISTS "guest_internal_id_permission_id_fk";--> statement-breakpoint
ALTER TABLE "guest" ALTER COLUMN "internal_id" SET DATA TYPE text;--> statement-breakpoint
UPDATE "guest" g SET "internal_id" = u."id" FROM "permission" p JOIN "user" u ON lower(trim(u."email")) = lower(trim(p."email")) WHERE g."internal_id" = p."id"::text;--> statement-breakpoint
DELETE FROM "lip" l USING "guest" g WHERE l."guest_id" = g."id" AND g."internal_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM "user" u WHERE u."id" = g."internal_id");--> statement-breakpoint
DELETE FROM "guest" g WHERE g."internal_id" IS NOT NULL AND NOT EXISTS (SELECT 1 FROM "user" u WHERE u."id" = g."internal_id");--> statement-breakpoint
ALTER TABLE "guest" ADD CONSTRAINT "guest_internal_id_user_id_fk" FOREIGN KEY ("internal_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "permission_role" text DEFAULT 'user' NOT NULL;--> statement-breakpoint
UPDATE "user" u SET "permission_role" = p."role" FROM "permission" p WHERE lower(trim(p."email")) = lower(trim(u."email")) AND p."role" IN ('admin', 'host');--> statement-breakpoint
ALTER TABLE "permission" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "permission" CASCADE;
