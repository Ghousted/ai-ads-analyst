CREATE TYPE "public"."goal_type" AS ENUM('cpl', 'leads', 'conv', 'budget');--> statement-breakpoint
CREATE TABLE "client_goals" (
	"client_id" uuid NOT NULL,
	"agency_id" uuid NOT NULL,
	"type" "goal_type" NOT NULL,
	"target" double precision NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "client_goals_client_id_type_pk" PRIMARY KEY("client_id","type")
);
--> statement-breakpoint
ALTER TABLE "client_goals" ADD CONSTRAINT "client_goals_client_id_clients_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."clients"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "client_goals" ADD CONSTRAINT "client_goals_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "client_goals_agency_idx" ON "client_goals" USING btree ("agency_id");