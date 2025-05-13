import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { asc, eq } from "drizzle-orm";

import PracticeInterface from "@/components/practice/PracticeInterface";
import { LanguageCodeType, PracticeVocabularyWord } from "@/types";
import { SUPPORTED_LANGUAGES } from "@/constants";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";
import { getLanguageData } from "@/lib/utils";
import { db } from "@/db";

interface PracticePageProps {
  params: Promise<{
    language: LanguageCodeType;
  }>;
  searchParams: Promise<{ category?: "learning" | "reviewing" | "mastered" }>;
}
const categoryOptions = ["learning", "reviewing", "mastered"];

const PracticePage = async ({ params, searchParams }: PracticePageProps) => {
  const [{ language }, { category }, user] = await Promise.all([
    params,
    searchParams,
    getUserFromSession(),
  ]);

  const languageName = SUPPORTED_LANGUAGES[language];

  if (
    !SUPPORTED_LANGUAGES[language] ||
    !category ||
    !categoryOptions.includes(category)
  ) {
    redirect("/practice");
  }

  const {
    primaryVocabTable,
    secondaryVocabTable,
    translationTable,
    userWordsTable,
    primaryLanguageWordId,
    secondaryLanguageWordId,
  } = getLanguageData(`${language}-${user.interfaceLanguage}`);

  const vocabulary = (await db
    .select({
      recordId: userWordsTable.id,
      word: secondaryVocabTable.word,
      translation: primaryVocabTable.word,
      type: secondaryVocabTable.type,
      status: userWordsTable.status,
    })
    .from(userWordsTable)
    .leftJoin(
      primaryVocabTable,
      eq(userWordsTable.wordId, primaryVocabTable.id)
    )
    .leftJoin(
      translationTable,
      eq(translationTable[primaryLanguageWordId], primaryVocabTable.id)
    )
    .leftJoin(
      secondaryVocabTable,
      eq(translationTable[secondaryLanguageWordId], secondaryVocabTable.id)
    )
    .where(eq(userWordsTable.userId, user.id))
    .orderBy(asc(userWordsTable.correctAnswersCount))
    .limit(10)) as PracticeVocabularyWord[];

  return (
    <div className="w-full flex flex-col justify-center py-6 px-4 md:px-8 gap-6">
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Link
              href="/practice"
              className="p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 text-gray-500" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">
              Practice {languageName}
            </h1>
          </div>
          <div className="text-sm text-gray-500">
            <span className="font-medium">{vocabulary.length}</span> words in
            your vocabulary
          </div>
        </div>

        <PracticeInterface
          vocabulary={vocabulary}
          language={language}
        />
      </div>
    </div>
  );
};

export default PracticePage;
