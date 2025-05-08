ALTER TABLE "achievements" ALTER COLUMN "type" SET DATA TYPE text;--> statement-breakpoint
DROP TYPE "public"."achievement_type";--> statement-breakpoint
CREATE TYPE "public"."achievement_type" AS ENUM('vocabulary', 'streak');--> statement-breakpoint
ALTER TABLE "achievements" ALTER COLUMN "type" SET DATA TYPE "public"."achievement_type" USING "type"::"public"."achievement_type";--> statement-breakpoint
ALTER TABLE "pl_vocabulary" DROP COLUMN "validated";--> statement-breakpoint
ALTER TABLE "ru_vocabulary" DROP COLUMN "validated";