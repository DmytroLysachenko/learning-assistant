import React from "react";

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import dayjs from "dayjs";
import { getUserByEmail } from "@/lib/actions/user";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (
    session &&
    dayjs().isBefore(session.expires) &&
    session.user &&
    session.user.email
  ) {
    const { success, data: user } = await getUserByEmail(session.user.email);

    if (success && user) {
      return redirect("/user/dashboard");
    }
  }

  return children;
};

export default Layout;
