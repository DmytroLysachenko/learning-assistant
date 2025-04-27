import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { createUser, getUserByEmail, updateUser } from "@/lib/actions/user";

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
      if (!account || !user || !user.email) return false;

      const { provider } = account;

      const existing = await getUserByEmail(user.email);

      if (!existing) {
        await createUser({
          email: user.email,
          name: user.name || null,
          image: user.image || null,
          provider,
          password: null,
        });
      } else if (!existing.provider) {
        await updateUser(existing.id, { provider });
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
    error: "/login?error=OAuthError",
  },
  secret: process.env.NEXTAUTH_SECRET!,
});
