import React from "react";
import dayjs from "dayjs";

import Sidebar from "@/components/Sidebar";
import { getUserFromSession } from "@/lib/utils/getUserFromSession";
import { updateUser } from "@/lib/actions/user";

const Layout = async ({ children }: { children: React.ReactNode }) => {
  const user = await getUserFromSession();

  const lastUpdated = dayjs(user.updatedAt);
  const now = dayjs();
  const diffInDays = now.diff(lastUpdated, "day");

  if (diffInDays === 1) {
    await updateUser(user.id, {
      updatedAt: new Date(),
      experience: user.experience + 5,
      streak: user.streak + 1,
    });
  } else if (diffInDays > 1) {
    await updateUser(user.id, {
      updatedAt: new Date(),
      streak: 1,
    });
  }

  return (
    <div className="flex">
      <Sidebar userId={user.id} />
      <div className="min-h-screen max-h-screen w-screen overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;
