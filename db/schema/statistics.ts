import { integer, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import { users } from "./users";
import { LanguageCodeType } from "@/types";

export const userLanguageStats = pgTable("user_language_stats", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  languageCode: text("language_code").notNull().$type<LanguageCodeType>(),
  wordsLearned: integer("words_learned").default(0),
  totalWords: integer("total_words").default(0),
  reviewsCompleted: integer("reviews_completed").default(0),
  currentStreak: integer("current_streak").default(0),
  longestStreak: integer("longest_streak").default(0),
  updatedAt: timestamp("updated_at").defaultNow(),
});
