// db/types.ts
import { WordType } from "@/types";
import * as schema from "./schema";
import { InferSelectModel, InferInsertModel } from "drizzle-orm";

export type User = InferSelectModel<typeof schema.users>;

type RuWord = InferSelectModel<typeof schema.ruVocabulary>;
type PlWord = InferSelectModel<typeof schema.plVocabulary>;

export type GetWordType = {
  ru: RuWord;
  pl: PlWord;
};

export type CreateUserType = InferInsertModel<typeof schema.users>;

type NewRuWord = InferInsertModel<typeof schema.ruVocabulary>;
type NewPlWord = InferInsertModel<typeof schema.plVocabulary>;

export type CreateWordType = {
  ru: NewRuWord;
  pl: NewPlWord;
};

type PlWordType = (typeof schema.polishWordTypeEnum.enumValues)[number];
type RuWordType = (typeof schema.russianWordTypeEnum.enumValues)[number];

export type LanguageWordType = {
  ru: Record<WordType, RuWordType>;
  pl: Record<WordType, PlWordType>;
};
