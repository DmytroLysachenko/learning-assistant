ALTER TABLE "rus_vocabulary" RENAME TO "ru_vocabulary";--> statement-breakpoint
ALTER TABLE "user_rus_words" RENAME TO "user_ru_words";--> statement-breakpoint
ALTER TABLE "user_ru_words" DROP CONSTRAINT "user_rus_words_user_id_users_id_fk";
--> statement-breakpoint
ALTER TABLE "user_ru_words" DROP CONSTRAINT "user_rus_words_word_id_rus_vocabulary_id_fk";
--> statement-breakpoint
ALTER TABLE "translations" DROP CONSTRAINT "translations_word_id_2_rus_vocabulary_id_fk";
--> statement-breakpoint
ALTER TABLE "user_ru_words" ADD CONSTRAINT "user_ru_words_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_ru_words" ADD CONSTRAINT "user_ru_words_word_id_ru_vocabulary_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."ru_vocabulary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_word_id_2_ru_vocabulary_id_fk" FOREIGN KEY ("word_id_2") REFERENCES "public"."ru_vocabulary"("id") ON DELETE cascade ON UPDATE no action;