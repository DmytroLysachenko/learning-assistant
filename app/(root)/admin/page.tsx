"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

import StatusCard from "@/components/admin/StatusCard";
import WordGenerationForm from "@/components/admin/WordGenerationForm";
import MaintenanceActions from "@/components/admin/MaintenanceActions";
import { Button } from "@/components/ui/button";
import { LanguageLevelsType, WordType } from "@/types";
import { seedWordsByAlphabet, seedWordsByTopic } from "@/lib/actions/admin";
import {
  removeDuplicatesFromTable,
  removeUntranslatedWordsFromTable,
  validateVocabulary,
} from "@/lib/actions/checks/vocabulary";

const AdminDashboard = () => {
  // State for operations
  const [generating, setGenerating] = useState(false);
  const [isRemovingDuplicates, setIsRemovingDuplicates] = useState(false);
  const [isRemovingUntranslated, setIsRemovingUntranslated] = useState(false);

  // State for form values
  const [level, setLevel] = useState<LanguageLevelsType | "random">("random");
  const [quantity, setQuantity] = useState(10);
  const [batchSize, setBatchSize] = useState(50);
  const [delay, setDelay] = useState(5000);
  const [wordType, setWordType] = useState<WordType | "none">("none");

  // Handler functions
  const handleGenerateWords = async () => {
    try {
      setGenerating(true);

      await seedWordsByTopic({
        total: quantity,
        batchSize,
        wordType: wordType === "none" ? undefined : wordType,
        delayMs: delay,
        level: level === "random" ? undefined : level,
      });

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
      setGenerating(false);
    }
  };

  const handleGenerateAlphabeticallyWords = async () => {
    setGenerating(true);

    const { success } = await seedWordsByAlphabet({
      batchSize,
      wordType: wordType === "none" ? undefined : wordType,
      delayMs: delay,
    });

    if (!success) {
      toast.error("Failed to generate words");
    }

    toast.success("Words generated successfully", {
      description: `Added ${quantity} words at level ${level} and removed duplicates.`,
    });

    setGenerating(false);
  };

  const handleRemoveDuplicates = async () => {
    try {
      setIsRemovingDuplicates(true);

      await removeDuplicatesFromTable("pl");
      await removeDuplicatesFromTable("ru");

      toast.success("Duplicates removed successfully");
    } catch (error) {
      toast.error("Failed to remove duplicates", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsRemovingDuplicates(false);
    }
  };

  const handleRemoveUntranslated = async () => {
    try {
      setIsRemovingUntranslated(true);

      await removeUntranslatedWordsFromTable("pl", "ru");

      toast.success("Untranslated words removed successfully");
    } catch (error) {
      toast.error("Failed to remove untranslated words", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsRemovingUntranslated(false);
    }
  };

  const handleValidateVocabulary = async () => {
    try {
      validateVocabulary("pl", "particle");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <main className="container mx-auto py-8 px-4">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Manage vocabulary data and perform administrative tasks
          </p>
          <Separator className="my-2" />
        </div>

        {/* Status Card */}
        <StatusCard
          generating={generating}
          isRemovingDuplicates={isRemovingDuplicates}
          isRemovingUntranslated={isRemovingUntranslated}
        />
        <Button onClick={handleGenerateAlphabeticallyWords}>
          Alphabetical Generation!
        </Button>

        <Button onClick={handleValidateVocabulary}>Start validation</Button>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Word Generation Form */}
          <WordGenerationForm
            generating={generating}
            level={level}
            quantity={quantity}
            batchSize={batchSize}
            delay={delay}
            wordType={wordType}
            setLevel={setLevel}
            setQuantity={setQuantity}
            setBatchSize={setBatchSize}
            setDelay={setDelay}
            setWordType={setWordType}
            onGenerate={handleGenerateWords}
          />

          {/* Maintenance Actions */}
          <MaintenanceActions
            isRemovingDuplicates={isRemovingDuplicates}
            isRemovingUntranslated={isRemovingUntranslated}
            generating={generating}
            onRemoveDuplicates={handleRemoveDuplicates}
            onRemoveUntranslated={handleRemoveUntranslated}
          />
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
