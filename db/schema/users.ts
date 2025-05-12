import {
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { LanguageCodeType } from "@/types";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  image: text("image"),
  passwordHash: text("password_hash"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  learningLanguages: jsonb("learning_languages")
    .default([])
    .$type<LanguageCodeType[]>()
    .notNull(),
  interfaceLanguage: text("interface_language")
    .default("ru")
    .$type<LanguageCodeType>()
    .notNull(),
  experience: integer("experience").default(0).notNull(),
});
