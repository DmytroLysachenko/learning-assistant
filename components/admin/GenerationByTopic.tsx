"use client";

import { useState } from "react";
import { toast } from "sonner";
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
import type { LanguageLevelsType, WordType } from "@/types";
import { LEVEL_OPTIONS, WORDS_TYPES_OPTIONS } from "@/constants/ui";
import { seedWordsByTopic } from "@/lib/actions/admin";
import { removeDuplicatesFromTable } from "@/lib/actions/checks/vocabulary";
import BatchAndDelayControls from "./BatchAndDelayControls";

interface GenerationByTopicSectionProps {
  isGenerating: boolean;
  setIsGenerating: (value: boolean) => void;
}

const GenerationByTopicSection = ({
  isGenerating,
  setIsGenerating,
}: GenerationByTopicSectionProps) => {
  // State for form values
  const [level, setLevel] = useState<LanguageLevelsType | "random">("random");
  const [quantity, setQuantity] = useState(10);
  const [batchSize, setBatchSize] = useState(50);
  const [delay, setDelay] = useState(5000);
  const [wordType, setWordType] = useState<WordType | "none">("none");

  const handleGenerateWords = async () => {
    try {
      setIsGenerating(true);

      await seedWordsByTopic({
        total: quantity,
        batchSize,
        wordType: wordType === "none" ? undefined : wordType,
        delayMs: delay,
        level: level === "random" ? undefined : level,
      });

      // Clean up duplicates after generation
      await removeDuplicatesFromTable("pl");
      await removeDuplicatesFromTable("ru");

      toast.success("Words generated successfully", {
        description: `Added ${quantity} words at level ${level} and removed duplicates.`,
      });
    } catch (error) {
      toast.error("Failed to generate words", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsGenerating(false);
    }
  };

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
                isDisabled={isGenerating}
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
                disabled={isGenerating}
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
              currentValue={wordType}
              isDisabled={isGenerating}
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
            isDisabled={isGenerating}
            setBatchSize={setBatchSize}
            setDelay={setDelay}
          />

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
      <CardFooter>
        <Button
          onClick={handleGenerateWords}
          disabled={isGenerating || quantity <= 0}
          className="w-full"
        >
          {isGenerating ? (
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

// Reusable component for batch size and delay controls

export default GenerationByTopicSection;
