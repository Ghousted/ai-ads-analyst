CREATE TABLE "alert_log" (
	"agency_id" uuid NOT NULL,
	"key" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "alert_log_agency_id_key_pk" PRIMARY KEY("agency_id","key")
);
--> statement-breakpoint
CREATE TABLE "notification_prefs" (
	"user_id" uuid NOT NULL,
	"agency_id" uuid NOT NULL,
	"prefs" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "notification_prefs_user_id_agency_id_pk" PRIMARY KEY("user_id","agency_id")
);
--> statement-breakpoint
ALTER TABLE "alert_log" ADD CONSTRAINT "alert_log_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_prefs" ADD CONSTRAINT "notification_prefs_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "notification_prefs" ADD CONSTRAINT "notification_prefs_agency_id_agencies_id_fk" FOREIGN KEY ("agency_id") REFERENCES "public"."agencies"("id") ON DELETE cascade ON UPDATE no action;