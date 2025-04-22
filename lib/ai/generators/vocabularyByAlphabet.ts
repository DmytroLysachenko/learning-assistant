import { wordSchemas } from "@/lib/validations/ai";

import { generateObject } from "ai";
import { modelFlash as model } from "../aiClient";
import { z } from "zod";

import { generateVocabularyByLetterPrompt } from "../prompts/promptBuilders";
import { LanguageCodeType } from "@/types";
import { WORD_TYPES_PL_PROMPTS } from "@/constants";

export const generateVocabularyByLetter = async ({
  lang,
  letter,
  quantity,
  level,
  wordType,
  existingWords = [],
}: {
  lang: LanguageCodeType;
  letter: string;
  quantity: number;
  level: string;
  wordType?: keyof typeof WORD_TYPES_PL_PROMPTS;
  existingWords?: string[];
}) => {
  try {
    const schema = wordSchemas[lang];
    type WordType = z.infer<typeof schema>;

    const { system, prompt } = generateVocabularyByLetterPrompt({
      lang,
      letter,
      quantity,
      level,
      existingWords,
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
