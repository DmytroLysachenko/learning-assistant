import { auth } from "@/auth";
import { getUserByEmail } from "../actions/user";
import { redirect } from "next/navigation";
import dayjs from "dayjs";

export const getUserFromSession = async () => {
  const session = await auth();

  if (
    !session ||
    !session.user ||
    !session.user.email ||
    dayjs().isAfter(session.expires)
  ) {
    redirect("/login");
  }

  const { success, data: user } = await getUserByEmail(session.user.email);

  if (!success || !user) {
    redirect("/login");
  }

  return user;
};
