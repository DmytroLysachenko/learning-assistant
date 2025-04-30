import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import PracticeInterface from "@/components/practice/PracticeInterface";
import { LanguageCodeType, PracticeVocabularyWord } from "@/types";
import { SUPPORTED_LANGUAGES } from "@/constants";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";
import { getLanguageData } from "@/lib/utils";
import { eq } from "drizzle-orm";
import { db } from "@/db";

interface PracticePageProps {
  params: Promise<{
    lang: LanguageCodeType;
  }>;
}

const PracticePage = async ({ params }: PracticePageProps) => {
  const { lang } = await params;
  const user = await getUserFromSession();
  const languageName = SUPPORTED_LANGUAGES[lang];

  if (!languageName) {
    redirect("/practice");
  }

  const {
    primaryVocabTable,
    secondaryVocabTable,
    translationTable,
    userWordsTable,
    primaryLanguageWordId,
    secondaryLanguageWordId,
  } = getLanguageData(`${lang}-${user.interfaceLanguage}`);

  const vocabulary = (await db
    .select({
      id: userWordsTable.id,
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
    .where(eq(userWordsTable.userId, user.id))) as PracticeVocabularyWord[];
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
          language={languageName}
        />
      </div>
    </div>
  );
};

export default PracticePage;
