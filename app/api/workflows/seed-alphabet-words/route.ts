import { seedWordsByAlphabet } from "@/lib/actions/admin";
import { getAiLock, setAiLock } from "@/lib/actions/aiLock";
import { SeedWordsOptions } from "@/types";
import { serve } from "@upstash/workflow/nextjs";

export const { POST } = serve<SeedWordsOptions>(async (context) => {
  const options = context.requestPayload;

  const isAuthorized = await context.run("checkAuthorization", async () => {
    const auth = context.headers.get("authorization");
    const expected = `Bearer ${process.env.JOBS_SECRET}`;

    return auth === expected;
  });

  if (!isAuthorized) {
    console.log("Not authorized, cancelling workflow.");
    context.cancel();
    return;
  }

  const isLocked = await context.run("checkAiLock", async () => {
    const isLocked = await getAiLock();
    return isLocked;
  });

  if (isLocked) {
    console.log("AI is currently locked, cancelling workflow.");
    context.cancel();
    return;
  }

  await context.run(
    `Seeding ${options.language} vocabulary db alphabetically with ${options.wordType} words, batch size ${options.batchSize}, delay ${options.delayMs}ms, level ${options.level}`,
    async () => {
      await setAiLock(true);

      try {
        const { success } = await seedWordsByAlphabet(options);

        return success;
      } catch (e) {
        console.log("Failed to seed words", e);
        return false;
      } finally {
        await setAiLock(false);
      }
    }
  );
});
