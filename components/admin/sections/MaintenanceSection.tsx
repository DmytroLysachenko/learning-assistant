"use client";

import { toast } from "sonner";
import {
  removeDuplicatesFromTable,
  removeUntranslatedWordsFromTable,
} from "@/lib/actions/checks/vocabulary";
import type { LanguageCodeType } from "@/types";

import { SUPPORTED_LANGUAGES } from "@/constants";
import UntranslatedWordsForm from "../forms/UntranslatedWordsRemovalForm";
import MaintenanceForm from "../forms/MaintenanceForm";

interface MaintenanceSectionProps {
  isRemovingDuplicates: boolean;
  isRemovingUntranslated: boolean;
  setIsRemovingDuplicates: (value: boolean) => void;
  setIsRemovingUntranslated: (value: boolean) => void;
}

const MaintenanceSection = ({
  isRemovingDuplicates,
  isRemovingUntranslated,
  setIsRemovingDuplicates,
  setIsRemovingUntranslated,
}: MaintenanceSectionProps) => {
  const handleRemoveDuplicates = async ({
    language,
  }: {
    language: LanguageCodeType;
  }) => {
    try {
      setIsRemovingDuplicates(true);

      await removeDuplicatesFromTable(language);

      toast.success(
        `Duplicates removed successfully for ${SUPPORTED_LANGUAGES[language]} language`
      );
    } catch (error) {
      toast.error("Failed to remove duplicates", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsRemovingDuplicates(false);
    }
  };

  const handleRemoveUntranslated = async ({
    language,
  }: {
    language: LanguageCodeType;
  }) => {
    try {
      setIsRemovingUntranslated(true);

      await removeUntranslatedWordsFromTable(language);

      toast.success(
        `Untranslated words removed successfully for ${SUPPORTED_LANGUAGES[language]} language`
      );
    } catch (error) {
      toast.error("Failed to remove untranslated words", {
        description:
          error instanceof Error ? error.message : "An unknown error occurred",
      });
    } finally {
      setIsRemovingUntranslated(false);
    }
  };

  return (
    <div className="w-full space-y-6">
      <MaintenanceForm
        isRemovingDuplicates={isRemovingDuplicates}
        isOperationRunning={isRemovingDuplicates || isRemovingUntranslated}
        onRemoveDuplicates={handleRemoveDuplicates}
      />

      <UntranslatedWordsForm
        isRemovingUntranslated={isRemovingUntranslated}
        isOperationRunning={isRemovingDuplicates || isRemovingUntranslated}
        onRemoveUntranslated={handleRemoveUntranslated}
      />
    </div>
  );
};

export default MaintenanceSection;
