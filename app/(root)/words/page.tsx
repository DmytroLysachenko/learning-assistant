import { db } from "@/db";
import { polishVocabulary, rusVocabulary, translations } from "@/db/schema";
import { eq } from "drizzle-orm";
import React from "react";

const WordsPage = async () => {
  const polishWords = await db.select().from(polishVocabulary);
  const russianWords = await db.select().from(rusVocabulary);
  const entries = await db
    .select()
    .from(translations)
    .leftJoin(polishVocabulary, eq(translations.wordId1, polishVocabulary.id))
    .leftJoin(rusVocabulary, eq(translations.wordId2, rusVocabulary.id))
    .then((entries) =>
      entries.map((entry) => ({
        polishWord: entry.polish_vocabulary!.word ?? "",
        russianWord: entry.rus_vocabulary!.word ?? "",
      }))
    );
  return (
    <div className="w-full flex flex-col justify-center py-4 px-8 gap-4">
      <p>
        Total polish words: <span>{polishWords.length}</span>
      </p>
      <p>
        Total russian words: <span>{russianWords.length}</span>
      </p>
      <p>
        Total translations: <span>{entries.length}</span>
      </p>
      <ul className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
        {entries.map((entry) => (
          <li key={entry.polishWord}>
            {entry.polishWord} - {entry.russianWord}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default WordsPage;
