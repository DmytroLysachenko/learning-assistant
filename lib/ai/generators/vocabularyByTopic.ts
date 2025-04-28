import { wordSchemas } from "@/lib/validations/ai";

import { generateObject } from "ai";
import { z } from "zod";
import { modelFlash as model } from "../aiClient";
import { generateVocabularyByTopicPrompt } from "../prompts";
import { LanguageCodeType, WordType } from "@/types";

export const generateVocabularyByTopic = async ({
  language,
  quantity,
  level,
  wordType,
}: {
  language: LanguageCodeType;
  quantity: number;
  level: string;
  wordType?: WordType;
}) => {
  try {
    const schema = wordSchemas[language];
    type WordType = z.infer<typeof schema>;

    const { system, prompt } = generateVocabularyByTopicPrompt({
      language,
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
