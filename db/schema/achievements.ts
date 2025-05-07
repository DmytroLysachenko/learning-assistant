import {
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users } from "./users";

// Achievement Types
export const achievementTypeEnum = pgEnum("achievement_type", [
  "vocabulary", // e.g., 100 words learned
  "streak", // e.g., 7-day streak
  "review", // e.g., 100 reviews
]);

// Achievements
export const achievements = pgTable("achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  type: achievementTypeEnum("type").notNull(),
  criteria: jsonb("criteria").notNull(), // e.g., { wordsLearned: 100 }
  createdAt: timestamp("created_at").defaultNow(),
});

// User-Achievements
export const userAchievements = pgTable("user_achievements", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  achievementId: uuid("achievement_id")
    .notNull()
    .references(() => achievements.id, { onDelete: "cascade" }),
  achievedAt: timestamp("achieved_at").defaultNow(),
});
