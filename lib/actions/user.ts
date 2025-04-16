"use server";

import { db } from "@/db/index";
import { users } from "@/db/schema/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

// CREATE: Add a new user
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

// READ: Get a user by email
export const getUserByEmail = async (email: string) => {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, email))
    .limit(1);
  return user;
};

// UPDATE: Update user provider or other details
export const updateUser = async (
  id: string,
  data: Partial<{ name: string; image: string; provider: string }>
) => {
  const result = await db.update(users).set(data).where(eq(users.id, id));
  return result;
};

// UPDATE: Set password hash for a user (e.g., for OAuth users)
export const setPasswordForUser = async (id: string, password: string) => {
  const passwordHash = await bcrypt.hash(password, 12);
  const result = await db
    .update(users)
    .set({ passwordHash })
    .where(eq(users.id, id));
  return result;
};

// DELETE: Delete a user by ID
export const deleteUser = async (id: string) => {
  const result = await db.delete(users).where(eq(users.id, id));
  return result;
};
