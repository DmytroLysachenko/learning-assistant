CREATE TYPE "public"."language_level" AS ENUM('A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2');--> statement-breakpoint
CREATE TYPE "public"."word_status" AS ENUM('learning', 'reviewing', 'mastered');--> statement-breakpoint
CREATE TYPE "public"."polish_word_type" AS ENUM('rzeczownik', 'czasownik', 'przymiotnik', 'liczebnik', 'zaimek', 'przysłówek', 'przyimek', 'partykuła');--> statement-breakpoint
CREATE TYPE "public"."russian_word_type" AS ENUM('существительное', 'глагол', 'прилагательное', 'числительное', 'местоимение', 'наречие', 'предлог', 'частица');--> statement-breakpoint
CREATE TABLE "polish_vocabulary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" varchar(255) NOT NULL,
	"example" text,
	"type" "polish_word_type" NOT NULL,
	"difficulty" "language_level" DEFAULT 'A1',
	"created_at" timestamp DEFAULT now(),
	"comment" text
);
--> statement-breakpoint
CREATE TABLE "user_polish_words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"word_id" uuid NOT NULL,
	"status" "word_status" DEFAULT 'learning',
	"correct_answers_count" integer DEFAULT 0,
	"last_reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "rus_vocabulary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" varchar(255) NOT NULL,
	"example" text,
	"type" "russian_word_type" NOT NULL,
	"difficulty" "language_level" DEFAULT 'A1',
	"created_at" timestamp DEFAULT now(),
	"comment" text
);
--> statement-breakpoint
CREATE TABLE "user_rus_words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"word_id" uuid NOT NULL,
	"status" "word_status" DEFAULT 'learning',
	"correct_answers_count" integer DEFAULT 0,
	"last_reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"image" text,
	"password_hash" text,
	"provider" text DEFAULT 'credentials',
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now(),
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word_id_1" uuid NOT NULL,
	"word_id_2" uuid NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_polish_words" ADD CONSTRAINT "user_polish_words_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_polish_words" ADD CONSTRAINT "user_polish_words_word_id_polish_vocabulary_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."polish_vocabulary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_rus_words" ADD CONSTRAINT "user_rus_words_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_rus_words" ADD CONSTRAINT "user_rus_words_word_id_rus_vocabulary_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."rus_vocabulary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_word_id_1_polish_vocabulary_id_fk" FOREIGN KEY ("word_id_1") REFERENCES "public"."polish_vocabulary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_word_id_2_rus_vocabulary_id_fk" FOREIGN KEY ("word_id_2") REFERENCES "public"."rus_vocabulary"("id") ON DELETE cascade ON UPDATE no action;