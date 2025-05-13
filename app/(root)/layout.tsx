import React from "react";

import Sidebar from "@/components/Sidebar";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserFromSession();

  return (
    <div className="flex">
      <Sidebar userId={user.id} />
      <div className="min-h-screen w-screen overflow-auto">{children}</div>
    </div>
  );
};

export default Layout;
