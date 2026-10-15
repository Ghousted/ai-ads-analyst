CREATE TABLE "client_flags" (
	"client_id" uuid PRIMARY KEY NOT NULL,
	"agency_id" uuid NOT NULL,
	"signature" text,
	"analysis" jsonb,
	"model" text,
	"analyzed_at" timestamp with time zone,
	"dismissed_keys" text
);
--> statement-breakpoint
ALTER TABLE "client_flags" ADD CONSTRAINT "client_flags_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_flags" ADD CONSTRAINT "client_flags_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_flags_agency_idx" ON "client_flags" USING btree ("agency_id");