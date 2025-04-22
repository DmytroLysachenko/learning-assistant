import { aiTranslationSchema } from "@/lib/validations/ai";
import { generateObject } from "ai";
import { modelFlash as model } from "../aiClient";
import { ShortWordType, TranslationType } from "@/types";
import { generateTranslationConnectionsPrompt } from "../prompts/promptBuilders";

export const generateTranslationConnections = async (
  primaryLanguageWords: ShortWordType[],
  translationLanguageWords: ShortWordType[]
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
