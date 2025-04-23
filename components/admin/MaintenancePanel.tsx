"use client";

import { useState } from "react";
import { toast } from "sonner";
import {
  removeDuplicatesFromTable,
  removeUntranslatedWordsFromTable,
} from "@/lib/actions/checks/vocabulary";
import MaintenanceForm from "./MaintenanceForm";

interface MaintenanceProps {
  isRemovingDuplicates: boolean;
  isRemovingUntranslated: boolean;
  setIsRemovingDuplicates: (value: boolean) => void;
  setIsRemovingUntranslated: (value: boolean) => void;
}

const MaintenancePanel = ({
  isRemovingDuplicates,
  isRemovingUntranslated,
  setIsRemovingDuplicates,
  setIsRemovingUntranslated,
}: MaintenanceProps) => {
  const [selectedLanguage, setSelectedLanguage] = useState<"pl" | "ru">("pl");

  const handleRemoveDuplicates = async () => {
    try {
      setIsRemovingDuplicates(true);

      await removeDuplicatesFromTable(selectedLanguage);

      toast.success(
        `Duplicates removed successfully for ${
          selectedLanguage === "pl" ? "Polish" : "Russian"
        } language`
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

  return (
    <div className="w-full">
      <MaintenanceForm
        isRemovingDuplicates={isRemovingDuplicates}
        isRemovingUntranslated={isRemovingUntranslated}
        selectedLanguage={selectedLanguage}
        setSelectedLanguage={setSelectedLanguage}
        onRemoveDuplicates={handleRemoveDuplicates}
        onRemoveUntranslated={handleRemoveUntranslated}
      />
    </div>
  );
};

export default MaintenancePanel;
