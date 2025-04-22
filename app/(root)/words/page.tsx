import VocabularyTable from "@/components/words/VocabularyTable";
import { db } from "@/db";
import { plVocabulary, rusVocabulary, translations } from "@/db/schema";
import { eq, desc, asc, or, sql, ilike } from "drizzle-orm";
import { Suspense } from "react";

interface PageProps {
  searchParams: {
    page?: string;
    size?: string;
    filter?: string;
    sort?: string;
    dir?: string;
  };
}

const WordsPage = async ({ searchParams }: PageProps) => {
  // Defaults
  const { page, size, filter: filterParam, sort, dir } = await searchParams;

  const currentPage = Number.parseInt(page || "1", 10);
  const pageSize = Number.parseInt(size || "10", 10);
  const filter = filterParam?.trim() || "";

  const sortField = sort || "word";
  const sortDirection = dir === "desc" ? "desc" : "asc";
  const offset = (currentPage - 1) * pageSize;

  // Count of polish/russian words
  const [polishWordsCount, russianWordsCount] = await Promise.all([
    db.select({ value: sql<number>`count(*)` }).from(plVocabulary),
    db.select({ value: sql<number>`count(*)` }).from(rusVocabulary),
  ]);

  // Filtering condition
  const whereClause = filter
    ? or(ilike(plVocabulary.word, `%${filter}%`))
    : undefined;

  // Count translations with or without filter
  const countQueryBase = db
    .select({ value: sql<number>`count(*)` })
    .from(translations)
    .leftJoin(plVocabulary, eq(translations.wordId1, plVocabulary.id))
    .leftJoin(rusVocabulary, eq(translations.wordId2, rusVocabulary.id));

  const totalCountResult = whereClause
    ? await countQueryBase.where(whereClause)
    : await countQueryBase;

  const totalCount = totalCountResult[0]?.value || 0;

  // Build final filtered + sorted + paginated query
  const dataQuery = db
    .select({
      translations,
      pl_vocabulary: plVocabulary,
      rus_vocabulary: rusVocabulary,
    })
    .from(translations)
    .leftJoin(plVocabulary, eq(translations.wordId1, plVocabulary.id))
    .leftJoin(rusVocabulary, eq(translations.wordId2, rusVocabulary.id))
    .where(whereClause)
    .orderBy(
      sortDirection === "asc"
        ? asc(
            sortField === "type"
              ? plVocabulary.type
              : sortField === "difficulty"
              ? plVocabulary.difficulty
              : plVocabulary.word
          )
        : desc(
            sortField === "type"
              ? plVocabulary.type
              : sortField === "difficulty"
              ? plVocabulary.difficulty
              : plVocabulary.word
          )
    )
    .limit(pageSize)
    .offset(offset);

  const results = await dataQuery;

  const entries = results.map((entry) => ({
    id: `${entry.translations.id}`,
    words: [
      {
        id: entry.pl_vocabulary!.id,
        word: entry.pl_vocabulary!.word,
        example: entry.pl_vocabulary!.example,
        type: entry.pl_vocabulary!.type,
        difficulty: entry.pl_vocabulary!.difficulty,
        createdAt: entry.pl_vocabulary!.createdAt,
        comment: entry.pl_vocabulary!.comment,
        language: "polish",
      },
      {
        id: entry.rus_vocabulary!.id,
        word: entry.rus_vocabulary!.word,
        example: entry.rus_vocabulary!.example,
        type: entry.rus_vocabulary!.type,
        difficulty: entry.rus_vocabulary!.difficulty,
        createdAt: entry.rus_vocabulary!.createdAt,
        comment: entry.rus_vocabulary!.comment,
        language: "russian",
      },
    ],
  }));

  return (
    <div className="w-full flex flex-col justify-center py-6 px-4 md:px-8 gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Polish Words</h3>
          <p className="text-3xl font-bold text-purple-600">
            {polishWordsCount[0]?.value || 0}
          </p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Russian Words</h3>
          <p className="text-3xl font-bold text-purple-600">
            {russianWordsCount[0]?.value || 0}
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
