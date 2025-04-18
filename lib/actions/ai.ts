"use server";
import { generateObject } from "ai";
import { model } from "@/lib/ai";
import { db } from "@/db";
import { polishVocabulary, rusVocabulary, translations } from "@/db/schema";
import { aiTranslationArraySchema, wordSchemas } from "../validations/ai";
import { removeDuplicatesFromTable } from "./admin";
import { LanguageLevels } from "@/types";

// Maps language codes to vocab table references
const vocabTables = {
  pl: polishVocabulary,
  ru: rusVocabulary,
} as const;

type LanguageCode = keyof typeof vocabTables;

/**
 * Generates unique vocabulary words for a given language and level
 */
export const generateUniqueWords = async (
  lang: LanguageCode,
  quantity: number,
  level: string
) => {
  const table = vocabTables[lang];
  const schema = wordSchemas[lang].arraySchema;

  const existingWords = await db.select().from(table);
  console.log(existingWords.map((w) => w.word).join(", "));
  const result = await generateObject({
    model,
    schema,
    system: `You are an AI assistant generating ${lang} vocabulary for a language learning app.`,
    prompt: `Generate ${quantity} new ${lang.toUpperCase()} vocabulary words for CEFR level ${level}. 
Avoid duplicates from this list of already existing words: ${existingWords
      .map((w) => w.word)
      .join(", ")}`,
  });

  const inserted = await db.insert(table).values(result.object).returning();
  return inserted;
};

/**
 * Generates translated vocabulary entries for the target language
 */
export const generateTranslationWords = async (
  fromLang: LanguageCode,
  toLang: LanguageCode,
  words: { word: string; id: string }[]
) => {
  const toTable = vocabTables[toLang];
  const schema = wordSchemas[toLang].arraySchema;

  const result = await generateObject({
    model,
    schema,
    system: `You are an AI translator for language learning vocabulary.`,
    prompt: `Translate the following ${fromLang.toUpperCase()} words into ${toLang.toUpperCase()} with examples, grammatical types and difficulty levels:\n${JSON.stringify(
      words
    )}`,
  });

  const inserted = await db.insert(toTable).values(result.object).returning();
  return inserted;
};

/**
 * Generates connection objects for translation mappings between vocabularies
 */
export const generateTranslationConnections = async ({
  wordPairs,
}: {
  wordPairs: {
    wordId1: string;
    word: string;
    wordId2: string;
    translation: string;
  }[];
}) => {
  const result = await generateObject({
    model,
    schema: aiTranslationArraySchema,
    system: `You are an AI linking tool for connecting translations between languages.`,
    prompt: `Generate translation connection objects (UUID pairs) for the following vocabulary pairs:\n${JSON.stringify(
      wordPairs
    )}`,
  });

  await db.insert(translations).values(result.object);
  return result.object;
};

export const generateWords = async (
  quantity: number,
  level: LanguageLevels
) => {
  try {
    const plWords = await generateUniqueWords("pl", quantity, level);

    const ruWords = await generateTranslationWords("pl", "ru", plWords);

    const wordPairs = plWords.map((pl, i) => ({
      wordId1: pl.id,
      word: pl.word,
      wordId2: ruWords[i]?.id,
      translation: ruWords[i]?.word,
    }));

    const connections = await generateTranslationConnections({ wordPairs });

    console.log("Generation complete");
    return {
      polishWords: plWords,
      russianWords: ruWords,
      translationConnections: connections,
    };
  } catch (error) {
    console.error("AI Generation Error:", error);
    throw error;
  }
};

export const checkGeneratedDataQuality = async () => {
  const issues: string[] = [];

  // Get words and translations
  const plWords = await db.select().from(polishVocabulary);
  const ruWords = await db.select().from(rusVocabulary);
  const translationLinks = await db.select().from(translations);

  const polishWordMap = new Map(plWords.map((w) => [w.id, w]));
  const russianWordMap = new Map(ruWords.map((w) => [w.id, w]));

  // ✅ Check Polish words
  for (const word of plWords) {
    if (!word.word || word.word.length < 2) {
      issues.push(`PL: Word "${word.word}" seems invalid.`);
    }
    if (!word.example || word.example.length < 4) {
      issues.push(`PL: Word "${word.word}" has a weak or missing example.`);
    }
  }

  // ✅ Check Russian words
  for (const word of ruWords) {
    if (!word.word || word.word.length < 2) {
      issues.push(`RU: Word "${word.word}" seems invalid.`);
    }
    if (!word.example || word.example.length < 4) {
      issues.push(`RU: Word "${word.word}" has a weak or missing example.`);
    }
  }

  // ✅ Check Translations
  for (const link of translationLinks) {
    const pl = polishWordMap.get(link.wordId1);
    const ru = russianWordMap.get(link.wordId2);

    if (!pl) {
      issues.push(
        `Translation issue: Missing Polish word for ID ${link.wordId1}`
      );
    }
    if (!ru) {
      issues.push(
        `Translation issue: Missing Russian word for ID ${link.wordId2}`
      );
    }

    if (pl?.word.toLowerCase() === ru?.word.toLowerCase()) {
      issues.push(
        `Translation warning: Identical word string "${pl.word}" in both PL and RU`
      );
    }

    if (pl && ru && pl.difficulty !== ru.difficulty) {
      issues.push(
        `Translation warning: Difficulty mismatch between "${pl.word}" (${pl.difficulty}) and "${ru.word}" (${ru.difficulty})`
      );
    }
  }

  if (issues.length === 0) {
    console.log(
      "✅ All generated words and translations passed basic quality checks."
    );
  } else {
    console.warn("⚠️ Issues found in AI-generated data:");
    issues.forEach((issue) => console.warn("- " + issue));
  }

  return issues;
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
