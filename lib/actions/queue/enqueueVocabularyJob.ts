import { SeedWordsOptions } from "@/types"; // adjust if needed

export const enqueueVocabularyJob = async (
  options: Omit<SeedWordsOptions, "total">
) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_APP_URL}/api/jobs/seedWords`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.JOBS_SECRET}`,
      },
      body: JSON.stringify(options),
    }
  );

  const json = await res.json();
  return json;
};
