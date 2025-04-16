import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  boolean,
  integer,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  image: text("image"),
  passwordHash: text("password_hash"),
  provider: text("provider").default("credentials"), // Track how user registered
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Words table
export const words = pgTable("words", {
  id: uuid("id").primaryKey().defaultRandom(),
  russian: varchar("russian", { length: 255 }).notNull(),
  polish: varchar("polish", { length: 255 }).notNull(),
  russianExample: text("russian_example"),
  polishExample: text("polish_example"),
  difficulty: integer("difficulty").default(1),
});

// User-Words many-to-many relationship
export const userWords = pgTable("user_words", {
  userId: uuid("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  wordId: uuid("word_id")
    .notNull()
    .references(() => words.id, { onDelete: "cascade" }),
  addedAt: timestamp("added_at").notNull().defaultNow(),
  mastered: boolean("mastered").notNull().default(false),
});

// Relations for querying
export const usersRelations = relations(users, ({ many }) => ({
  words: many(userWords),
}));

export const wordsRelations = relations(words, ({ many }) => ({
  users: many(userWords),
}));

export const userWordsRelations = relations(userWords, ({ one }) => ({
  user: one(users, {
    fields: [userWords.userId],
    references: [users.id],
  }),
  word: one(words, {
    fields: [userWords.wordId],
    references: [words.id],
  }),
}));
