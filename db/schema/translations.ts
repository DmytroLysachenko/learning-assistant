import { pgTable, uuid } from "drizzle-orm/pg-core";
import { polishVocabulary } from "./pl";
import { rusVocabulary } from "./rus";

export const translations = pgTable("translations", {
  id: uuid("id").primaryKey().defaultRandom(),
  wordId1: uuid("word_id_1")
    .notNull()
    .references(() => polishVocabulary.id, { onDelete: "cascade" }),
  wordId2: uuid("word_id_2")
    .notNull()
    .references(() => rusVocabulary.id, { onDelete: "cascade" }),
});
