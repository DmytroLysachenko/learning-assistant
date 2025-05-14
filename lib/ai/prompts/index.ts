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
  wordType?: WordType;
  existingWords: string[];
}) => {
  const system = `You are a linguistic AI generating useful vocabulary for language learners.`;

  const exclusions = existingWords.length
    ? `- Avoid these words: ${existingWords.join(", ")}`
    : "";

  const prompt = `
Generate ${quantity} unique vocabulary words in the ${
    SUPPORTED_LANGUAGES[language]
  } language that include the combination of letters "${letter.toUpperCase()}" (the two letters together, in that order).
Guidelines:
- All words must include the letter combination: "${letter}" (the two letters together, in order).
- If that is not possible, generate words that include either "${
    letter[0]
  }" or "${letter[1]}" separately.
- If neither is possible, just generate unique words in ${
    SUPPORTED_LANGUAGES[language]
  }.
- Provide short, useful example sentences for each word, written only in ${
    SUPPORTED_LANGUAGES[language]
  }.
- Avoid duplicate words.
- Only use the ${SUPPORTED_LANGUAGES[language]} language.
- Comment should be word explanation without using word itself, if applicable.
${wordType ? WORD_TYPES_PROMPTS[language][wordType] : ""}
${exclusions}
`;

  return { system, prompt };
};

export const generateTranslationPrompt = (
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
  const system = `You are an AI translator assisting with language learning vocabulary.`;

  const prompt = `
Translate the following words from **${
    SUPPORTED_LANGUAGES[fromLang]
  }** into **${SUPPORTED_LANGUAGES[toLang]}**.

For each word:
- Translate the word into ${SUPPORTED_LANGUAGES[toLang]} language.
- Translation must be semantic and correct.
- Example of word usage case can be changed to another sentence (more applicable to ${
    SUPPORTED_LANGUAGES[toLang]
  } language).
- All content must be written only in **${
    SUPPORTED_LANGUAGES[toLang]
  } language**.
- Comment should be word explanation without using word itself, if applicable.
- Pay attention to emphasis in the words where meaning depends on it.

Words to translate:
${JSON.stringify(words, null, 2)}
  `;

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
- On output every word should have at leas one connection.

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

For each entry:
- Ensure the **word** is in its correct base form (dictionary form).
- Ensure the **type** is accurate. If the word does not match the required type, correct it.
- Ensure the **difficulty level** reflects real-world frequency and learner familiarity (A0 = basic, C2 = highly advanced).
- Ensure the **example sentence** is correct, natural, and demonstrates how the word is used in context.
- Ensure the **comment** is helpful and explaining the word without using it.
- All content must be in ${SUPPORTED_LANGUAGES[language]} language only.
- Changes should not affect primary word meaning.
- Correct only words which really require corrections.

${wordTypeInstructions}

Correct all errors. Only return valid, corrected entries in the same format.

Data to validate:
${JSON.stringify(words, null, 2)}
`;

  return { system, prompt };
};

export const validateVocabularyTranslationWordsPrompt = ({
  fromLanguage,
  toLanguage,
  entries,
  wordType,
}: {
  fromLanguage: LanguageCodeType;
  toLanguage: LanguageCodeType;
  entries: {
    fromLanguageWord: GetWordType[typeof fromLanguage];
    toLanguageWord: GetWordType[typeof toLanguage];
  }[];
  wordType: WordType;
}) => {
  const system = `You are a professional linguist fluent in both ${SUPPORTED_LANGUAGES[fromLanguage]} and ${SUPPORTED_LANGUAGES[toLanguage]}, verifying bilingual vocabulary data for a language learning app.`;

  const wordTypeInstructions = WORD_TYPES_PROMPTS[toLanguage]?.[wordType] ?? "";

  const prompt = `
You are validating a list of bilingual vocabulary entries that map words from ${
    SUPPORTED_LANGUAGES[fromLanguage]
  } to ${SUPPORTED_LANGUAGES[toLanguage]}.

Each entry contains:
- A word in ${
    SUPPORTED_LANGUAGES[fromLanguage]
  } with its base form, word type, difficulty level, example sentence, and comment.
- A corresponding translation in ${
    SUPPORTED_LANGUAGES[toLanguage]
  } with similar structure.

Your task is to:
- Ensure the **translated word** in ${
    SUPPORTED_LANGUAGES[toLanguage]
  } accurately matches the meaning and form of the ${
    SUPPORTED_LANGUAGES[fromLanguage]
  } word.
- Ensure the **word type** in ${
    SUPPORTED_LANGUAGES[toLanguage]
  } is correct and consistent with the source.
- Ensure the **difficulty level** reflects usage frequency and learner familiarity in ${
    SUPPORTED_LANGUAGES[toLanguage]
  }.
- Ensure the **example sentence** is natural and correctly demonstrates the word in context.
- Ensure the **comment** helps explain the word’s meaning **without reusing the word itself**.
- All ${SUPPORTED_LANGUAGES[toLanguage]} content must be in ${
    SUPPORTED_LANGUAGES[toLanguage]
  } language only.
- Correct only words which really require corrections.

${wordTypeInstructions}

Correct all mistakes. Return only the **corrected \`toLanguageWord\` array**, preserving the original structure.

Data to validate:
${JSON.stringify(entries, null, 2)}
`;

  return { system, prompt };
};

export const formatWordsPrompt = ({
  words,
  language,
}: {
  words: string[];
  language: LanguageCodeType;
}) => {
  const system = `You are a linguistic AI transforming vocabulary into structured learning data for a language learning app.`;

  const prompt = `
Given the following list of vocabulary words in ${
    SUPPORTED_LANGUAGES[language]
  } language, generate a structured object for each word.

Guidelines:
- Use only the ${
    SUPPORTED_LANGUAGES[language]
  } language in the values (no English).
- Definitions, examples and comment must be natural and native-sounding.
- Ensure examples clearly demonstrate the meaning of the word.
- Skip words that are not in the ${SUPPORTED_LANGUAGES[language]} language.
- Skip words that should not be included in the vocabulary for any reason.
- Skip abbreviations, slang, or proper names.
- Comment should be word explanation without using word itself, if applicable.

Words to process:
${words.map((w) => `- ${w}`).join("\n")}
`;

  return { system, prompt };
};

export const validateTranslationConnectionsPrompt = ({
  fromLanguage,
  toLanguage,
  entries,
}: {
  fromLanguage: LanguageCodeType;
  toLanguage: LanguageCodeType;
  entries: {
    id: string;
    fromLanguageWord: {
      word: string | null;
      comment: string | null;
      example: string | null;
    };
    toLanguageWord: {
      word: string | null;
      comment: string | null;
      example: string | null;
    };
  }[];
}) => {
  const system = `You are a professional bilingual linguist fluent in ${SUPPORTED_LANGUAGES[fromLanguage]} and ${SUPPORTED_LANGUAGES[toLanguage]}. You are evaluating translation pairs for a language learning application.`;

  const prompt = `
You are validating a list of ${SUPPORTED_LANGUAGES[fromLanguage]} to ${
    SUPPORTED_LANGUAGES[toLanguage]
  } translation pairs.

For each pair:
- Determine whether the translation is **accurate and contextually correct**.
- If the translation is strongly **incorrect or mismatched**, mark it as invalid.
- Only decide if the connection is valid or not and describe the reason.
- Only return a list of entries that are strongly **invalid**.
- Strongly incorrect or mismatched means that the translation is totally wrong and cannot be matched in any logic way.
- Small differences in meaning, form or comments are not considered incorrect.
- If no invalid translations are found, return an empty array.


Data:
${JSON.stringify(entries, null, 2)}
`;

  return { system, prompt };
};
