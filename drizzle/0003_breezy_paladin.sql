ALTER TABLE "translations" RENAME TO "pl_ru_translations";--> statement-breakpoint
ALTER TABLE "pl_ru_translations" DROP CONSTRAINT "translations_word_id_1_pl_vocabulary_id_fk";
--> statement-breakpoint
ALTER TABLE "pl_ru_translations" DROP CONSTRAINT "translations_word_id_2_ru_vocabulary_id_fk";
--> statement-breakpoint
ALTER TABLE "pl_ru_translations" ADD CONSTRAINT "pl_ru_translations_word_id_1_pl_vocabulary_id_fk" FOREIGN KEY ("word_id_1") REFERENCES "public"."pl_vocabulary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pl_ru_translations" ADD CONSTRAINT "pl_ru_translations_word_id_2_ru_vocabulary_id_fk" FOREIGN KEY ("word_id_2") REFERENCES "public"."ru_vocabulary"("id") ON DELETE cascade ON UPDATE no action;