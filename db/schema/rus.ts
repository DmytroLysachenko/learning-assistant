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

// Russian word type enum
export const russianWordTypeEnum = pgEnum("russian_word_type", [
  "существительное", // noun
  "глагол", // verb
  "прилагательное", // adjective
  "числительное", // numeral
  "местоимение", // pronoun
  "наречие", // adverb
  "предлог", // preposition
  "частица", // particle
]);

// Russian vocabulary table
export const rusVocabulary = pgTable("rus_vocabulary", {
  id: uuid("id").primaryKey().defaultRandom(),
  word: varchar("word", { length: 255 }).notNull(),
  example: text("example"),
  type: russianWordTypeEnum("type").notNull(),
  difficulty: languageLevelEnum("difficulty").default("A1"),
  createdAt: timestamp("created_at").defaultNow(),
  comment: text("comment"),
});

// User-Russian word tracking
export const userRusWords = pgTable("user_rus_words", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  wordId: uuid("word_id")
    .references(() => rusVocabulary.id, { onDelete: "cascade" })
    .notNull(),
  status: wordStatusEnum("status").default("learning"),
  correctAnswersCount: integer("correct_answers_count").default(0),
  lastReviewedAt: timestamp("last_reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});
