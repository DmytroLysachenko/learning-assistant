"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Database, Loader2 } from "lucide-react";

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
import { LANGUAGE_OPTIONS } from "@/constants/ui";
import type { LanguageCodeType } from "@/types";

const enumValues = LANGUAGE_OPTIONS.map((option) => option.value) as [
  string,
  ...string[]
];

const formSchema = z.object({
  language: z.enum(enumValues, {
    required_error: "Please select a language",
  }),
});

interface MaintenanceFormProps {
  isRemovingDuplicates: boolean;
  isOperationRunning: boolean;
  onRemoveDuplicates: ({
    language,
  }: {
    language: LanguageCodeType;
  }) => Promise<void>;
}

const MaintenanceForm = ({
  isRemovingDuplicates,
  isOperationRunning,
  onRemoveDuplicates,
}: MaintenanceFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language: "pl",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await onRemoveDuplicates({ language: values.language as LanguageCodeType });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Remove Duplicates
        </CardTitle>
        <CardDescription>
          Remove duplicate words from the vocabulary database
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                      isDisabled={isOperationRunning}
                      handleValueChange={field.onChange}
                      placeholder="Select language"
                    />
                  </FormControl>
                  <FormDescription>
                    Select the language to remove duplicates from
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              disabled={isOperationRunning}
              variant="outline"
              className="w-full"
            >
              {isRemovingDuplicates ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Removing Duplicates...
                </>
              ) : (
                `Remove Duplicates (${form.watch("language").toUpperCase()})`
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default MaintenanceForm;
