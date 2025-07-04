import { pgTable, timestamp, uuid } from "drizzle-orm/pg-core";
import { plVocabulary } from "./pl";
import { ruVocabulary } from "./ru";
import { enVocabulary } from "./en";

export const pl_ru_translations = pgTable("pl_ru_translations", {
  id: uuid("id").primaryKey().defaultRandom(),
  wordId1: uuid("word_id_1")
    .notNull()
    .references(() => plVocabulary.id, { onDelete: "cascade" }),
  wordId2: uuid("word_id_2")
    .notNull()
    .references(() => ruVocabulary.id, { onDelete: "cascade" }),
  lastlyReviewedAt: timestamp("lastly_reviewed_at"),
});

export const en_pl_translations = pgTable("en_pl_translations", {
  id: uuid("id").primaryKey().defaultRandom(),
  wordId1: uuid("word_id_1")
    .notNull()
    .references(() => enVocabulary.id, { onDelete: "cascade" }),
  wordId2: uuid("word_id_2")
    .notNull()
    .references(() => plVocabulary.id, { onDelete: "cascade" }),
  lastlyReviewedAt: timestamp("lastly_reviewed_at"),
});
