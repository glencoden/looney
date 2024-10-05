CREATE TABLE IF NOT EXISTS "setlist_to_song" (
	"setlist_id" uuid NOT NULL,
	"song_id" uuid NOT NULL,
	CONSTRAINT "setlist_to_song_setlist_id_song_id_pk" PRIMARY KEY("setlist_id","song_id")
);
--> statement-breakpoint
ALTER TABLE "song" DROP CONSTRAINT "song_setlist_id_setlist_id_fk";
--> statement-breakpoint
ALTER TABLE "song" ADD COLUMN "artist" varchar(255) NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "setlist_to_song" ADD CONSTRAINT "setlist_to_song_setlist_id_setlist_id_fk" FOREIGN KEY ("setlist_id") REFERENCES "public"."setlist"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "setlist_to_song" ADD CONSTRAINT "setlist_to_song_song_id_song_id_fk" FOREIGN KEY ("song_id") REFERENCES "public"."song"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "song" DROP COLUMN IF EXISTS "setlist_id";