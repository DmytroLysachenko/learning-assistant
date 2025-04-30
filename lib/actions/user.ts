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
  password: string | null;
}) => {
  try {
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, user.email))
      .limit(1);

    if (existingUser.length > 0) {
      return { success: false, error: "User already exists" };
    }

    const passwordHash = user.password
      ? await bcrypt.hash(user.password, 12)
      : null;

    const result = await db.insert(users).values({
      ...user,
      passwordHash,
    });

    return { success: true, data: result };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};

export const getUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);

  return { success: true, data: user };
};

export const getUserById = async (id: string) => {
  const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1);

  return { success: true, data: user };
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
