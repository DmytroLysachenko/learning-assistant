CREATE TABLE "pl_en_translations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"word_id_1" uuid NOT NULL,
	"word_id_2" uuid NOT NULL,
	"lastly_reviewed_at" timestamp
);
--> statement-breakpoint
ALTER TABLE "pl_en_translations" ADD CONSTRAINT "pl_en_translations_word_id_1_pl_vocabulary_id_fk" FOREIGN KEY ("word_id_1") REFERENCES "public"."pl_vocabulary"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "pl_en_translations" ADD CONSTRAINT "pl_en_translations_word_id_2_en_vocabulary_id_fk" FOREIGN KEY ("word_id_2") REFERENCES "public"."en_vocabulary"("id") ON DELETE cascade ON UPDATE no action;