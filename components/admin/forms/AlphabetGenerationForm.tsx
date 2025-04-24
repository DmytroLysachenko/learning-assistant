"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircleIcon,
  ItalicIcon as AlphabetIcon,
  Loader2,
} from "lucide-react";
import CustomSelect from "@/components/CustomSelect";
import { Input } from "@/components/ui/input";

import type { LanguageCodeType, WordType } from "@/types";
import { WORDS_TYPES_OPTIONS } from "@/constants/ui";
import BatchAndDelayControls from "./BatchAndDelayControls";

// Language options
const LANGUAGE_OPTIONS = [
  { value: "pl", label: "Polish" },
  { value: "ru", label: "Russian" },
];

interface AlphabetGenerationFormExtendedProps {
  isDisabled: boolean;
  batchSize: number;
  delay: number;
  wordType: WordType | "none";
  language: "pl" | "ru";
  translationLanguage: "pl" | "ru";
  total: number;
  setBatchSize: (batchSize: number) => void;
  setDelay: (delay: number) => void;
  setWordType: (wordType: WordType | "none") => void;
  setLanguage: (language: "pl" | "ru") => void;
  setTranslationLanguage: (language: "pl" | "ru") => void;
  setTotal: (total: number) => void;
  onGenerate: () => Promise<void>;
}

const AlphabetGenerationForm = ({
  isDisabled,
  batchSize,
  delay,
  wordType,
  language,
  translationLanguage,
  total,
  setBatchSize,
  setDelay,
  setWordType,
  setLanguage,
  setTranslationLanguage,
  setTotal,
  onGenerate,
}: AlphabetGenerationFormExtendedProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlphabetIcon className="h-5 w-5" />
          Generate Words by Alphabet
        </CardTitle>
        <CardDescription>
          Add new vocabulary words to the database alphabetically
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="language"
                className="text-sm font-medium"
              >
                Language
              </label>
              <CustomSelect
                options={LANGUAGE_OPTIONS}
                currentValue={language}
                isDisabled={isDisabled}
                handleValueChange={(value) =>
                  setLanguage(value as LanguageCodeType)
                }
                placeholder="Select language"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="translationLanguage"
                className="text-sm font-medium"
              >
                Translation Language
              </label>
              <CustomSelect
                options={LANGUAGE_OPTIONS}
                currentValue={translationLanguage}
                isDisabled={isDisabled}
                handleValueChange={(value) =>
                  setTranslationLanguage(value as LanguageCodeType)
                }
                placeholder="Select translation language"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="total"
                className="text-sm font-medium"
              >
                Total Words
              </label>
              <Input
                id="total"
                type="number"
                value={total}
                onChange={(e) => setTotal(Number(e.target.value))}
                disabled={isDisabled}
                placeholder="Enter total words"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="wordType"
                className="text-sm font-medium"
              >
                Word Type
              </label>
              <CustomSelect
                options={WORDS_TYPES_OPTIONS}
                currentValue={wordType}
                isDisabled={isDisabled}
                handleValueChange={(value) =>
                  setWordType(value as typeof wordType)
                }
                placeholder="Select word type"
              />
            </div>
          </div>

          <BatchAndDelayControls
            batchSize={batchSize}
            delay={delay}
            isDisabled={isDisabled}
            setBatchSize={setBatchSize}
            setDelay={setDelay}
          />

          <Alert>
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              {total} words will be generated alphabetically for{" "}
              {
                LANGUAGE_OPTIONS.find((option) => option.value === language)
                  ?.label
              }{" "}
              language with{" "}
              {
                LANGUAGE_OPTIONS.find(
                  (option) => option.value === translationLanguage
                )?.label
              }{" "}
              translations in batches of {batchSize} with a {delay}ms delay
              between batches.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onGenerate}
          disabled={isDisabled}
          className="w-full"
        >
          {isDisabled ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Words Alphabetically"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AlphabetGenerationForm;
