"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  AlertCircleIcon,
  ItalicIcon as AlphabetIcon,
  Loader2,
} from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import CustomSelect from "@/components/CustomSelect";

import type { WordType } from "@/types";
import { LANGUAGE_OPTIONS, WORDS_TYPES_OPTIONS } from "@/constants/ui";

const enumValues = LANGUAGE_OPTIONS.map((option) => option.value) as [
  string,
  ...string[]
];

const formSchema = z.object({
  language: z.enum(enumValues, {
    required_error: "Please select a language",
  }),
  translationLanguage: z.enum(enumValues, {
    required_error: "Please select a translation language",
  }),
  total: z.coerce
    .number({
      required_error: "Please enter the total number of words",
      invalid_type_error: "Total must be a number",
    })
    .min(30, { message: "Total must be at least 30" })
    .max(500, { message: "Total cannot exceed 500" }),
  wordType: z.string(),
  batchSize: z.coerce.number().min(5).max(30),
  delay: z.coerce.number().min(3000).max(8000),
});

interface AlphabetGenerationFormExtendedProps {
  isDisabled: boolean;
  batchSize: number;
  delay: number;
  wordType: WordType | "none";
  language: "pl" | "ru";
  translationLanguage: "pl" | "ru";
  total: number;
  setBatchSize: (batchSize: number) => void;
  setDelay: (delay: number) => void;
  setWordType: (wordType: WordType | "none") => void;
  setLanguage: (language: "pl" | "ru") => void;
  setTranslationLanguage: (language: "pl" | "ru") => void;
  setTotal: (total: number) => void;
  onGenerate: () => Promise<void>;
}

const AlphabetGenerationForm = ({
  isDisabled,
  batchSize,
  delay,
  wordType,
  language,
  translationLanguage,
  total,
  setBatchSize,
  setDelay,
  setWordType,
  setLanguage,
  setTranslationLanguage,
  setTotal,
  onGenerate,
}: AlphabetGenerationFormExtendedProps) => {
  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      language,
      translationLanguage,
      total,
      wordType,
      batchSize,
      delay,
    },
  });

  // Submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    // Update parent state with form values
    setLanguage(values.language as "pl" | "ru");
    setTranslationLanguage(values.translationLanguage as "pl" | "ru");
    setTotal(values.total);
    setWordType(values.wordType as WordType | "none");
    setBatchSize(values.batchSize);
    setDelay(values.delay);

    // Call the generate function
    await onGenerate();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlphabetIcon className="h-5 w-5" />
          Generate Words by Alphabet
        </CardTitle>
        <CardDescription>
          Add new vocabulary words to the database alphabetically
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
                        isDisabled={isDisabled}
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
                name="translationLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Translation Language</FormLabel>
                    <FormControl>
                      <CustomSelect
                        options={LANGUAGE_OPTIONS}
                        currentValue={field.value}
                        isDisabled={isDisabled}
                        handleValueChange={field.onChange}
                        placeholder="Select translation language"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Words</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isDisabled}
                        placeholder="Enter total words"
                        {...field}
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
                        isDisabled={isDisabled}
                        handleValueChange={field.onChange}
                        placeholder="Select word type"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                          disabled={isDisabled}
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

            <FormField
              control={form.control}
              name="delay"
              render={({ field }) => (
                <FormItem>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <FormLabel>Delay: {field.value}ms</FormLabel>
                      <span className="text-xs text-muted-foreground">
                        Time between batches
                      </span>
                    </div>
                    <FormControl>
                      <div className="flex gap-4 items-center">
                        <span className="text-xs">3000ms</span>
                        <input
                          type="range"
                          min={3000}
                          max={8000}
                          step={500}
                          disabled={isDisabled}
                          value={field.value}
                          onChange={(e) => {
                            field.onChange(Number(e.target.value));
                            setDelay(Number(e.target.value));
                          }}
                          className="flex-1"
                        />
                        <span className="text-xs">8000ms</span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <Alert>
              <AlertCircleIcon className="h-4 w-4" />
              <AlertTitle>Information</AlertTitle>
              <AlertDescription>
                {form.watch("total")} words will be generated alphabetically for{" "}
                {
                  LANGUAGE_OPTIONS.find(
                    (option) => option.value === form.watch("language")
                  )?.label
                }{" "}
                language with{" "}
                {
                  LANGUAGE_OPTIONS.find(
                    (option) =>
                      option.value === form.watch("translationLanguage")
                  )?.label
                }{" "}
                translations in batches of {form.watch("batchSize")} with a{" "}
                {form.watch("delay")}ms delay between batches.
              </AlertDescription>
            </Alert>

            <Button
              type="submit"
              disabled={isDisabled}
              className="w-full"
            >
              {isDisabled ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Words Alphabetically"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default AlphabetGenerationForm;
