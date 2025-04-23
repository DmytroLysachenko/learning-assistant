ALTER TABLE "pl_vocabulary" ADD COLUMN "updated_at" timestamp DEFAULT now();--> statement-breakpoint
ALTER TABLE "ru_vocabulary" ADD COLUMN "updated_at" timestamp DEFAULT now();