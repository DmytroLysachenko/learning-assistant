import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  pgEnum,
  integer,
} from "drizzle-orm/pg-core";
import { languageLevelEnum, wordStatusEnum } from "./general";
import { users } from "./users";

// Polish word type enum
export const polishWordTypeEnum = pgEnum("polish_word_type", [
  "rzeczownik", // noun
  "czasownik", // verb
  "przymiotnik", // adjective
  "liczebnik", // numeral
  "zaimek", // pronoun
  "przysłówek", // adverb
  "przyimek", // preposition
  "partykuła", // particle
  "spójnik", // conjunction
]);

// Polish vocabulary table
export const plVocabulary = pgTable("pl_vocabulary", {
  id: uuid("id").primaryKey().defaultRandom(),
  word: varchar("word", { length: 255 }).notNull(),
  example: text("example"),
  type: polishWordTypeEnum("type").notNull(),
  difficulty: languageLevelEnum("difficulty").default("A1"),
  createdAt: timestamp("created_at").defaultNow(),
  comment: text("comment"),
});

// User-Polish word tracking
export const userPolishWords = pgTable("user_polish_words", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  wordId: uuid("word_id")
    .references(() => plVocabulary.id, { onDelete: "cascade" })
    .notNull(),
  status: wordStatusEnum("status").default("learning"),
  correctAnswersCount: integer("correct_answers_count").default(0),
  lastReviewedAt: timestamp("last_reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});
