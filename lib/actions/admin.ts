// lib/actions/admin.actions.ts

"use server";

import { db } from "@/db";
import { polishVocabulary, rusVocabulary, translations } from "@/db/schema";

const vocabTables = {
  pl: "polish_vocabulary",
  ru: "rus_vocabulary",
  // en: sql.raw("english_vocabulary"), // future
};

export const cleanAllVocabularyData = async () => {
  try {
    // Order matters due to FK constraints
    await db.delete(translations);
    await db.delete(polishVocabulary);
    await db.delete(rusVocabulary);

    console.log("✅ All vocabulary and translation tables cleaned.");
  } catch (err) {
    console.error("❌ Error during cleaning:", err);
    throw err;
  }
};

export const removeDuplicatesFromTable = async (table: "pl" | "ru") => {
  const tableName = vocabTables[table];

  try {
    await db.execute(`
      DELETE FROM ${tableName}
      WHERE id IN (
        SELECT id FROM (
          SELECT id,
                 ROW_NUMBER() OVER (PARTITION BY LOWER(word) ORDER BY created_at ASC) AS rn
          FROM ${tableName}
        ) duplicates
        WHERE duplicates.rn > 1
      );
    `);

    console.log(`✅ Duplicates removed from ${tableName}`);
  } catch (err) {
    console.error(`❌ Failed to remove duplicates from ${tableName}`, err);
    throw err;
  }
};
