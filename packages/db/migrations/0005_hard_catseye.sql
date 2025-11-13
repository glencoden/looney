CREATE INDEX "idx_guests_internal" ON "guest" USING btree ("internal_id");--> statement-breakpoint
CREATE INDEX "idx_lips_session_sort" ON "lip" USING btree ("session_id","sort_number");--> statement-breakpoint
CREATE INDEX "idx_lips_session_status" ON "lip" USING btree ("session_id","status");--> statement-breakpoint
CREATE INDEX "idx_lips_status_live" ON "lip" USING btree ("status") WHERE status = 'live';--> statement-breakpoint
CREATE INDEX "idx_lips_guest" ON "lip" USING btree ("guest_id");