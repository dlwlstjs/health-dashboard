import { openDb } from "@/app/db/sqlite";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json({ error: "이메일이 필요합니다." }, { status: 400 });
  }

  const db = await openDb();
  const existingPatient = await db.get(
    "SELECT * FROM patient WHERE email = ?",
    [email]
  );
  await db.exec('PRAGMA foreign_keys = ON');
  await db.close();

  return NextResponse.json({ exists: !!existingPatient });
}
