import { WORD_TYPES_PL_PROMPTS } from "@/constants";
import { wordSchemas } from "@/lib/validations/ai";

import { generateObject } from "ai";
import { z } from "zod";
import { modelFlash as model } from "../aiClient";
import { generateVocabularyByTopicPrompt } from "../prompts/promptBuilders";
import { LanguageCodeType } from "@/types";

export const generateVocabularyByTopic = async ({
  lang,
  quantity,
  level,
  wordType,
}: {
  lang: LanguageCodeType;
  quantity: number;
  level: string;
  wordType?: keyof typeof WORD_TYPES_PL_PROMPTS;
}) => {
  try {
    const schema = wordSchemas[lang];
    type WordType = z.infer<typeof schema>;

    const { system, prompt } = generateVocabularyByTopicPrompt({
      lang,
      quantity,
      level,
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
