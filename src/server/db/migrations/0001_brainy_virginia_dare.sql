CREATE TABLE "resume" (
	"id" serial PRIMARY KEY NOT NULL,
	"updated_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"deleted_at" timestamp,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"template" text DEFAULT 'professional' NOT NULL,
	"personal_info" jsonb,
	"work_experience" jsonb,
	"education" jsonb,
	"skills" jsonb,
	"sections" jsonb,
	"is_active" boolean DEFAULT true,
	"last_modified" timestamp DEFAULT now() NOT NULL
);
