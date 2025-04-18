"use server";

import { db } from "@/db";
import { polishVocabulary, rusVocabulary, translations } from "@/db/schema";
import { checkGeneratedDataQuality, generateWords } from "./ai";
import { notInArray } from "drizzle-orm";
import { WORDS_CATEGORIES, WORDS_LANGUAGE_LEVELS } from "@/constants";

const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));

const vocabTables = {
  pl: "polish_vocabulary",
  ru: "rus_vocabulary",
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

export const removeUntranslatedWords = async () => {
  try {
    // POLISH: Get all Polish word IDs that are used in translations
    const linkedPolishIds = await db
      .select({ id: translations.wordId1 })
      .from(translations);

    const linkedPlIds = linkedPolishIds.map((item) => item.id);

    // Delete all Polish vocabulary entries not in translations
    const deletedPl = await db
      .delete(polishVocabulary)
      .where(notInArray(polishVocabulary.id, linkedPlIds));

    console.log(
      `🧹 Removed ${deletedPl.rowCount ?? 0} untranslated Polish words`
    );

    // RUSSIAN: Get all Russian word IDs that are used in translations
    const linkedRussianIds = await db
      .select({ id: translations.wordId2 })
      .from(translations);

    const linkedRuIds = linkedRussianIds.map((item) => item.id);

    // Delete all Russian vocabulary entries not in translations
    const deletedRu = await db
      .delete(rusVocabulary)
      .where(notInArray(rusVocabulary.id, linkedRuIds));

    console.log(
      `🧹 Removed ${deletedRu.rowCount ?? 0} untranslated Russian words`
    );
  } catch (err) {
    console.error("❌ Error cleaning untranslated words:", err);
    throw err;
  }
};

export const seedWordsInChunks = async (
  total: number,
  level: "A0" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2",
  batchSize = 10,
  delayMs = 5000
) => {
  console.log(`🚀 Starting seeding of ${total} words at level ${level}...`);

  const batches = Math.ceil(total / batchSize);

  for (let i = 0; i < batches; i++) {
    console.log(
      `🔁 Batch ${i + 1}/${batches}: Generating ${batchSize} words...`
    );

    try {
      await generateWords(batchSize, level);
    } catch (error) {
      console.error(`❌ Failed at batch ${i + 1}:`, error);
    }

    // Don't wait after last batch
    if (i < batches - 1) {
      console.log(`⏱ Waiting ${delayMs / 1000}s before next batch...`);
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }

    await removeDuplicatesFromTable("pl");
    await removeDuplicatesFromTable("ru");
  }

  console.log("✅ Seeding complete. Running quality checks...");
  const issues = await checkGeneratedDataQuality();

  if (issues.length === 0) {
    console.log("🎉 All looks good!");
  } else {
    console.warn(`⚠️ Found ${issues.length} issue(s) in generated content.`);
  }
};

export const seedWordsLoop = async (
  count: number = 500,
  batchSize = 10,
  delay = 5000
) => {
  let generated = 0;

  while (generated < count) {
    const randomLevel =
      WORDS_LANGUAGE_LEVELS[
        Math.floor(Math.random() * WORDS_LANGUAGE_LEVELS.length)
      ];
    const randomTopic =
      WORDS_CATEGORIES[Math.floor(Math.random() * WORDS_CATEGORIES.length)];

    console.log(
      `🧠 Generating ${batchSize} words at level ${randomLevel} on topic "${randomTopic}"...`
    );

    try {
      await generateWords(batchSize, randomLevel);
      generated += batchSize;
      console.log(`✅ Total generated: ${generated}/${count}`);
    } catch (err) {
      console.error("❌ Generation failed:", err);
    }

    if (generated < count) {
      console.log(`⏱️ Waiting ${delay / 1000}s before next batch...`);
      await sleep(delay);
    }
  }

  console.log("🎉 Seeding complete!");
};
