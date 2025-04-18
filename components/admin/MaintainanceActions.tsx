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
import ConfirmationDialog from "./ConfirmationDialog";

interface MaintenanceActionsProps {
  isRemovingDuplicates: boolean;
  isRemovingUntranslated: boolean;
  isCleaningAll: boolean;
  generating: boolean;
  onRemoveDuplicates: () => Promise<void>;
  onRemoveUntranslated: () => Promise<void>;
  onCleanAllData: () => Promise<void>;
}

const MaintenanceActions = ({
  isRemovingDuplicates,
  isRemovingUntranslated,
  isCleaningAll,
  generating,
  onRemoveDuplicates,
  onRemoveUntranslated,
  onCleanAllData,
}: MaintenanceActionsProps) => {
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
          <h3 className="text-sm font-medium">Regular Maintenance</h3>
          <Button
            onClick={onRemoveDuplicates}
            disabled={isRemovingDuplicates || generating}
            variant="outline"
            className="w-full"
          >
            {isRemovingDuplicates ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Removing Duplicates...
              </>
            ) : (
              "Remove Duplicates"
            )}
          </Button>
        </div>

        <Separator />

        <div className="space-y-2">
          <h3 className="text-sm font-medium text-destructive">
            Destructive Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ConfirmationDialog
              title="Remove Untranslated Words"
              description="This action will permanently delete all untranslated words from the database. This cannot be undone."
              actionLabel="Confirm Removal"
              isLoading={isRemovingUntranslated}
              isDestructive={true}
              onConfirm={onRemoveUntranslated}
              trigger={
                <Button
                  variant="outline"
                  className="w-full border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                  disabled={isRemovingUntranslated || generating}
                >
                  Remove Untranslated
                </Button>
              }
            />

            <ConfirmationDialog
              title="Clean All Vocabulary Data"
              description="This action will permanently delete ALL vocabulary data from the database. This is irreversible and will remove all words."
              actionLabel="Confirm Deletion"
              isLoading={isCleaningAll}
              isDestructive={true}
              showWarning={true}
              warningTitle="Warning"
              warningDescription="This is a destructive action that cannot be undone. All vocabulary data will be permanently deleted."
              onConfirm={onCleanAllData}
              trigger={
                <Button
                  variant="destructive"
                  className="w-full"
                  disabled={isCleaningAll || generating}
                >
                  Clean All Data
                </Button>
              }
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default MaintenanceActions;
