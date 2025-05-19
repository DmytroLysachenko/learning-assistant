CREATE TYPE "public"."role" AS ENUM('basic', 'premium', 'admin', 'test');--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "role" "role" DEFAULT 'basic' NOT NULL;