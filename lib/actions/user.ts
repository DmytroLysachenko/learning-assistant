"use server";

import { db } from "@/db/index";

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { users } from "@/db/schema";

export const createUser = async (user: {
  email: string;
  name: string | null;
  image: string | null;
  provider: string;
  passwordHash: string | null;
}) => {
  const result = await db.insert(users).values({
    ...user,
  });
  return result;
};

export const getUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user;
};

export const updateUser = async (
  id: string,
  data: Partial<{ name: string; image: string; provider: string }>
) => {
  const result = await db.update(users).set(data).where(eq(users.id, id));
  return result;
};

export const setPasswordForUser = async (id: string, password: string) => {
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.id, id));
  return result;
};

export const deleteUser = async (id: string) => {
  const result = await db.delete(users).where(eq(users.id, id));
  return result;
};
