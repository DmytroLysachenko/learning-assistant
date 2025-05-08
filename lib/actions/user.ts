"use server";

import { db } from "@/db/index";

import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { users } from "@/db/schema";

export const createUser = async (user: {
  email: string;
  name: string | null;
  image: string | null;
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

    const createdUser = await db
      .insert(users)
      .values({
        ...user,
        passwordHash,
      })
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        interfaceLanguage: users.interfaceLanguage,
        learningLanguages: users.learningLanguages,
      })
      .then((res) => res[0]);

    return { success: true, data: createdUser };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, email))
      .limit(1)
      .then((res) => res[0]);

    return { success: true, data: user };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        interfaceLanguage: users.interfaceLanguage,
        learningLanguages: users.learningLanguages,
      })
      .from(users)
      .where(eq(users.id, id))
      .limit(1)
      .then((res) => res[0]);

    return { success: true, data: user };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};

export const updateUser = async (
  id: string,
  data: Partial<{
    name: string;
    image: string;
  }>
) => {
  try {
    const user = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        interfaceLanguage: users.interfaceLanguage,
        learningLanguages: users.learningLanguages,
      })
      .then((res) => res[0]);
    return { success: true, data: user };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};

export const setPasswordForUser = async (id: string, password: string) => {
  try {
    const passwordHash = await bcrypt.hash(password, 12);
    await db
      .update(users)
      .set({ passwordHash })
      .where(eq(users.id, id))
      .returning({
        id: users.id,
        name: users.name,
        email: users.email,
        image: users.image,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
        interfaceLanguage: users.interfaceLanguage,
        learningLanguages: users.learningLanguages,
      });
    return { success: true };
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};

export const deleteUser = async (id: string) => {
  try {
    const result = await db.delete(users).where(eq(users.id, id));
    return result;
  } catch (error) {
    console.log(error);
    return { success: false, error };
  }
};
