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

import { WordType } from "@/types";
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
  setBatchSize: (batchSize: number) => void;
  setDelay: (delay: number) => void;
  setWordType: (wordType: WordType | "none") => void;
  setLanguage: (language: "pl" | "ru") => void;
  onGenerate: () => Promise<void>;
}

const AlphabetGenerationForm = ({
  isDisabled,
  batchSize,
  delay,
  wordType,
  language,
  setBatchSize,
  setDelay,
  setWordType,
  setLanguage,
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
                handleValueChange={(value) => setLanguage(value as "pl" | "ru")}
                placeholder="Select language"
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
              Words will be generated alphabetically for{" "}
              {language === "pl" ? "Polish" : "Russian"} language in batches of{" "}
              {batchSize} with a {delay}ms delay between batches.
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
