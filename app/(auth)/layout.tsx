import { auth } from "@/auth";
import { getUserByEmail } from "@/lib/actions/user";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (session && session.user && session.user.email) {
    const user = await getUserByEmail(session.user.email);
    if (user) {
      redirect("/user/dashboard");
    }
  }

  return children;
};

export default Layout;
