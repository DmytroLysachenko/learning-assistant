import { auth } from "@/auth";
import { getUserByEmail } from "../actions/user";
import { redirect } from "next/navigation";

export const getUserFromSession = async () => {
  const session = await auth();

  if (!session || !session.user || !session.user.email) {
    redirect("/login");
  }

  const { data: user } = await getUserByEmail(session.user.email);

  if (!user) {
    redirect("/login");
  }

  return user;
};
