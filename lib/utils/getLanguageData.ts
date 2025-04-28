import { SUPPORTED_LANGUAGES } from "@/constants";
import { translationTables, vocabTables } from "@/constants/tables";
import { LanguageCodeType, LanguageData } from "@/types";
import { redirect } from "next/navigation";

export const getLanguageData = (langPair: string): LanguageData => {
  const [primaryLanguage, secondaryLanguage] = langPair.split(
    "-"
  ) as LanguageCodeType[];

  if (
    !Object.keys(SUPPORTED_LANGUAGES).includes(primaryLanguage) ||
    !Object.keys(SUPPORTED_LANGUAGES).includes(secondaryLanguage)
  ) {
    redirect("/404");
  }

  const [language1, language2] = langPair.split("-").sort();

  if (!language1 || !language2) {
    redirect("/404");
  }

  const primaryVocabTable = vocabTables[primaryLanguage];
  const secondaryVocabTable = vocabTables[secondaryLanguage];

  const translationKey =
    `${language1}_${language2}` as keyof typeof translationTables;

  const translationTable = translationTables[translationKey];

  if (!primaryVocabTable || !secondaryVocabTable || !translationTable) {
    redirect("/404");
  }

  const primaryLanguageWordId =
    primaryLanguage === language1 ? "wordId1" : "wordId2";
  const secondaryLanguageWordId =
    secondaryLanguage === language1 ? "wordId1" : "wordId2";

  return {
    primaryLanguage,
    secondaryLanguage,
    primaryVocabTable,
    secondaryVocabTable,
    translationTable,
    primaryLanguageWordId,
    secondaryLanguageWordId,
  };
};
