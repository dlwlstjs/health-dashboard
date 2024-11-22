import { NextResponse } from "next/server";
import { openDb } from "@/app/db/sqlite";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const db = await openDb();

  try {
    const { userId, password, name, gender, birthYear, birthMonth, birthDay, email } = await req.json();

    if (!userId || !password || !name || !gender || !birthYear || !birthMonth || !birthDay || !email) {
      return NextResponse.json({ error: "모든 필드를 입력해야 합니다." }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "유효한 이메일 주소를 입력해주세요." }, { status: 400 });
    }

    const birthdate = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;
    const isValidDate = !isNaN(Date.parse(birthdate));
    if (!isValidDate) {
      return NextResponse.json({ error: "유효한 생년월일을 입력해주세요." }, { status: 400 });
    }

    const existingUser = await db.get("SELECT * FROM doctor WHERE email = ? OR username = ?", [email, userId]);
    if (existingUser) {
      return NextResponse.json({ error: "이미 사용 중인 이메일 또는 사용자 이름입니다." }, { status: 400 });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);

    await db.run(
      `INSERT INTO doctor (username, password, name, gender, birthdate, email)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, hashedPassword, name, gender, birthdate, email]
    );

    return NextResponse.json({ message: "회원가입 성공!" });
  } catch (error) {
    console.error("회원가입 실패:", error);
    return NextResponse.json({ error: "회원가입 실패! 내부 오류가 발생했습니다." }, { status: 500 });
  } finally {
    await db.close();
  }
}
