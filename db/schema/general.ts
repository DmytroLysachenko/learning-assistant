import { pgEnum } from "drizzle-orm/pg-core";

// Language learning levels
export const languageLevelEnum = pgEnum("language_level", [
  "A0",
  "A1",
  "A2",
  "B1",
  "B2",
  "C1",
  "C2",
]);

// Status of user learning a word
export const wordStatusEnum = pgEnum("word_status", [
  "learning",
  "reviewing",
  "mastered",
]);
