"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { CheckCircle, Loader2 } from "lucide-react";
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

import type { LanguageCodeType, WordType } from "@/types";
import { LANGUAGE_OPTIONS, WORDS_TYPES_OPTIONS } from "@/constants/ui";

const enumValues = LANGUAGE_OPTIONS.map((option) => option.value) as [
  string,
  ...string[]
];

// Define the form schema with Zod
const formSchema = z.object({
  language: z.enum(enumValues, {
    required_error: "Please select a language",
  }),
  wordType: z.string().refine((val) => val !== "none", {
    message: "Please select a word type",
  }),
  batchSize: z.coerce.number().min(5).max(30),
});

interface ValidationFormProps {
  isValidating: boolean;
  language: LanguageCodeType;
  wordType: WordType | "none";
  batchSize: number;
  setLanguage: (language: LanguageCodeType) => void;
  setWordType: (wordType: WordType | "none") => void;
  setBatchSize: (batchSize: number) => void;
  onValidate: () => Promise<void>;
}

const ValidationForm = ({
  isValidating,
  language,
  wordType,
  batchSize,
  setLanguage,
  setWordType,
  setBatchSize,
  onValidate,
}: ValidationFormProps) => {
  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language,
      wordType,
      batchSize,
    },
  });

  // Submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Update parent state with form values
    setLanguage(values.language as LanguageCodeType);
    setWordType(values.wordType as WordType | "none");

    // Call the validate function
    await onValidate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="h-5 w-5" />
          Vocabulary Validation
        </CardTitle>
        <CardDescription>
          Validate vocabulary entries for correctness and completeness
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <CustomSelect
                        options={LANGUAGE_OPTIONS}
                        currentValue={field.value}
                        isDisabled={isValidating}
                        handleValueChange={field.onChange}
                        placeholder="Select language"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="wordType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Word Type</FormLabel>
                    <FormControl>
                      <CustomSelect
                        options={WORDS_TYPES_OPTIONS}
                        currentValue={field.value}
                        isDisabled={isValidating}
                        handleValueChange={field.onChange}
                        placeholder="Select word type"
                      />
                    </FormControl>
                    <FormDescription>
                      Select a specific word type to validate
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="batchSize"
                render={({ field }) => (
                  <FormItem>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <FormLabel>Batch Size: {field.value}</FormLabel>
                        <span className="text-xs text-muted-foreground">
                          Words per batch
                        </span>
                      </div>
                      <FormControl>
                        <div className="flex gap-4 items-center">
                          <span className="text-xs">5</span>
                          <input
                            type="range"
                            min={5}
                            max={30}
                            step={5}
                            disabled={isValidating}
                            value={field.value}
                            onChange={(e) => {
                              field.onChange(Number(e.target.value));
                              setBatchSize(Number(e.target.value));
                            }}
                            className="flex-1"
                          />
                          <span className="text-xs">30</span>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </div>
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              disabled={isValidating}
              className="w-full"
            >
              {isValidating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Validating...
                </>
              ) : (
                "Start Validation"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ValidationForm;
