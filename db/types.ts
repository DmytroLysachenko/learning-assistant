import { WordType } from "@/types";
import * as schema from "./schema";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type User = InferSelectModel<typeof schema.users>;

type RuWord = InferSelectModel<typeof schema.ruVocabulary>;
type PlWord = InferSelectModel<typeof schema.plVocabulary>;
type EnWord = InferSelectModel<typeof schema.enVocabulary>;

export type GetWordType = {
  ru: RuWord;
  pl: PlWord;
  en: EnWord;
};

export type CreateUserType = InferInsertModel<typeof schema.users>;

type NewRuWord = InferInsertModel<typeof schema.ruVocabulary>;
type NewPlWord = InferInsertModel<typeof schema.plVocabulary>;
type NewEnWord = InferInsertModel<typeof schema.enVocabulary>;

export type CreateWordType = {
  ru: NewRuWord;
  pl: NewPlWord;
  en: NewEnWord;
};

type PlWordType = (typeof schema.polishWordTypeEnum.enumValues)[number];
type RuWordType = (typeof schema.russianWordTypeEnum.enumValues)[number];
type EnWordType = (typeof schema.englishWordTypeEnum.enumValues)[number];

export type LanguageWordType = {
  ru: Record<WordType, RuWordType>;
  pl: Record<WordType, PlWordType>;
  en: Record<WordType, EnWordType>;
};

export type UpdateUserWordType = Pick<
  InferInsertModel<typeof schema.userPolishWords | typeof schema.userRuWords>,
  "status" | "lastReviewedAt" | "correctAnswersCount" | "wordId" | "userId"
>;
