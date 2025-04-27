import { seedWordsByAlphabet } from "@/lib/actions/admin";
import { getAiLock, setAiLock } from "@/lib/actions/aiLock";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const auth = req.headers.get("authorization");
  const expected = `Bearer ${process.env.JOBS_SECRET}`;

  if (auth !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isLocked = await getAiLock();
  if (isLocked) return NextResponse.json({ status: "locked" }, { status: 409 });

  const options = await req.json();

  await setAiLock(true);

  try {
    const result = await seedWordsByAlphabet(options);
    return NextResponse.json({ status: "done", result });
  } catch (e) {
    return NextResponse.json({
      status: "error",
      message: (e as Error).message,
    });
  } finally {
    await setAiLock(false);
  }
}
