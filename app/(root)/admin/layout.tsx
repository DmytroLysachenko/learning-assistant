import { redirect } from "next/navigation";
import React from "react";

const AdminLayout = async ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  if (process.env.NODE_ENV !== "development") {
    redirect("/404");
  }

  return children;
};

export default AdminLayout;
