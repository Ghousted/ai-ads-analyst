CREATE TABLE "metric_rows" (
	"account_id" uuid NOT NULL,
	"day" date NOT NULL,
	"dim" text NOT NULL,
	"dim_value" text DEFAULT '' NOT NULL,
	"metric" text NOT NULL,
	"value" double precision NOT NULL,
	CONSTRAINT "metric_rows_account_id_day_dim_dim_value_metric_pk" PRIMARY KEY("account_id","day","dim","dim_value","metric")
);
--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "data_through" date;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "sync_error" text;--> statement-breakpoint
ALTER TABLE "accounts" ADD COLUMN "synced_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "metric_rows" ADD CONSTRAINT "metric_rows_account_id_accounts_id_fk" FOREIGN KEY ("account_id") REFERENCES "public"."accounts"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "metric_rows_account_day_idx" ON "metric_rows" USING btree ("account_id","day");