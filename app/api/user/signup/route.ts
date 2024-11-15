import { NextResponse } from "next/server";
import { openDb } from "@/app/db/sqlite";

export async function POST(req: Request) {
  const db = await openDb();
  
  try {
    const { userId, password, name, gender, birthYear, birthMonth, birthDay, email } = await req.json();
    const birthdate = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;

    if (!userId || !password || !name || !gender || !birthYear || !birthMonth || !birthDay || !email) {
      return NextResponse.json({ error: "모든 필드를 입력해야 합니다." }, { status: 400 });
    }


    await db.run(
      `INSERT INTO doctor (username, password, name, gender, birthdate, email)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, password, name, gender, birthdate, email]
    );

    return NextResponse.json({ message: "회원가입 성공!" });
  } catch (error) {
    console.error("회원가입 실패:", error);
    return NextResponse.json({ error: "회원가입 실패! 내부 오류가 발생했습니다." }, { status: 500 });
  } finally {
    await db.close();
  }
}
