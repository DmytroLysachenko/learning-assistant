"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CheckCircle, Loader2 } from "lucide-react";
import CustomSelect from "@/components/CustomSelect";

import type { WordType } from "@/types";
import { LANGUAGE_OPTIONS, WORDS_TYPES_OPTIONS } from "@/constants/ui";

// Language options

interface ValidationFormProps {
  isValidating: boolean;
  language: "pl" | "ru";
  wordType: WordType | "none";
  setLanguage: (language: "pl" | "ru") => void;
  setWordType: (wordType: WordType | "none") => void;
  onValidate: () => Promise<void>;
}

const ValidationForm = ({
  isValidating,
  language,
  wordType,
  setLanguage,
  setWordType,
  onValidate,
}: ValidationFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Vocabulary Validation
        </CardTitle>
        <CardDescription>
          Validate vocabulary entries for correctness and completeness
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
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
              isDisabled={isValidating}
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
              isDisabled={isValidating}
              handleValueChange={(value) =>
                setWordType(value as WordType | "none")
              }
              placeholder="Select word type"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Select a specific word type to validate
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button
          onClick={onValidate}
          disabled={isValidating || wordType === "none"}
          className="w-full"
        >
          {isValidating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Validating...
            </>
          ) : (
            "Start Validation"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ValidationForm;
