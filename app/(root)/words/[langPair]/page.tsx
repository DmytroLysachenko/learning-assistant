import VocabularyTable from "@/components/words/VocabularyTable";
import { SUPPORTED_LANGUAGES } from "@/constants";
import { db } from "@/db";
import { vocabTables, translationTables } from "@/db/schema";
import { LanguageCodeType } from "@/types";
import { eq, desc, asc, or, sql, ilike } from "drizzle-orm";
import { redirect } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{
    page?: string;
    size?: string;
    filter?: string;
    sort?: string;
    dir?: string;
  }>;
  params: Promise<{ langPair: string }>;
}

const WordsPage = async ({ searchParams, params }: PageProps) => {
  const { langPair } = await params;

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

  if (!language1 || !language2) {
    redirect("/404");
  }

  const { page, size, filter: filterParam, sort, dir } = await searchParams;

  const currentPage = Number.parseInt(page || "1", 10);
  const pageSize = Number.parseInt(size || "10", 10);
  const filter = filterParam?.trim() || "";

  const sortField = sort || "word";
  const sortDirection = dir === "desc" ? "desc" : "asc";
  const offset = (currentPage - 1) * pageSize;

  // Count of polish/russian words
  const [primaryWordsCount, secondaryWordsCount] = await Promise.all([
    db.select({ value: sql<number>`count(*)` }).from(primaryVocabTable),
    db.select({ value: sql<number>`count(*)` }).from(secondaryVocabTable),
  ]);

  // Filtering condition
  const whereClause = filter
    ? or(ilike(primaryVocabTable.word, `%${filter}%`))
    : undefined;

  // Count translations with or without filter
  const countQueryBase = db
    .select({ value: sql<number>`count(*)` })
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
    .orderBy(
      sortDirection === "asc"
        ? asc(
            sortField === "type"
              ? primaryVocabTable.type
              : sortField === "difficulty"
              ? primaryVocabTable.difficulty
              : primaryVocabTable.word
          )
        : desc(
            sortField === "type"
              ? primaryVocabTable.type
              : sortField === "difficulty"
              ? primaryVocabTable.difficulty
              : primaryVocabTable.word
          )
    )
    .limit(pageSize)
    .offset(offset);

  const results = await dataQuery;

  const entries = results.map((entry) => ({
    id: `${entry.translationTable.id}`,
    words: [
      {
        id: entry.primaryVocabTable!.id,
        word: entry.primaryVocabTable!.word,
        example: entry.primaryVocabTable!.example,
        type: entry.primaryVocabTable!.type,
        difficulty: entry.primaryVocabTable!.difficulty,
        createdAt: entry.primaryVocabTable!.createdAt,
        comment: entry.primaryVocabTable!.comment,
        language: SUPPORTED_LANGUAGES[primaryLanguage],
      },
      {
        id: entry.secondaryVocabTable!.id,
        word: entry.secondaryVocabTable!.word,
        example: entry.secondaryVocabTable!.example,
        type: entry.secondaryVocabTable!.type,
        difficulty: entry.secondaryVocabTable!.difficulty,
        createdAt: entry.secondaryVocabTable!.createdAt,
        comment: entry.secondaryVocabTable!.comment,
        language: SUPPORTED_LANGUAGES[secondaryLanguage],
      },
    ],
  }));

  console.log(entries[0].words);

  return (
    <div className="w-full flex flex-col justify-center py-6 px-4 md:px-8 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Polish Words</h3>
          <p className="text-3xl font-bold text-purple-600">
            {primaryWordsCount[0]?.value || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Russian Words</h3>
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
          />
        </Suspense>
      </div>
    </div>
  );
};

export default WordsPage;
