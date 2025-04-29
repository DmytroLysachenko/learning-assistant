import { auth } from "@/auth";
import Sidebar from "@/components/Sidebar";
import { getUserByEmail } from "@/lib/actions/user";
import { redirect } from "next/navigation";
import React from "react";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/login");
  }

  const { data: user } = await getUserByEmail(session.user.email);

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="flex">
      <Sidebar userId={user.id} />
      <div className="min-h-screen w-screen max-h-screen overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
