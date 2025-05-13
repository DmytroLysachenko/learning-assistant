import { LanguageCodeType, WordType } from "@/types";

import { GetWordType } from "@/db/types";
import { wordsValidationSchemas } from "@/lib/validations/ai";
import { z } from "zod";
import { generateObject } from "ai";
import { modelFlashLiteExp as model } from "../aiClient";
import {
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
