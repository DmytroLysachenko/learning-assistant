"use server";

import { db } from "@/db";
import { polishVocabulary, rusVocabulary, translations } from "@/db/schema";
import { checkGeneratedDataQuality, generateWords } from "./ai";
import { notInArray } from "drizzle-orm";
import {
  WORD_TYPES_PL_PROMPTS,
  WORDS_CATEGORIES,
  WORDS_LANGUAGE_LEVELS,
} from "@/constants";
import { sleep } from "../utils";

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

type WordLevel = "A0" | "A1" | "A2" | "B1" | "B2" | "C1" | "C2";

interface SeedWordsOptions {
  total: number;
  batchSize?: number;
  delayMs?: number;
  randomizeType?: boolean;
  randomizeCategory?: boolean;
  level?: WordLevel;
  wordType?: keyof typeof WORD_TYPES_PL_PROMPTS;
  log?: boolean;
}

export const seedWords = async ({
  total,
  batchSize = 10,
  delayMs = 5000,
  randomizeType = false,
  level,
  wordType,
  log = true,
}: SeedWordsOptions) => {
  const batches = Math.ceil(total / batchSize);

  let generated = 0;

  if (log) {
    console.log(`🚀 Starting to seed ${total} words...`);
  }

  for (let i = 0; i < batches; i++) {
    const currentLevel = !level
      ? WORDS_LANGUAGE_LEVELS[
          Math.floor(Math.random() * WORDS_LANGUAGE_LEVELS.length)
        ]
      : level;

    const currentType = randomizeType
      ? (Object.keys(WORD_TYPES_PL_PROMPTS)[
          Math.floor(Math.random() * Object.keys(WORD_TYPES_PL_PROMPTS).length)
        ] as keyof typeof WORD_TYPES_PL_PROMPTS)
      : wordType;

    const currentCategory =
      WORDS_CATEGORIES[Math.floor(Math.random() * WORDS_CATEGORIES.length)];

    if (log) {
      console.log(
        `🔁 Batch ${i + 1}/${batches}: Generating ${batchSize} ${
          currentType || ""
        } words at level ${currentLevel} ${
          currentCategory ? `on topic "${currentCategory}"` : ""
        }`
      );
    }

    try {
      await generateWords(batchSize, currentLevel, currentType);
      generated += batchSize;
      console.log(`✅ Generated ${generated} words so far`);
    } catch (error) {
      console.error(`❌ Error generating batch ${i + 1}:`, error);
    }

    // Wait between batches unless it's the last
    if (i < batches - 1) {
      if (log) console.log(`⏱ Waiting ${delayMs / 1000}s...`);
      await sleep(delayMs);
    }

    await removeDuplicatesFromTable("pl");
    await removeDuplicatesFromTable("ru");
    await removeUntranslatedWords();
  }

  if (log) console.log("🔍 Running quality check...");
  const issues = await checkGeneratedDataQuality();

  if (!issues.length) {
    console.log("🎉 All looks clean!");
  } else {
    console.warn(`⚠️ Found ${issues.length} potential issue(s).`);
  }
};
