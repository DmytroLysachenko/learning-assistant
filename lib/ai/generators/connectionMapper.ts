import { aiTranslationSchema } from "@/lib/validations/ai";
import { generateObject } from "ai";
import { modelFlash as model } from "../aiClient";
import { ShortWordEntry, TranslationType } from "@/types";
import { generateTranslationConnectionsPrompt } from "../prompts";

export const generateTranslationConnections = async (
  primaryLanguageWords: ShortWordEntry[],
  translationLanguageWords: ShortWordEntry[]
) => {
  try {
    const { system, prompt } = generateTranslationConnectionsPrompt(
      primaryLanguageWords,
      translationLanguageWords
    );

    const result = await generateObject<TranslationType>({
      model,
      output: "array",
      schema: aiTranslationSchema,
      system,
      prompt,
    });

    return { success: true, data: result.object };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};
