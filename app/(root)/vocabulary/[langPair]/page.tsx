import { count, eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Suspense } from "react";

import { auth } from "@/auth";
import VocabularyTable from "@/components/vocabulary/VocabularyTable";
import { SUPPORTED_LANGUAGES } from "@/constants";
import { db } from "@/db";
import { getUserByEmail } from "@/lib/actions/user";
import { buildWhereClause } from "@/lib/utils/buildWhereClause";
import { getSortOrder } from "@/lib/utils/getSortField";
import { parseSearchParams } from "@/lib/utils/parseSearchParams";
import { getLanguageData } from "@/lib/utils";

interface VocabularyPageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
    filter?: string;
    sort?: string;
    dir?: string;
  }>;
  params: Promise<{ langPair: string }>;
}

const VocabularyPage = async ({
  searchParams,
  params,
}: VocabularyPageProps) => {
  const { langPair } = await params;

  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/");
  }

  const {
    data: { id: userId },
  } = await getUserByEmail(session.user.email);

  const {
    primaryLanguage,
    secondaryLanguage,
    primaryVocabTable,
    secondaryVocabTable,
    translationTable,
    primaryLanguageWordId,
    secondaryLanguageWordId,
  } = getLanguageData(langPair);

  const { currentPage, pageSize, filter, sortField, sortDirection, offset } =
    await parseSearchParams(searchParams);

  const [primaryWordsCount, secondaryWordsCount] = await Promise.all([
    db.select({ value: count() }).from(primaryVocabTable),
    db.select({ value: count() }).from(secondaryVocabTable),
  ]);

  const whereClause = buildWhereClause(primaryVocabTable, filter);

  const countQueryBase = db
    .select({ value: count() })
    .from(translationTable)
    .leftJoin(
      primaryVocabTable,
      eq(translationTable[primaryLanguageWordId], primaryVocabTable.id)
    )
    .leftJoin(
      secondaryVocabTable,
      eq(translationTable[secondaryLanguageWordId], secondaryVocabTable.id)
    );

  const totalCountResult = whereClause
    ? await countQueryBase.where(whereClause)
    : await countQueryBase;

  const totalCount = totalCountResult[0]?.value || 0;

  // Build final filtered + sorted + paginated query
  const dataQuery = db
    .select({
      translationTable,
      primaryVocabTable: primaryVocabTable,
      secondaryVocabTable: secondaryVocabTable,
    })
    .from(translationTable)
    .leftJoin(
      primaryVocabTable,
      eq(translationTable[primaryLanguageWordId], primaryVocabTable.id)
    )
    .leftJoin(
      secondaryVocabTable,
      eq(translationTable[secondaryLanguageWordId], secondaryVocabTable.id)
    )
    .where(whereClause)
    .orderBy(getSortOrder(sortField, sortDirection, primaryVocabTable))
    .limit(pageSize)
    .offset(offset);

  const results = await dataQuery;

  const entries = results.map((entry) => ({
    id: `${entry.translationTable.id}`,
    primaryWord: {
      id: entry.primaryVocabTable!.id,
      word: entry.primaryVocabTable!.word,
      example: entry.primaryVocabTable!.example,
      type: entry.primaryVocabTable!.type,
      difficulty: entry.primaryVocabTable!.difficulty,
      createdAt: entry.primaryVocabTable!.createdAt,
      comment: entry.primaryVocabTable!.comment,
      primary: true,
      language: primaryLanguage,
    },
    secondaryWord: {
      id: entry.secondaryVocabTable!.id,
      word: entry.secondaryVocabTable!.word,
      example: entry.secondaryVocabTable!.example,
      type: entry.secondaryVocabTable!.type,
      difficulty: entry.secondaryVocabTable!.difficulty,
      createdAt: entry.secondaryVocabTable!.createdAt,
      comment: entry.secondaryVocabTable!.comment,
      language: secondaryLanguage,
    },
  }));

  return (
    <div className="w-full flex flex-col justify-center py-6 px-4 md:px-8 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">
            {SUPPORTED_LANGUAGES[primaryLanguage]} Words
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {primaryWordsCount[0]?.value || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">
            {SUPPORTED_LANGUAGES[secondaryLanguage]} Words
          </h3>
          <p className="text-3xl font-bold text-purple-600">
            {secondaryWordsCount[0]?.value || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Translations</h3>
          <p className="text-3xl font-bold text-purple-600">{totalCount}</p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-bold text-gray-900 mb-4">Vocabulary</h2>
        <Suspense fallback={<div>Loading vocabulary...</div>}>
          <VocabularyTable
            wordPairs={entries}
            totalCount={totalCount}
            currentPage={currentPage}
            pageSize={pageSize}
            userId={userId}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default VocabularyPage;
