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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import CustomSelect from "@/components/CustomSelect";
import type { LanguageCodeType } from "@/types";
import { LANGUAGE_OPTIONS } from "@/constants/ui";
import { enumValues } from "@/constants";

const formSchema = z
  .object({
    sourceLanguage: z.enum(enumValues, {
      required_error: "Please select a language",
    }),
    targetLanguage: z.enum(enumValues, {
      required_error: "Please select a translation language",
    }),
    batchSize: z.coerce.number().min(5).max(30),
    delay: z.coerce.number().min(3000).max(8000),
  })

  .refine((data) => data.sourceLanguage !== data.targetLanguage, {
    message: "Language and translation language must be different",
    path: ["targetLanguage"],
  });

interface TranslateWordsFormProps {
  isGenerating: boolean;
  onGenerate: ({
    batchSize,
    delay,
    sourceLanguage,
    targetLanguage,
  }: {
    batchSize: number;
    delay: number;
    sourceLanguage: LanguageCodeType;
    targetLanguage: LanguageCodeType;
  }) => Promise<void>;
}

const TranslateWordsForm = ({
  isGenerating,
  onGenerate,
}: TranslateWordsFormProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceLanguage: "pl",
      targetLanguage: "ru",
      delay: 5000,
      batchSize: 10,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await onGenerate({
      sourceLanguage: values.sourceLanguage as LanguageCodeType,
      targetLanguage: values.targetLanguage as LanguageCodeType,
      batchSize: values.batchSize,
      delay: values.delay,
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlphabetIcon className="h-5 w-5" />
          Generate Translations to Vocabulary words
        </CardTitle>
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
                name="sourceLanguage"
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

              <FormField
                control={form.control}
                name="targetLanguage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Translation Language</FormLabel>
                    <FormControl>
                      <CustomSelect
                        options={LANGUAGE_OPTIONS}
                        currentValue={field.value}
                        isDisabled={isGenerating}
                        handleValueChange={field.onChange}
                        placeholder="Select translation language"
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
                {form.watch("sourceLanguage").toUpperCase()} words will be
                translated to {form.watch("targetLanguage").toUpperCase()}
              </AlertDescription>
            </Alert>
            <FormMessage />
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
                "Generate Translations"
              )}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default TranslateWordsForm;
