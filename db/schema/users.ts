import {
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { LanguageCodeType } from "@/types";

export const roleEnum = pgEnum("role", ["basic", "premium", "admin", "test"]);

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  image: text("image"),
  passwordHash: text("password_hash"),
  streak: integer("streak").default(0).notNull(),
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
  role: roleEnum("role").default("basic").notNull(),
});
