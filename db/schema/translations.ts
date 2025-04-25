import { pgTable, uuid } from "drizzle-orm/pg-core";
import { plVocabulary } from "./pl";
import { ruVocabulary } from "./ru";

export const pl_ru_translations = pgTable("pl_ru_translations", {
  id: uuid("id").primaryKey().defaultRandom(),
  wordId1: uuid("word_id_1")
    .notNull()
    .references(() => plVocabulary.id, { onDelete: "cascade" }),
  wordId2: uuid("word_id_2")
    .notNull()
    .references(() => ruVocabulary.id, { onDelete: "cascade" }),
});

export const vocabTables = {
  pl: plVocabulary,
  ru: ruVocabulary,
};

export const translationTables: Record<string, typeof pl_ru_translations> = {
  pl_ru: pl_ru_translations,
};
