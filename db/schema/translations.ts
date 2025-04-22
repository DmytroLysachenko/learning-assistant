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

export const translationTableMap = {
  pl_ru: pl_ru_translations,
  // "en_pl": en_pl_translations, etc.
};

export const vocabTableMap = {
  pl: plVocabulary,
  ru: ruVocabulary,
  // Add others...
};
