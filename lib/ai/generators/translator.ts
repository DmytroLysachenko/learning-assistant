import { generateObject } from "ai";
import { modelFlash as model } from "../aiClient";
import { LanguageCodeType } from "@/types";
import { wordSchemas } from "@/lib/validations/ai";
import { z } from "zod";
import { generateTranslationPrompt } from "../prompts";

export const generateTranslationWords = async (
  fromLang: LanguageCodeType,
  toLang: LanguageCodeType,
  words: {
    word: string;
    id: string;
    example: string | null;
    comment: string | null;
    difficulty: string | null;
  }[]
) => {
  try {
    const schema = wordSchemas[toLang];

    type WordType = z.infer<typeof schema>;

    const { system, prompt } = generateTranslationPrompt(
      fromLang,
      toLang,
      words
    );

    const result = await generateObject<WordType>({
      model,
      output: "array",
      schema,
      system,
      prompt,
    });

    console.log(
      words,
      result.object.map((w) => w.word)
    );

    return { success: true, data: result.object };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};
