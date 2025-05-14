import { LanguageCodeType, WordType } from "@/types";

import { GetWordType } from "@/db/types";
import { wordsValidationSchemas } from "@/lib/validations/ai";
import { z } from "zod";
import { generateObject } from "ai";
import { modelFlashLiteExp as model } from "../aiClient";
import {
  validateTranslationConnectionsPrompt,
  validateVocabularyTranslationWordsPrompt,
  validateVocabularyWordsPrompt,
} from "../prompts";

export const validateVocabularyWords = async ({
  language,
  words = [],
  wordType,
}: {
  language: LanguageCodeType;
  words: GetWordType[typeof language][];
  wordType: WordType;
}) => {
  try {
    const schema = wordsValidationSchemas[language];
    type WordType = z.infer<typeof schema>;

    const { system, prompt } = validateVocabularyWordsPrompt({
      language,
      words,
      wordType,
    });

    const result = await generateObject<WordType>({
      model,
      mode: "tool",
      output: "array",
      schema: schema,
      system,
      prompt,
    });

    return { success: true, data: result.object };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};

export const validateVocabularyTranslationWords = async ({
  fromLanguage,
  toLanguage,
  entries,
  wordType,
}: {
  fromLanguage: LanguageCodeType;
  toLanguage: LanguageCodeType;
  entries: {
    fromLanguageWord: GetWordType[typeof fromLanguage];
    toLanguageWord: GetWordType[typeof toLanguage];
  }[];
  wordType: WordType;
}) => {
  try {
    const schema = wordsValidationSchemas[toLanguage];
    type WordType = z.infer<typeof schema>;

    const { system, prompt } = validateVocabularyTranslationWordsPrompt({
      fromLanguage,
      toLanguage,
      entries,
      wordType,
    });

    const result = await generateObject<WordType>({
      model,
      mode: "tool",
      output: "array",
      schema: schema,
      system,
      prompt,
    });

    return { success: true, data: result.object };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};

export const validateTranslationConnections = async ({
  fromLanguage,
  toLanguage,
  entries,
}: {
  fromLanguage: LanguageCodeType;
  toLanguage: LanguageCodeType;
  entries: {
    id: string;
    fromLanguageWord: {
      word: string | null;
      comment: string | null;
      example: string | null;
    };
    toLanguageWord: {
      word: string | null;
      comment: string | null;
      example: string | null;
    };
  }[];
}): Promise<{
  success: boolean;
  invalidConnections?: { id: string; reason: string }[];
  error?: unknown;
}> => {
  try {
    const { system, prompt } = validateTranslationConnectionsPrompt({
      fromLanguage,
      toLanguage,
      entries,
    });

    const result = await generateObject<{ id: string; reason: string }>({
      model,
      mode: "tool",
      output: "array",
      schema: z.object({ id: z.string(), reason: z.string() }),
      system,
      prompt,
    });

    return { success: true, invalidConnections: result.object };
  } catch (error) {
    console.error("❌ Failed to validate connections:", error);
    return { success: false, error };
  }
};
