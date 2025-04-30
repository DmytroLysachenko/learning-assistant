import { LanguageOption } from "@/types";
import { WORD_TYPES } from ".";
import { capitalize } from "lodash";

export const LEVEL_OPTIONS = [
  { value: "A0", label: "A0" },
  { value: "A1", label: "A1" },
  { value: "A2", label: "A2" },
  { value: "B1", label: "B1" },
  { value: "B2", label: "B2" },
  { value: "C1", label: "C1" },
  { value: "C2", label: "C2" },
];

export const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "pl", label: "Polish" },
  { value: "ru", label: "Russian" },
];

export const WORDS_TYPES_OPTIONS = [
  ...Object.keys(WORD_TYPES["pl"]).map((type) => ({
    value: type,
    label: capitalize(type),
  })),
];
