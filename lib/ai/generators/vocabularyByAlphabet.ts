import { wordSchemas } from "@/lib/validations/ai";

import { generateObject } from "ai";
import { modelFlash as model } from "../aiClient";

import { generateVocabularyByLetterPrompt } from "../prompts/promptBuilders";
import { LanguageCodeType, WordType } from "@/types";
import { z } from "zod";

export const generateVocabularyByLetter = async ({
  lang,
  letter,
  quantity,
  wordType,
  existingWords = [],
}: {
  lang: LanguageCodeType;
  letter: string;
  quantity: number;
  wordType?: WordType;
  existingWords?: string[];
}) => {
  try {
    const schema = wordSchemas[lang];
    type WordType = z.infer<typeof schema>;

    const { system, prompt } = generateVocabularyByLetterPrompt({
      lang,
      letter,
      quantity,
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
