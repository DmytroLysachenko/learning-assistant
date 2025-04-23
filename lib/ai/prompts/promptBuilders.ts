import { WORD_TYPES_PROMPTS, WORDS_CATEGORIES } from "@/constants";
import { GetWordType } from "@/db/types";
import { LanguageCodeType, ShortWordEntry, WordType } from "@/types";

export const generateVocabularyByTopicPrompt = ({
  lang,
  quantity,
  level,
  wordType,
}: {
  lang: LanguageCodeType;
  quantity: number;
  level: string;
  wordType?: WordType;
}) => {
  const system = `You are a linguistic AI generating educational vocabulary for a language learning app.`;

  const randomCategory =
    WORDS_CATEGORIES[Math.floor(Math.random() * WORDS_CATEGORIES.length)];

  const prompt = `
Generate ${quantity} unique ${lang.toUpperCase()} vocabulary words for CEFR level "${level}" under the topic "${randomCategory}".

Guidelines:
- If applicable, words must be relevant to the topic: "${randomCategory}".
- Only include relevant, translatable vocabulary — no slang, abbreviations, or proper names.
${wordType ? WORD_TYPES_PROMPTS[lang][wordType] : ""}
`;

  return { system, prompt };
};

export const generateVocabularyByLetterPrompt = ({
  lang,
  letter,
  quantity,
  existingWords = [],
  wordType,
}: {
  lang: LanguageCodeType;
  letter: string;
  quantity: number;
  wordType?: WordType;
  existingWords: string[];
}) => {
  const system = `You are a linguistic AI generating useful vocabulary for language learners.`;

  const exclusions = existingWords.length
    ? `- Avoid these words: ${existingWords.join(", ")}`
    : "";

  const prompt = `
Generate ${quantity} unique ${lang.toUpperCase()} language vocabulary words that all include letters "${letter.toUpperCase()}".
Guidelines:
- All words must include combination of letters: "${letter}", or at least '${
    letter[0]
  }' and '${letter[1]}'.
- Provide good, short examples for word use in ${lang.toUpperCase()} language.
- Examples and comments should be written only in ${lang.toUpperCase()} language.
- Avoid dublicate words.
${wordType ? WORD_TYPES_PROMPTS[lang][wordType] : ""}
${exclusions}
`;

  return { system, prompt };
};

export const generateTranslationPrompt = (
  fromLang: LanguageCodeType,
  toLang: LanguageCodeType,
  words: { word: string; id: string }[]
) => {
  const system = `You are an AI translator assisting with language learning vocabulary.`;

  const prompt = `
Translate the following words from **${fromLang.toUpperCase()}** into **${toLang.toUpperCase()}**.

For each word:
- Translate the word into ${toLang.toUpperCase()} language.
- Example of word usage case can be changed to another sentence (more applicable to ${toLang.toUpperCase()} language), but it must be written in ${toLang.toUpperCase()} language.
- All comments and examples must be written in **${toLang.toUpperCase()} language**.

Words to translate:
${words.map((w) => w.word).join(", ")}
  `.trim();

  return { system, prompt };
};

export const generateTranslationConnectionsPrompt = (
  primaryLanguageWords: ShortWordEntry[],
  translationLanguageWords: ShortWordEntry[]
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
- Primary language word id suppose to be wordId1.
- Translation language word id suppose to be wordId2.

Primary Language Words:\n${JSON.stringify(primaryLanguageWords, null, 2)}

Translation Language Words:\n${JSON.stringify(
    translationLanguageWords,
    null,
    2
  )}
`;

  return { system, prompt };
};

export const validateVocabularyWordsPrompt = ({
  lang,
  words,
  wordType,
}: {
  lang: LanguageCodeType;
  words: GetWordType[typeof lang][];
  wordType: WordType;
}) => {
  const system = `You are a ${lang.toUpperCase()} language linguist validating vocabulary for a language learning application.`;

  const wordTypeInstructions = WORD_TYPES_PROMPTS[lang]?.[wordType] ?? "";

  const prompt = `
You are given a list of ${lang.toUpperCase()} vocabulary words used in a language learning application.

Your task is to **validate and correct** each word entry using the following rules:

1. Ensure the **word** is in its correct, base dictionary form.
2. Validate the **grammatical type** is correct and matches the specified type.
3. Ensure the **example sentence** is correct, natural, and in proper ${lang.toUpperCase()} language.
4. Ensure the **comment**, if present, is helpful, relevant, and also written in ${lang.toUpperCase()}.
5. The example must clearly illustrate **how the word is used** in context.
6. Return the corrected entries in the same structure.

${wordTypeInstructions}

Proceed to validate the following entries:
${JSON.stringify(words, null, 2)}
`;

  return { system, prompt };
};
