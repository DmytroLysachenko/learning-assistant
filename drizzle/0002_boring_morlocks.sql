ALTER TABLE "pl_en_translations" RENAME TO "en_pl_translations";--> statement-breakpoint
ALTER TABLE "en_pl_translations" DROP CONSTRAINT "pl_en_translations_word_id_1_pl_vocabulary_id_fk";
--> statement-breakpoint
ALTER TABLE "en_pl_translations" DROP CONSTRAINT "pl_en_translations_word_id_2_en_vocabulary_id_fk";
--> statement-breakpoint
ALTER TABLE "en_pl_translations" ADD CONSTRAINT "en_pl_translations_word_id_1_en_vocabulary_id_fk" FOREIGN KEY ("word_id_1") REFERENCES "public"."en_vocabulary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "en_pl_translations" ADD CONSTRAINT "en_pl_translations_word_id_2_pl_vocabulary_id_fk" FOREIGN KEY ("word_id_2") REFERENCES "public"."pl_vocabulary"("id") ON DELETE cascade ON UPDATE no action;