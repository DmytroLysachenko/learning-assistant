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
import { Input } from "@/components/ui/input";
import { AlertCircleIcon, Loader2, Upload } from "lucide-react";
import CustomSelect from "@/components/CustomSelect";
import type { LanguageCodeType, LanguageLevelsType, WordType } from "@/types";
import {
  LANGUAGE_OPTIONS,
  LEVEL_OPTIONS,
  WORDS_TYPES_OPTIONS,
} from "@/constants/ui";
import BatchAndDelayControls from "./BatchAndDelayControls";

interface TopicGenerationFormProps {
  isDisabled: boolean;
  level: LanguageLevelsType | "random";
  quantity: number;
  batchSize: number;
  delay: number;
  wordType: WordType | "none";
  language: "pl" | "ru";
  translationLanguage: "pl" | "ru";
  setLevel: (level: LanguageLevelsType | "random") => void;
  setQuantity: (quantity: number) => void;
  setBatchSize: (batchSize: number) => void;
  setDelay: (delay: number) => void;
  setWordType: (wordType: WordType | "none") => void;
  setLanguage: (language: "pl" | "ru") => void;
  setTranslationLanguage: (language: "pl" | "ru") => void;
  onGenerate: () => Promise<void>;
}

const TopicGenerationForm = ({
  isDisabled,
  level,
  quantity,
  batchSize,
  delay,
  wordType,
  language,
  translationLanguage,
  setLevel,
  setQuantity,
  setBatchSize,
  setDelay,
  setWordType,
  setLanguage,
  setTranslationLanguage,
  onGenerate,
}: TopicGenerationFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Generate Words by Topic
        </CardTitle>
        <CardDescription>
          Add new vocabulary words to the database based on topics
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="level"
                className="text-sm font-medium"
              >
                Language Level
              </label>
              <CustomSelect
                options={LEVEL_OPTIONS}
                currentValue={level}
                isDisabled={isDisabled}
                handleValueChange={(value) => setLevel(value as typeof level)}
                placeholder="Select level"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="quantity"
                className="text-sm font-medium"
              >
                Number of Words
              </label>
              <Input
                id="quantity"
                placeholder="Enter number of words"
                type="number"
                disabled={isDisabled}
                value={quantity}
                onChange={(e) => {
                  setQuantity(Number(e.target.value));
                }}
              />
            </div>
          </div>

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
                setWordType(value as WordType | "none")
              }
              placeholder="Select word type"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Select a specific word type or leave as &quot;Any type&quot; to
              generate mixed vocabulary
            </p>
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
              {quantity} words will be generated in batches of {batchSize} with
              a {delay}ms delay between batches. Language:{" "}
              {language.toUpperCase()}, Translation:{" "}
              {translationLanguage.toUpperCase()}.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onGenerate}
          disabled={isDisabled || quantity <= 0}
          className="w-full"
        >
          {isDisabled ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Words by Topic"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default TopicGenerationForm;
