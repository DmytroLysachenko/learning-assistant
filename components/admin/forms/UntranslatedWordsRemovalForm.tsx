"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AlertTriangle, Loader2 } from "lucide-react";

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
import CustomSelect from "@/components/CustomSelect";
import ConfirmationDialog from "../ConfirmationDialog";
import { LANGUAGE_OPTIONS } from "@/constants/ui";
import type { LanguageCodeType } from "@/types";
import { enumValues, SUPPORTED_LANGUAGES } from "@/constants";

const formSchema = z.object({
  language: z.enum(enumValues, {
    required_error: "Please select a language",
  }),
});

interface UntranslatedWordsFormProps {
  isRemovingUntranslated: boolean;
  isOperationRunning: boolean;
  onRemoveUntranslated: ({
    language,
  }: {
    language: LanguageCodeType;
  }) => Promise<void>;
}

const UntranslatedWordsForm = ({
  isRemovingUntranslated,
  isOperationRunning,
  onRemoveUntranslated,
}: UntranslatedWordsFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "pl",
    },
  });

  const handleRemoveUntranslated = async () => {
    const values = form.getValues();
    await onRemoveUntranslated({
      language: values.language as LanguageCodeType,
    });
  };

  return (
    <Card className="border-destructive/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Remove Untranslated Words
        </CardTitle>
        <CardDescription>
          Remove words that don&apos;t have translations between languages
          (destructive action)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <div className="space-y-6">
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
                      isDisabled={isOperationRunning}
                      handleValueChange={field.onChange}
                      placeholder="Select language"
                    />
                  </FormControl>
                  <FormDescription>
                    Select the language to remove untranslated words from
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <ConfirmationDialog
              title={`Remove Untranslated Words (${form
                .watch("language")
                .toUpperCase()})`}
              description={`This action will permanently delete all untranslated ${
                SUPPORTED_LANGUAGES[form.watch("language") as LanguageCodeType]
              } words from the database. This cannot be undone.`}
              actionLabel="Confirm Removal"
              isLoading={isRemovingUntranslated}
              isDestructive={true}
              showWarning={true}
              warningTitle="Warning"
              warningDescription={`This will remove all ${
                SUPPORTED_LANGUAGES[form.watch("language") as LanguageCodeType]
              } words that don't have any translations.`}
              onConfirm={handleRemoveUntranslated}
              trigger={
                <Button
                  variant="outline"
                  className="w-full border-destructive/30 hover:bg-destructive/10 hover:text-destructive"
                  disabled={isOperationRunning}
                >
                  {isRemovingUntranslated ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Removing Untranslated Words...
                    </>
                  ) : (
                    `Remove Untranslated Words (${form
                      .watch("language")
                      .toUpperCase()})`
                  )}
                </Button>
              }
            />
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};

export default UntranslatedWordsForm;
