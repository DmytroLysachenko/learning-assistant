// lib/auth.ts
import NextAuth, { NextAuthConfig } from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const authConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        const [user] = await db
          .select()
          .from(users)
          .where(eq(users.email, credentials.email as string))
          .limit(1);

        if (!user || !user.passwordHash) return null;

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) return null;

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
          provider: user.provider ?? "credentials",
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id;
        token.provider = user.provider ?? account?.provider ?? "credentials";
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.provider = token.provider as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      const provider = account?.provider ?? "credentials";

      const [existing] = await db
        .select()
        .from(users)
        .where(eq(users.email, user.email!))
        .limit(1);

      if (!existing) {
        // OAuth new user
        await db.insert(users).values({
          email: user.email!,
          name: user.name,
          image: user.image,
          provider,
          passwordHash: null,
        });
      } else if (!existing.provider) {
        // Backfill legacy user
        await db
          .update(users)
          .set({ provider })
          .where(eq(users.id, existing.id));
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login?error=OAuthError",
  },
  secret: process.env.NEXTAUTH_SECRET!,
} satisfies NextAuthConfig;

export const { handlers, auth, signIn, signOut } = NextAuth(authConfig);
