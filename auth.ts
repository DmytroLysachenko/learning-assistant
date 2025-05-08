import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

import { createUser, getUserByEmail } from "@/lib/actions/user";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google,
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        if (!credentials?.email || !credentials?.password) return null;

        const { data: user } = await getUserByEmail(
          credentials.email as string
        );

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
        };
      },
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: 7 * 24 * 60 * 60, // how long the session is valid (in seconds)
    updateAge: 24 * 60 * 60, // how often the session is refreshed (in seconds)
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
    async signIn({ user, account }) {
      if (!account || !user || !user.email) return false;

      const { data: existing } = await getUserByEmail(user.email);

      if (!existing) {
        await createUser({
          email: user.email,
          name: user.name || null,
          image: user.image || null,
          password: null,
        });
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login?error=OAuthError",
  },
});
