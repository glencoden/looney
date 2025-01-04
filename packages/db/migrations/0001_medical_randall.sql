CREATE TABLE IF NOT EXISTS "permission" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" varchar(255) NOT NULL,
	"permission" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "guest" ALTER COLUMN "feedback" DROP NOT NULL;