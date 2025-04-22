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
import { Slider } from "../ui/slider";
import { LanguageLevelsType, WordType } from "@/types";
import { LEVEL_OPTIONS, WORDS_TYPES_OPTIONS } from "@/constants";

interface WordGenerationFormProps {
  generating: boolean;
  level: string;
  quantity: number;
  batchSize: number;
  delay: number;
  wordType: WordType;
  setLevel: (level: LanguageLevelsType | "random") => void;
  setQuantity: (quantity: number) => void;
  setBatchSize: (batchSize: number) => void;
  setDelay: (delay: number) => void;
  setWordType: (wordType: WordType) => void;
  onGenerate: (isRandomLevel?: boolean) => Promise<void>;
}

const WordGenerationForm = ({
  generating,
  level,
  quantity,
  batchSize,
  delay,
  wordType,
  setLevel,
  setQuantity,
  setBatchSize,
  setDelay,
  setWordType,
  onGenerate,
}: WordGenerationFormProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Generate Vocabulary
        </CardTitle>
        <CardDescription>
          Add new vocabulary words to the database
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
                isDisabled={generating}
                handleValueChange={(value) =>
                  setLevel(value as LanguageLevelsType | "random")
                }
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
                disabled={generating}
                value={quantity}
                onChange={(e) => {
                  setQuantity(Number(e.target.value));
                }}
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
              currentValue={wordType || ""}
              isDisabled={generating}
              handleValueChange={(value) => setWordType(value as WordType)}
              placeholder="Select word type"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Select a specific word type or leave as &quot;Any type&quot; to
              generate mixed vocabulary
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="batchSize"
                  className="text-sm font-medium"
                >
                  Batch Size: {batchSize}
                </label>
                <span className="text-xs text-muted-foreground">
                  Words per batch
                </span>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-xs">10</span>
                <Slider
                  id="batchSize"
                  disabled={generating}
                  value={[batchSize]}
                  min={10}
                  max={100}
                  step={5}
                  onValueChange={(value) => setBatchSize(value[0])}
                  className="flex-1"
                />
                <span className="text-xs">100</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="delay"
                  className="text-sm font-medium"
                >
                  Delay: {delay}ms
                </label>
                <span className="text-xs text-muted-foreground">
                  Time between batches
                </span>
              </div>
              <div className="flex gap-4 items-center">
                <span className="text-xs">1000ms</span>
                <Slider
                  id="delay"
                  disabled={generating}
                  value={[delay]}
                  min={1000}
                  max={10000}
                  step={500}
                  onValueChange={(value) => setDelay(value[0])}
                  className="flex-1"
                />
                <span className="text-xs">10000ms</span>
              </div>
            </div>
          </div>

          <Alert>
            <AlertCircleIcon className="h-4 w-4" />
            <AlertTitle>Information</AlertTitle>
            <AlertDescription>
              {quantity} words will be generated in batches of {batchSize} with
              a {delay}ms delay between batches.
            </AlertDescription>
          </Alert>
        </div>
      </CardContent>
      <CardFooter className="flex gap-2 justify-between">
        <Button
          onClick={async () => await onGenerate(false)}
          disabled={generating || quantity <= 0}
          className="w-full"
        >
          {generating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating...
            </>
          ) : (
            "Generate Words"
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default WordGenerationForm;
