"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Database, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

import CustomSelect from "@/components/CustomSelect";

import ConfirmationDialog from "./ConfirmationDialog";
import { LanguageOption } from "@/types";

// Language options
const LANGUAGE_OPTIONS: LanguageOption[] = [
  { value: "pl", label: "Polish" },
  { value: "ru", label: "Russian" },
];

interface MaintenanceFormProps {
  isRemovingDuplicates: boolean;
  isRemovingUntranslated: boolean;
  selectedLanguage: "pl" | "ru";
  setSelectedLanguage: (language: "pl" | "ru") => void;
  onRemoveDuplicates: () => Promise<void>;
  onRemoveUntranslated: () => Promise<void>;
}

const MaintenanceForm = ({
  isRemovingDuplicates,
  isRemovingUntranslated,
  selectedLanguage,
  setSelectedLanguage,
  onRemoveDuplicates,
  onRemoveUntranslated,
}: MaintenanceFormProps) => {
  const isAnyOperationRunning = isRemovingDuplicates || isRemovingUntranslated;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Database Maintenance
        </CardTitle>
        <CardDescription>
          Clean and maintain the vocabulary database
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <h3 className="text-sm font-medium">Language Selection</h3>
          <div className="w-full max-w-xs">
            <CustomSelect
              options={LANGUAGE_OPTIONS}
              currentValue={selectedLanguage}
              isDisabled={isAnyOperationRunning}
              handleValueChange={(value) =>
                setSelectedLanguage(value as "pl" | "ru")
              }
              placeholder="Select language"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Select the language for maintenance operations
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Regular Maintenance</h3>
          <Button
            onClick={onRemoveDuplicates}
            disabled={isAnyOperationRunning}
            variant="outline"
            className="w-full"
          >
            {isRemovingDuplicates ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing Duplicates...
              </>
            ) : (
              `Remove Duplicates (${selectedLanguage.toUpperCase()})`
            )}
          </Button>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-destructive">
            Destructive Actions
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <ConfirmationDialog
              title="Remove Untranslated Words"
              description="This action will permanently delete all untranslated words from the database. This cannot be undone."
              actionLabel="Confirm Removal"
              isLoading={isRemovingUntranslated}
              isDestructive={true}
              showWarning={true}
              warningTitle="Warning"
              warningDescription="This will remove all words that don't have translations between Polish and Russian."
              onConfirm={onRemoveUntranslated}
              trigger={
                <Button
                  variant="outline"
                  className="w-full border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                  disabled={isAnyOperationRunning}
                >
                  Remove Untranslated Words
                </Button>
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceForm;
