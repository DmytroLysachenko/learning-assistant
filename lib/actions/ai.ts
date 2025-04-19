"use server";
import { generateObject } from "ai";
import { model } from "@/lib/ai";
import { db } from "@/db";
import { polishVocabulary, rusVocabulary, translations } from "@/db/schema";
import { aiTranslationSchema, wordSchemas } from "../validations/ai";
import { LanguageLevels } from "@/types";
import { WORD_TYPES_PL_PROMPTS, WORDS_CATEGORIES } from "@/constants";
import { z } from "zod";

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
  level: string,
  wordType?: keyof typeof WORD_TYPES_PL_PROMPTS
) => {
  const table = vocabTables[lang];
  const schema = wordSchemas[lang];
  type WordType = z.infer<typeof schema>;
  const randomCategory =
    WORDS_CATEGORIES[Math.floor(Math.random() * WORDS_CATEGORIES.length)];

  const system = `You are a linguistic AI generating educational vocabulary for a language learning app.`;

  const prompt = `
Generate ${quantity} unique ${lang.toUpperCase()} vocabulary words for CEFR level "${level}" under the topic "${randomCategory}".

Guidelines:
- Words must be relevant to the topic: "${randomCategory}".
- Avoid overly basic or common words.
- Ensure uniqueness from standard beginner word lists.
${wordType ? WORD_TYPES_PL_PROMPTS[wordType] : ""}
`;
  console.log(prompt);

  const result = await generateObject<WordType>({
    model,
    mode: "tool",
    output: "array",
    schema: schema,
    system,
    prompt,
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
  const schema = wordSchemas[toLang];

  type WordType = z.infer<typeof schema>;

  const result = await generateObject<WordType>({
    model,
    output: "array",
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
  type TranslationType = z.infer<typeof aiTranslationSchema>;

  const result = await generateObject<TranslationType>({
    model,
    output: "array",
    schema: aiTranslationSchema,
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
  level: LanguageLevels,
  wordType?: keyof typeof WORD_TYPES_PL_PROMPTS
) => {
  try {
    const plWords = await generateUniqueWords("pl", quantity, level, wordType);

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
        `Translation warning: Identical word string "${pl?.word}" in both PL and RU`
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

// export const enrichPolishVocabularyWithCategories = async () => {
//   const allWords = await db.select().from(polishVocabulary);
//   const batchSize = 50;

//   for (let i = 0; i < allWords.length; i += batchSize) {
//     const batch = allWords.slice(i, i + batchSize);

//     const response = await generateObject({
//       model,
//       schema: z.array(
//         z.object({
//           word: z.string(),
//           category: z.enum(WORDS_CATEGORIES as [string, ...string[]]),
//         })
//       ),
//       system: `You are a language learning assistant classifying vocabulary into helpful topic categories.`,
//       prompt: `
// Classify the following Polish words into one of these categories: ${WORDS_CATEGORIES.join(
//         ", "
//       )}.
// Return an array of { word, category } objects only. Here are the words:
// ${JSON.stringify(batch.map((w) => ({ word: w.word, example: w.example })))}
//       `,
//     });

//     for (const item of response.object) {
//       await db
//         .update(polishVocabulary)
//         .set({ category: item.category })
//         .where(eq(polishVocabulary.word, item.word));
//     }

//     console.log(`Updated batch ${i / batchSize + 1}`);
//     await new Promise((res) => setTimeout(res, 5000)); // wait 5 sec
//   }
// };
