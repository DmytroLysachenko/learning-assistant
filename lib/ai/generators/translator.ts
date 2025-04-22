import { generateObject } from "ai";
import { modelFlash as model } from "../aiClient";
// import { vocabTables } from "@/constants";
import { LanguageCode } from "@/types";
import { wordSchemas } from "@/lib/validations/ai";
import { z } from "zod";
import { generateTranslationPrompt } from "../prompts/promptBuilders";
// import { db } from "@/db";

export const generateTranslationWords = async (
  fromLang: LanguageCode,
  toLang: LanguageCode,
  words: { word: string; id: string }[]
) => {
  try {
    // const toTable = vocabTables[toLang];
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

    // const inserted = await db.insert(toTable).values(result.object).returning();

    return { success: true, data: result.object };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};
