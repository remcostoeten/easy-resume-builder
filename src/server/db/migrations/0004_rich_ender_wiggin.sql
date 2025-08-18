CREATE TYPE "public"."user_role" AS ENUM('user', 'admin');--> statement-breakpoint
CREATE TABLE "failed_auth_attempt" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"email" text,
	"reason" text,
	"ip_address" text,
	"user_agent" text,
	"country" text,
	"region" text,
	"city" text,
	"latitude" text,
	"longitude" text,
	"created_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" "user_role" NOT NULL;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "two_factor_enabled" boolean;--> statement-breakpoint
ALTER TABLE "failed_auth_attempt" ADD CONSTRAINT "failed_auth_attempt_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "bio";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "location";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "website";--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "admin";