import { LanguageCodeType } from "@/types";
import { jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name"),
  email: text("email").notNull().unique(),
  image: text("image"),
  passwordHash: text("password_hash"),
  provider: text("provider").default("credentials"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
  learningLanguages: jsonb("learning_languages")
    .default([])
    .$type<LanguageCodeType[]>(),
  interfaceLanguage: text("interface_language")
    .default("ru")
    .$type<LanguageCodeType>(),
});
