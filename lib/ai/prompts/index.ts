import {
  SUPPORTED_LANGUAGES,
  WORD_TYPES_PROMPTS,
  WORDS_CATEGORIES,
} from "@/constants";
import { GetWordType } from "@/db/types";
import { LanguageCodeType, ShortWordEntry, WordType } from "@/types";

export const generateVocabularyByTopicPrompt = ({
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
  const system = `You are a linguistic AI generating educational vocabulary for a language learning app.`;

  const randomCategory =
    WORDS_CATEGORIES[Math.floor(Math.random() * WORDS_CATEGORIES.length)];

  const prompt = `
Generate ${quantity} unique ${language.toUpperCase()} vocabulary words for CEFR level "${level}" under the topic "${randomCategory}".

Guidelines:
- If applicable, words must be relevant to the topic: "${randomCategory}".
- Only include relevant, translatable vocabulary — no slang, abbreviations, or proper names.
${wordType ? WORD_TYPES_PROMPTS[language][wordType] : ""}
`;

  return { system, prompt };
};

export const generateVocabularyByLetterPrompt = ({
  language,
  letter,
  quantity,
  existingWords = [],
  wordType,
}: {
  language: LanguageCodeType;
  letter: string; // always two letters, like 'st', 'br', etc.
  quantity: number;
  wordType: WordType;
  existingWords: string[];
}) => {
  const system = `You are a linguistic AI generating useful vocabulary for language learners.`;

  const exclusions = existingWords.length
    ? `- Avoid these words: ${existingWords.join(", ")}`
    : "";

  const prompt = `
Generate ${quantity} unique vocabulary words in the ${language.toUpperCase()} language that include the combination of letters "${letter.toUpperCase()}" (the two letters together, in that order).
Guidelines:
- All words must include the letter combination: "${letter}" (the two letters together, in order).
- If that is not possible, generate words that include either "${
    letter[0]
  }" or "${letter[1]}" separately.
- If neither is possible, just generate unique words in ${language.toUpperCase()}.
- Provide short, useful example sentences for each word, written only in ${language.toUpperCase()}.
- Avoid duplicate words.
- Only use the ${language.toUpperCase()} language.
${WORD_TYPES_PROMPTS[language][wordType]}
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
  language,
  words,
  wordType,
}: {
  language: LanguageCodeType;
  words: GetWordType[LanguageCodeType][];
  wordType: WordType;
}) => {
  const system = `You are a professional ${SUPPORTED_LANGUAGES[language]} linguist verifying vocabulary data for a language learning app.`;

  const wordTypeInstructions = WORD_TYPES_PROMPTS[language]?.[wordType] ?? "";

  const prompt = `
You are validating a list of ${
    SUPPORTED_LANGUAGES[language]
  } language vocabulary entries.

🔍 For each entry:
- Ensure the **word** is in its correct base form (dictionary form).
- Ensure the **type** is accurate. If the word does not match the required type, correct it.
- Ensure the **difficulty level** reflects real-world frequency and learner familiarity (A0 = basic, C2 = highly advanced).
- Ensure the **example sentence** is correct, natural, and demonstrates how the word is used in context.
- Ensure the **comment** (if present) is helpful.
- All content must be in ${SUPPORTED_LANGUAGES[language]} language only.

${wordTypeInstructions}

✏️ Correct all errors. Only return valid, corrected entries in the same format.

Data to validate:
${JSON.stringify(words, null, 2)}
`;

  return { system, prompt };
};
