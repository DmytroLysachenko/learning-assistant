-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
CREATE TYPE "public"."achievement_type" AS ENUM('vocabulary', 'streak', 'practice', 'high_score');--> statement-breakpoint
CREATE TYPE "public"."language_level" AS ENUM('A0', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2');--> statement-breakpoint
CREATE TYPE "public"."polish_word_type" AS ENUM('rzeczownik', 'czasownik', 'przymiotnik', 'liczebnik', 'zaimek', 'przysłówek', 'przyimek', 'partykuła', 'spójnik');--> statement-breakpoint
CREATE TYPE "public"."role" AS ENUM('basic', 'premium', 'admin', 'test');--> statement-breakpoint
CREATE TYPE "public"."russian_word_type" AS ENUM('существительное', 'глагол', 'прилагательное', 'числительное', 'местоимение', 'наречие', 'предлог', 'частица', 'союз');--> statement-breakpoint
CREATE TYPE "public"."word_status" AS ENUM('learning', 'reviewing', 'mastered');--> statement-breakpoint
CREATE TABLE "ru_vocabulary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" varchar(255) NOT NULL,
	"example" text,
	"type" "russian_word_type" NOT NULL,
	"difficulty" "language_level" DEFAULT 'A1',
	"created_at" timestamp DEFAULT now(),
	"comment" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "pl_vocabulary" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word" varchar(255) NOT NULL,
	"example" text,
	"type" "polish_word_type" NOT NULL,
	"difficulty" "language_level" DEFAULT 'A1',
	"created_at" timestamp DEFAULT now(),
	"comment" text,
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "user_achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"achievement_id" uuid NOT NULL,
	"achieved_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"image" text,
	"password_hash" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"learning_languages" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"interface_language" text DEFAULT 'ru' NOT NULL,
	"experience" integer DEFAULT 0 NOT NULL,
	"streak" integer DEFAULT 0 NOT NULL,
	"role" "role" DEFAULT 'basic' NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "achievements" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"type" "achievement_type" NOT NULL,
	"criteria" integer NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"level" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "pl_ru_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word_id_1" uuid NOT NULL,
	"word_id_2" uuid NOT NULL,
	"lastly_reviewed_at" timestamp
);
--> statement-breakpoint
CREATE TABLE "user_polish_words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"word_id" uuid NOT NULL,
	"status" "word_status" DEFAULT 'learning' NOT NULL,
	"correct_answers_count" integer DEFAULT 0 NOT NULL,
	"last_reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"wrong_answers_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_ru_words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"word_id" uuid NOT NULL,
	"status" "word_status" DEFAULT 'learning' NOT NULL,
	"correct_answers_count" integer DEFAULT 0 NOT NULL,
	"last_reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now(),
	"wrong_answers_count" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_achievements" ADD CONSTRAINT "user_achievements_achievement_id_achievements_id_fk" FOREIGN KEY ("achievement_id") REFERENCES "public"."achievements"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pl_ru_translations" ADD CONSTRAINT "pl_ru_translations_word_id_1_pl_vocabulary_id_fk" FOREIGN KEY ("word_id_1") REFERENCES "public"."pl_vocabulary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pl_ru_translations" ADD CONSTRAINT "pl_ru_translations_word_id_2_ru_vocabulary_id_fk" FOREIGN KEY ("word_id_2") REFERENCES "public"."ru_vocabulary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_polish_words" ADD CONSTRAINT "user_polish_words_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_polish_words" ADD CONSTRAINT "user_polish_words_word_id_pl_vocabulary_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."pl_vocabulary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_ru_words" ADD CONSTRAINT "user_ru_words_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_ru_words" ADD CONSTRAINT "user_ru_words_word_id_ru_vocabulary_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."ru_vocabulary"("id") ON DELETE cascade ON UPDATE no action;
*/