import { count } from "drizzle-orm";
import { Suspense } from "react";
import { Loader } from "lucide-react";

import { SUPPORTED_LANGUAGES } from "@/constants";
import { db } from "@/db";
import { getLanguageData, parseSearchParams } from "@/lib/utils";
import GeneralVocabularyTable from "@/components/vocabulary/GeneralVocabularyTable";

interface VocabularyPageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
    filter?: string;
    wordType?: string;
    sort?: string;
    dir?: string;
  }>;
  params: Promise<{ langPair: string }>;
}

const VocabularyPage = async ({
  searchParams,
  params,
}: VocabularyPageProps) => {
  const [{ langPair }, parsedSearchParams] = await Promise.all([
    params,
    parseSearchParams(searchParams),
  ]);

  const {
    primaryLanguage,
    secondaryLanguage,
    primaryVocabTable,
    secondaryVocabTable,
    translationTable,
  } = getLanguageData(langPair);

  const [primaryWordsCount, secondaryWordsCount, totalCount] =
    await Promise.all([
      db
        .select({ value: count() })
        .from(primaryVocabTable)
        .then((res) => res[0].value || 0),
      db
        .select({ value: count() })
        .from(secondaryVocabTable)
        .then((res) => res[0].value || 0),
      db
        .select({ value: count() })
        .from(translationTable)
        .then((res) => res[0].value || 0),
    ]);

  return (
    <div className="w-full flex flex-col justify-center py-6 px-4 md:px-8 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">
            {SUPPORTED_LANGUAGES[primaryLanguage]} Words
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {primaryWordsCount}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">
            {SUPPORTED_LANGUAGES[secondaryLanguage]} Words
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {secondaryWordsCount}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Translations</h3>
          <p className="text-3xl font-bold text-purple-600">{totalCount}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Vocabulary</h2>
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-[300px]">
              <Loader className="animate-spin text-primary size-8" />
            </div>
          }
        >
          <GeneralVocabularyTable
            langPair={langPair}
            searchParams={parsedSearchParams}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default VocabularyPage;
