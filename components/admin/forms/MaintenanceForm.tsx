"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Database, Loader2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import CustomSelect from "@/components/CustomSelect";
import ConfirmationDialog from "../ConfirmationDialog";
import { LANGUAGE_OPTIONS } from "@/constants/ui";
import { LanguageCodeType } from "@/types";

const enumValues = LANGUAGE_OPTIONS.map((option) => option.value) as [
  string,
  ...string[]
];

// Define the form schema with Zod
const formSchema = z.object({
  language: z.enum(enumValues, {
    required_error: "Please select a language",
  }),
});

interface MaintenanceFormProps {
  isRemovingDuplicates: boolean;
  isRemovingUntranslated: boolean;
  selectedLanguage: LanguageCodeType;
  setSelectedLanguage: (language: LanguageCodeType) => void;
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

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: selectedLanguage,
    },
  });

  // Submit handler for removing duplicates
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Update parent state with form values
    setSelectedLanguage(values.language as LanguageCodeType);

    // Call the remove duplicates function
    await onRemoveDuplicates();
  };

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
      <CardContent className="space-y-6">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language Selection</FormLabel>
                  <FormControl>
                    <CustomSelect
                      options={LANGUAGE_OPTIONS}
                      currentValue={field.value}
                      isDisabled={isAnyOperationRunning}
                      handleValueChange={(value) => {
                        field.onChange(value);
                        setSelectedLanguage(value as LanguageCodeType);
                      }}
                      placeholder="Select language"
                    />
                  </FormControl>
                  <FormDescription>
                    Select the language for maintenance operations
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <h3 className="text-sm font-medium">Regular Maintenance</h3>
              <Button
                type="submit"
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
          </form>
        </Form>

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
