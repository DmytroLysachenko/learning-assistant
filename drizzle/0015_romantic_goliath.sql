ALTER TABLE "achievements" ALTER COLUMN "level" SET DEFAULT 0;--> statement-breakpoint
ALTER TABLE "achievements" ALTER COLUMN "level" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_polish_words" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_polish_words" ALTER COLUMN "correct_answers_count" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_ru_words" ALTER COLUMN "status" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "user_ru_words" ALTER COLUMN "correct_answers_count" SET NOT NULL;