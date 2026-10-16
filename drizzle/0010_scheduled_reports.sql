ALTER TABLE "agencies" ADD COLUMN "time_zone" text DEFAULT 'America/New_York' NOT NULL;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "drafted_for" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "scheduled_for" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "approved_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "approved_by" uuid;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_approved_by_users_id_fk" FOREIGN KEY ("approved_by") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "reports_client_scheduled_idx" ON "reports" USING btree ("client_id","scheduled_for");