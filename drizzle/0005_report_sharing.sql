ALTER TABLE "reports" ADD COLUMN "sent_to" text;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "share_token" text;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "view_count" integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "first_viewed_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "reports" ADD COLUMN "last_viewed_at" timestamp with time zone;--> statement-breakpoint
CREATE UNIQUE INDEX "reports_share_token_idx" ON "reports" USING btree ("share_token");