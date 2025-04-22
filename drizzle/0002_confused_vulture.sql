ALTER TABLE "polish_vocabulary" RENAME TO "pl_vocabulary";--> statement-breakpoint
ALTER TABLE "user_polish_words" DROP CONSTRAINT "user_polish_words_word_id_polish_vocabulary_id_fk";
--> statement-breakpoint
ALTER TABLE "translations" DROP CONSTRAINT "translations_word_id_1_polish_vocabulary_id_fk";
--> statement-breakpoint
ALTER TABLE "user_polish_words" ADD CONSTRAINT "user_polish_words_word_id_pl_vocabulary_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."pl_vocabulary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "translations" ADD CONSTRAINT "translations_word_id_1_pl_vocabulary_id_fk" FOREIGN KEY ("word_id_1") REFERENCES "public"."pl_vocabulary"("id") ON DELETE cascade ON UPDATE no action;