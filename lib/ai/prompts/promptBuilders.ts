import { WORD_TYPES_PL_PROMPTS, WORDS_CATEGORIES } from "@/constants";
import { LanguageCodeType, ShortWordType } from "@/types";

export const generateVocabularyByTopicPrompt = ({
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
  const system = `You are a linguistic AI generating educational vocabulary for a language learning app.`;

  const randomCategory =
    WORDS_CATEGORIES[Math.floor(Math.random() * WORDS_CATEGORIES.length)];

  const prompt = `
Generate ${quantity} unique ${lang.toUpperCase()} vocabulary words for CEFR level "${level}" under the topic "${randomCategory}".

Guidelines:
- If applicable, words must be relevant to the topic: "${randomCategory}".
- Only include relevant, translatable vocabulary — no slang, abbreviations, or proper names.
${wordType ? WORD_TYPES_PL_PROMPTS[wordType] : ""}
`;

  return { system, prompt };
};

export const generateVocabularyByLetterPrompt = ({
  lang,
  letter,
  quantity,
  level,
  existingWords = [],
  wordType,
}: {
  lang: LanguageCodeType;
  letter: string;
  quantity: number;
  level: string;
  wordType?: keyof typeof WORD_TYPES_PL_PROMPTS;
  existingWords: string[];
}) => {
  const system = `You are a linguistic AI generating useful vocabulary for language learners.`;

  const exclusions = existingWords.length
    ? `Avoid these words: ${existingWords.join(", ")}`
    : "";

  const prompt = `
Generate ${quantity} unique ${lang.toUpperCase()} vocabulary words for CEFR level "${level}" that all begin with the letter "${letter.toUpperCase()}".
Guidelines:
- All words must start with the letter "${letter}".
- If there is no words starts with the letter "${letter}", generate words with the letter "${letter}".
- Provide good, short examples for each word.
- Avoid duplicate or overly similar word forms.
- Only include relevant, translatable vocabulary — no slang, abbreviations, or proper names.
${wordType ? WORD_TYPES_PL_PROMPTS[wordType] : ""}
- ${exclusions}
`;

  return { system, prompt };
};

export const generateTranslationPrompt = (
  fromLang: LanguageCodeType,
  toLang: LanguageCodeType,
  words: { word: string; id: string }[]
) => {
  const system = `You are an AI translator for language learning vocabulary.`;

  const prompt = `Translate the following ${fromLang.toUpperCase()} words into ${toLang.toUpperCase()} with examples, grammatical types and difficulty levels:\n${JSON.stringify(
    words
  )}`;

  return { system, prompt };
};

export const generateTranslationConnectionsPrompt = (
  primaryLanguageWords: ShortWordType[],
  translationLanguageWords: ShortWordType[]
) => {
  const system = `You are an AI linking tool for connecting translations between languages.`;

  const prompt = `
You are given two sets of vocabulary words from different languages.

Each word has an ID and a text value. Your task is to find valid translation connections between these two lists.

Guidelines:
- Each connection should be based on semantic translation.
- Words may connect one-to-many or many-to-one if appropriate.
- Avoid duplicate or reversed duplicates.
- Focus only on meaningful, educationally relevant matches.

Primary Language Words:\n${JSON.stringify(primaryLanguageWords, null, 2)}

Translation Language Words:\n${JSON.stringify(
    translationLanguageWords,
    null,
    2
  )}
`;

  return { system, prompt };
};
