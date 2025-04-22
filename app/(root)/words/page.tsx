import VocabularyTable from "@/components/words/VocabularyTable";
import { db } from "@/db";
import { plVocabulary, ruVocabulary, pl_ru_translations } from "@/db/schema";
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
    db.select({ value: sql<number>`count(*)` }).from(ruVocabulary),
  ]);

  // Filtering condition
  const whereClause = filter
    ? or(ilike(plVocabulary.word, `%${filter}%`))
    : undefined;

  // Count translations with or without filter
  const countQueryBase = db
    .select({ value: sql<number>`count(*)` })
    .from(pl_ru_translations)
    .leftJoin(plVocabulary, eq(pl_ru_translations.wordId1, plVocabulary.id))
    .leftJoin(ruVocabulary, eq(pl_ru_translations.wordId2, ruVocabulary.id));

  const totalCountResult = whereClause
    ? await countQueryBase.where(whereClause)
    : await countQueryBase;

  const totalCount = totalCountResult[0]?.value || 0;

  // Build final filtered + sorted + paginated query
  const dataQuery = db
    .select({
      pl_ru_translations,
      pl_vocabulary: plVocabulary,
      ru_vocabulary: ruVocabulary,
    })
    .from(pl_ru_translations)
    .leftJoin(plVocabulary, eq(pl_ru_translations.wordId1, plVocabulary.id))
    .leftJoin(ruVocabulary, eq(pl_ru_translations.wordId2, ruVocabulary.id))
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
    id: `${entry.pl_ru_translations.id}`,
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
        id: entry.ru_vocabulary!.id,
        word: entry.ru_vocabulary!.word,
        example: entry.ru_vocabulary!.example,
        type: entry.ru_vocabulary!.type,
        difficulty: entry.ru_vocabulary!.difficulty,
        createdAt: entry.ru_vocabulary!.createdAt,
        comment: entry.ru_vocabulary!.comment,
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
