ALTER TABLE "lip" ADD COLUMN "selected_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lip" ADD COLUMN "no_show_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lip" ADD COLUMN "live_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lip" ADD COLUMN "done_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "lip" ADD COLUMN "deleted_at" timestamp with time zone;