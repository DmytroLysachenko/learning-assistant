CREATE TYPE "public"."english_word_type" AS ENUM('noun', 'verb', 'adjective', 'numeral', 'pronoun', 'adverb', 'preposition', 'particle', 'conjunction');--> statement-breakpoint
CREATE TABLE "en_vocabulary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" varchar(255) NOT NULL,
	"example" text,
	"type" "english_word_type" NOT NULL,
	"difficulty" "language_level" DEFAULT 'A1',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	"comment" text
);
--> statement-breakpoint
CREATE TABLE "user_english_words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"word_id" uuid NOT NULL,
	"status" "word_status" DEFAULT 'learning' NOT NULL,
	"correct_answers_count" integer DEFAULT 0 NOT NULL,
	"wrong_answers_count" integer DEFAULT 0 NOT NULL,
	"last_reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "user_english_words" ADD CONSTRAINT "user_english_words_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_english_words" ADD CONSTRAINT "user_english_words_word_id_en_vocabulary_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."en_vocabulary"("id") ON DELETE cascade ON UPDATE no action;