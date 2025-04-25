"use client";

import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import StatusCard from "@/components/admin/StatusCard";

import GenerationByTopic from "@/components/admin/sections/GenerationByTopicSection";

import MaintenancePanel from "@/components/admin/sections/MaintenanceSection";
import ValidationPanel from "@/components/admin/sections/ValidationSection";
import { OperationStatus } from "@/types";
import GenerationByAlphabet from "@/components/admin/sections/GenerationByAlphabetSection";

const AdminDashboard = () => {
  // Centralized operation status state
  const [operationStatus, setOperationStatus] = useState<OperationStatus>({
    isGeneratingByTopic: false,
    isGeneratingByAlphabet: false,
    isRemovingDuplicates: false,
    isRemovingUntranslated: false,
    isValidating: false,
  });

  // Update operation status helper
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

        {/* Status Card */}
        <StatusCard operationStatus={operationStatus} />

        {/* Main Tabs */}
        <Tabs
          defaultValue="generation"
          className="w-full"
        >
          <TabsList className="grid grid-cols-2 w-full max-w-md mb-4">
            <TabsTrigger value="generation">Word Generation</TabsTrigger>
            <TabsTrigger value="maintenance">
              Maintenance & Validation
            </TabsTrigger>
          </TabsList>

          {/* Generation Tab */}
          <TabsContent value="generation">
            <Tabs
              defaultValue="by-topic"
              className="w-full"
            >
              <TabsList className="mb-4">
                <TabsTrigger value="by-topic">Generate by Topic</TabsTrigger>
                <TabsTrigger value="by-alphabet">
                  Generate by Alphabet
                </TabsTrigger>
              </TabsList>

              <TabsContent value="by-topic">
                <GenerationByTopic
                  isGenerating={operationStatus.isGeneratingByTopic}
                  setIsGenerating={(value) =>
                    updateStatus("isGeneratingByTopic", value)
                  }
                />
              </TabsContent>

              <TabsContent value="by-alphabet">
                <GenerationByAlphabet
                  isGenerating={operationStatus.isGeneratingByAlphabet}
                  setIsGenerating={(value) =>
                    updateStatus("isGeneratingByAlphabet", value)
                  }
                />
              </TabsContent>
            </Tabs>
          </TabsContent>

          {/* Maintenance Tab */}
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
