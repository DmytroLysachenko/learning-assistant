"use server";

import fs from "fs/promises";
import { formatWordsPrompt } from "../ai/prompts";
import { chunk, shuffle } from "lodash";
import { wordSchemas } from "../validations/ai";
import { z } from "zod";
import { generateObject } from "ai";
import { modelFlashLiteExp as model } from "../ai/aiClient";
import { db } from "@/db";
import { plVocabulary } from "@/db/schema";
import { sleep } from "../utils";

export const seedDb = async () => {
  try {
    const schema = wordSchemas["pl"];
    type WordType = z.infer<typeof schema>;
    const text_file = await fs.readFile("basic_forms.txt", "utf-8");
    const lines = text_file.split("\n");
    const words = lines.map((line) =>
      line.split("\t")[0].replace("\r", "").toLocaleLowerCase()
    );

    const existentWords = await db
      .select()
      .from(plVocabulary)
      .then((res) => res.map((w) => w.word.toLocaleLowerCase()));

    const wordsToSeed = words.filter((w) => !existentWords.includes(w));

    const wordsBatches = chunk(shuffle(wordsToSeed), 50);
    let total = 0;

    for (const batch of wordsBatches) {
      try {
        const { prompt, system } = formatWordsPrompt({
          words: batch,
          language: "pl",
        });

        const result = await generateObject<WordType>({
          model,
          mode: "tool",
          output: "array",
          schema: schema,
          system,
          prompt,
        });

        if (result.object.length > 0) {
          await db.insert(plVocabulary).values(result.object);
        }

        console.log("Added:", result.object.length);
        total += result.object.length;
        await sleep(5000);
      } catch (error) {
        console.log(error);
        continue;
      }
    }

    console.log("Completed, Total:", total);
  } catch (error) {
    console.log(error);
  }
};
