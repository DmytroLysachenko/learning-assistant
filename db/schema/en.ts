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

// English word type enum
export const englishWordTypeEnum = pgEnum("english_word_type", [
  "noun",
  "verb",
  "adjective",
  "numeral",
  "pronoun",
  "adverb",
  "preposition",
  "particle",
  "conjunction",
]);

// English vocabulary table
export const enVocabulary = pgTable("en_vocabulary", {
  id: uuid("id").primaryKey().defaultRandom(),
  word: varchar("word", { length: 255 }).notNull(),
  example: text("example"),
  type: englishWordTypeEnum("type").notNull(),
  difficulty: languageLevelEnum("difficulty").default("A1"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  comment: text("comment"),
});

// User-English word tracking
export const userEnglishWords = pgTable("user_english_words", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  wordId: uuid("word_id")
    .references(() => enVocabulary.id, { onDelete: "cascade" })
    .notNull(),
  status: wordStatusEnum("status").default("learning").notNull(),
  correctAnswersCount: integer("correct_answers_count").default(0).notNull(),
  wrongAnswersCount: integer("wrong_answers_count").default(0).notNull(),
  lastReviewedAt: timestamp("last_reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});
