"use server";

import { db } from "@/db";
import { serverState } from "@/db/schema";
import { eq } from "drizzle-orm";

export const setAiLock = async (state: boolean) => {
  await db
    .update(serverState)
    .set({ status: state, updatedAt: new Date() })
    .where(eq(serverState.id, "vocabGeneration"));
};

export const getAiLock = async (): Promise<boolean> => {
  const result = await db
    .select()
    .from(serverState)
    .where(eq(serverState.id, "vocabGeneration"))
    .limit(1);

  return result?.[0]?.status ?? false;
};
