"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { AlertCircleIcon, Loader2, Upload } from "lucide-react";

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
import type { LanguageCodeType, LanguageLevelsType, WordType } from "@/types";
import { LANGUAGE_OPTIONS, LEVEL_OPTIONS } from "@/constants/ui";
import { WORDS_TYPES_OPTIONS } from "@/constants";

const enumValues = LANGUAGE_OPTIONS.map((option) => option.value) as [
  string,
  ...string[]
];

// Define the form schema with Zod
const formSchema = z.object({
  level: z.string(),
  language: z.enum(enumValues, {
    required_error: "Please select a language",
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

interface GenerationByTopicFormProps {
  isGenerating: boolean;
  onGenerate: ({
    level,
    total,
    batchSize,
    delay,
    wordType,
    language,
  }: {
    level: LanguageLevelsType;
    total: number;
    batchSize: number;
    delay: number;
    wordType: WordType;
    language: LanguageCodeType;
  }) => Promise<void>;
}

const GenerationByTopicForm = ({
  isGenerating,
  onGenerate,
}: GenerationByTopicFormProps) => {
  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      level: "B1",
      total: 100,
      language: "pl",
      wordType: "noun",
      batchSize: 10,
      delay: 5000,
    },
  });

  // Submit handler
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await onGenerate({
      level: values.level as LanguageLevelsType,
      total: values.total,
      language: values.language as LanguageCodeType,
      wordType: values.wordType as WordType,
      batchSize: values.batchSize,
      delay: values.delay,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="h-5 w-5" />
          Generate Words by Topic
        </CardTitle>
        <CardDescription>
          Add new vocabulary words to the database based on topics
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
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language Level</FormLabel>
                    <FormControl>
                      <CustomSelect
                        options={LEVEL_OPTIONS}
                        currentValue={field.value}
                        isDisabled={isGenerating}
                        handleValueChange={field.onChange}
                        placeholder="Select level"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Words</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        disabled={isGenerating}
                        placeholder="Enter number of words"
                        {...field}
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
                name="language"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Language</FormLabel>
                    <FormControl>
                      <CustomSelect
                        options={LANGUAGE_OPTIONS}
                        currentValue={field.value}
                        isDisabled={isGenerating}
                        handleValueChange={field.onChange}
                        placeholder="Select language"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                      isDisabled={isGenerating}
                      handleValueChange={field.onChange}
                      placeholder="Select word type"
                    />
                  </FormControl>
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
                          disabled={isGenerating}
                          value={field.value}
                          onChange={field.onChange}
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
                          disabled={isGenerating}
                          value={field.value}
                          onChange={field.onChange}
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
                {form.watch("total")} words will be generated in random topics
                for{" "}
                {
                  LANGUAGE_OPTIONS.find(
                    (option) => option.value === form.watch("language")
                  )?.label
                }{" "}
                language in batches of {form.watch("batchSize")} with a{" "}
                {form.watch("delay")}ms delay between batches.
              </AlertDescription>
            </Alert>

            <Button
              type="submit"
              disabled={isGenerating}
              className="w-full"
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Words by Topic"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default GenerationByTopicForm;
