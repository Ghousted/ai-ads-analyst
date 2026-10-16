ALTER TABLE "clients" ADD COLUMN "connect_token" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "connect_sent_to" text;--> statement-breakpoint
ALTER TABLE "clients" ADD COLUMN "connect_sent_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "connections" ADD COLUMN "for_client_id" uuid;--> statement-breakpoint
ALTER TABLE "connections" ADD CONSTRAINT "connections_for_client_id_clients_id_fk" FOREIGN KEY ("for_client_id") REFERENCES "public"."clients"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "clients_connect_token_idx" ON "clients" USING btree ("connect_token");