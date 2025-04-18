"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

import {
  cleanAllVocabularyData,
  removeDuplicatesFromTable,
  removeUntranslatedWords,
  seedWordsInChunks,
  seedWordsLoop,
} from "@/lib/actions/admin";
import type { LanguageLevels } from "@/types";
import StatusCard from "@/components/admin/StatusCard";
import WordGenerationForm from "@/components/admin/WordGenerationForm";
import MaintenanceActions from "@/components/admin/MaintainanceActions";

const AdminDashboard = () => {
  // State for operations
  const [generating, setGenerating] = useState(false);
  const [isRemovingDuplicates, setIsRemovingDuplicates] = useState(false);
  const [isRemovingUntranslated, setIsRemovingUntranslated] = useState(false);
  const [isCleaningAll, setIsCleaningAll] = useState(false);

  // State for form values
  const [level, setLevel] = useState("A0");
  const [quantity, setQuantity] = useState(10);
  const [batchSize, setBatchSize] = useState(50);
  const [delay, setDelay] = useState(5000);

  // Handler functions
  const handleGenerateWords = async (isRandomLevel?: boolean) => {
    try {
      setGenerating(true);

      if (isRandomLevel) {
        await seedWordsLoop(quantity, batchSize, delay);
      } else {
        await seedWordsInChunks(
          quantity,
          level as LanguageLevels,
          batchSize,
          delay
        );
      }

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

      await removeUntranslatedWords();

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

  const handleCleanAllData = async () => {
    try {
      setIsCleaningAll(true);

      await cleanAllVocabularyData();

      toast.success("All vocabulary data has been cleaned");
    } catch (error) {
      toast.error("Failed to clean vocabulary data", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsCleaningAll(false);
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
          isCleaningAll={isCleaningAll}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Word Generation Form */}
          <WordGenerationForm
            generating={generating}
            level={level}
            quantity={quantity}
            batchSize={batchSize}
            delay={delay}
            setLevel={setLevel}
            setQuantity={setQuantity}
            setBatchSize={setBatchSize}
            setDelay={setDelay}
            onGenerate={handleGenerateWords}
          />

          {/* Maintenance Actions */}
          <MaintenanceActions
            isRemovingDuplicates={isRemovingDuplicates}
            isRemovingUntranslated={isRemovingUntranslated}
            isCleaningAll={isCleaningAll}
            generating={generating}
            onRemoveDuplicates={handleRemoveDuplicates}
            onRemoveUntranslated={handleRemoveUntranslated}
            onCleanAllData={handleCleanAllData}
          />
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
