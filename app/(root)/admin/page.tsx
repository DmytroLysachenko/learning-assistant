"use client";

import { useState } from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { OperationStatus } from "@/types";

import StatusCard from "@/components/admin/StatusCard";
import GenerationByTopic from "@/components/admin/sections/GenerationByTopicSection";
import MaintenancePanel from "@/components/admin/sections/MaintenanceSection";
import ValidationPanel from "@/components/admin/sections/ValidationSection";
import GenerationByAlphabet from "@/components/admin/sections/GenerationByAlphabetSection";
import TranslateWordsSection from "@/components/admin/sections/TranslateWordsSection";
import { Button } from "@/components/ui/button";
import { deleteInvalidTranslationConnections } from "@/lib/actions/checks";

const AdminDashboard = () => {
  const [operationStatus, setOperationStatus] = useState<OperationStatus>({
    isGeneratingByTopic: false,
    isGeneratingByAlphabet: false,
    isGeneratingTranslations: false,
    isRemovingDuplicates: false,
    isRemovingUntranslated: false,
    isValidating: false,
  });

  const updateStatus = (key: keyof OperationStatus, value: boolean) => {
    setOperationStatus((prev) => ({ ...prev, [key]: value }));
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
        <Button
          onClick={async () => {
            await deleteInvalidTranslationConnections({
              fromLanguage: "pl",
              toLanguage: "ru",
              batchSize: 50,
            });
          }}
        >
          Delete
        </Button>

        <StatusCard operationStatus={operationStatus} />

        <Tabs
          defaultValue="generation"
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 gap-5 w-full max-w-md mb-4">
            <TabsTrigger value="generation">Content Generation</TabsTrigger>
            <TabsTrigger value="maintenance">
              Maintenance & Validation
            </TabsTrigger>
          </TabsList>

          <TabsContent value="generation">
            <Tabs
              defaultValue="words-by-alphabet"
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="words-by-alphabet">
                  Words by Alphabet
                </TabsTrigger>
                <TabsTrigger value="words-by-topic">Words by Topic</TabsTrigger>
                <TabsTrigger value="translate-words">Translations</TabsTrigger>
              </TabsList>

              <TabsContent value="words-by-topic">
                <GenerationByTopic
                  isGenerating={operationStatus.isGeneratingByTopic}
                  setIsGenerating={(value) =>
                    updateStatus("isGeneratingByTopic", value)
                  }
                />
              </TabsContent>

              <TabsContent value="words-by-alphabet">
                <GenerationByAlphabet
                  isGenerating={operationStatus.isGeneratingByAlphabet}
                  setIsGenerating={(value) =>
                    updateStatus("isGeneratingByAlphabet", value)
                  }
                />
              </TabsContent>

              <TabsContent value="translate-words">
                <TranslateWordsSection
                  isGenerating={operationStatus.isGeneratingTranslations}
                  setIsGenerating={(value) =>
                    updateStatus("isGeneratingTranslations", value)
                  }
                />
              </TabsContent>
            </Tabs>
          </TabsContent>

          <TabsContent value="maintenance">
            <Tabs
              defaultValue="maintenance-actions"
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="maintenance-actions">
                  Maintenance
                </TabsTrigger>
                <TabsTrigger value="validation-actions">Validation</TabsTrigger>
              </TabsList>

              <TabsContent value="maintenance-actions">
                <MaintenancePanel
                  isRemovingDuplicates={operationStatus.isRemovingDuplicates}
                  isRemovingUntranslated={
                    operationStatus.isRemovingUntranslated
                  }
                  setIsRemovingDuplicates={(value) =>
                    updateStatus("isRemovingDuplicates", value)
                  }
                  setIsRemovingUntranslated={(value) =>
                    updateStatus("isRemovingUntranslated", value)
                  }
                />
              </TabsContent>

              <TabsContent value="validation-actions">
                <ValidationPanel
                  isValidating={operationStatus.isValidating}
                  setIsValidating={(value) =>
                    updateStatus("isValidating", value)
                  }
                />
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
};

export default AdminDashboard;
