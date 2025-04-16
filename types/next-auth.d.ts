// types/next-auth.d.ts
import { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      provider: string;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    provider: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    provider: string;
  }
}
