import { google } from "@ai-sdk/google";

// RPD 14,400
export const modelGemma = google("gemma-3-27b-it");

// RPD 1,500
export const modelFlashExp = google("gemini-2.0-flash-exp");

// RPD 1,500
export const modelFlash = google("gemini-2.0-flash-001");

// RPD 1,500
export const modelFlashLiteExp = google("gemini-2.0-flash-lite-preview-02-05");

// RPD 1,500
export const modelFlashThinking = google("gemini-2.0-flash-thinking-exp-01-21");

// RPD 500
export const modelFlashPreview = google("gemini-2.5-flash-preview-04-17");

//RPD 25
export const modelFlashProExp = google("gemini-2.5-pro-exp-03-25");
