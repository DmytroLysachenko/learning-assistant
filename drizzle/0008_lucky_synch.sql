ALTER TABLE "users" ADD COLUMN "learning_languages" jsonb DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "interface_language" text DEFAULT 'en';