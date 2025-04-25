import { LanguageCodeType, WordType } from "@/types";

import { GetWordType } from "@/db/types";
import { wordsValidationSchemas } from "@/lib/validations/ai";
import { z } from "zod";
import { generateObject } from "ai";
import { modelFlash as model } from "../aiClient";
import { validateVocabularyWordsPrompt } from "../prompts/promptBuilders";

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
