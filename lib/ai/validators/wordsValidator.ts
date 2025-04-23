import { LanguageCodeType, WordType } from "@/types";

import { GetWordType } from "@/db/types";
import { wordSchemas } from "@/lib/validations/ai";
import { z } from "zod";
import { generateObject } from "ai";
import { modelFlash as model } from "../aiClient";
import { validateVocabularyWordsPrompt } from "../prompts/promptBuilders";

export const validateVocabularyWords = async ({
  lang,
  words = [],
  wordType,
}: {
  lang: LanguageCodeType;
  words: GetWordType[typeof lang][];
  wordType: WordType;
}) => {
  try {
    const schema = wordSchemas[lang];
    type WordType = z.infer<typeof schema>;

    const { system, prompt } = validateVocabularyWordsPrompt({
      lang,
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
