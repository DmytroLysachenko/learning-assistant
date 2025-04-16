CREATE TABLE "user_words" (
	"user_id" uuid NOT NULL,
	"word_id" uuid NOT NULL,
	"added_at" timestamp DEFAULT now() NOT NULL,
	"mastered" boolean DEFAULT false NOT NULL
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
CREATE TABLE "words" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"russian" varchar(255) NOT NULL,
	"polish" varchar(255) NOT NULL,
	"russian_example" text,
	"polish_example" text,
	"difficulty" integer DEFAULT 1
);
--> statement-breakpoint
ALTER TABLE "user_words" ADD CONSTRAINT "user_words_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_words" ADD CONSTRAINT "user_words_word_id_words_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."words"("id") ON DELETE cascade ON UPDATE no action;