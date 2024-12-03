import { NextResponse } from "next/server";
import { openDb } from "@/app/db/sqlite";
import bcrypt from "bcrypt";

export async function POST(req: Request) {
  const db = await openDb();

  try {
    const { user_id, password, name, gender, birthYear, birthMonth, birthDay, email, hospital } = await req.json();

    if (!user_id || !password || !name || !gender || !birthYear || !birthMonth || !birthDay || !email || !hospital) {
      
      return NextResponse.json({ error: "모든 필드를 입력해야 합니다." }, { status: 400 });
    }
    console.log("user_id : ", user_id, "\npass : ", password, "\nname : ", name, "\ngender : ", gender, "\nyear : ", birthYear, birthMonth, birthDay, "\nemail : ", email, "\nhospital : ", hospital);

    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "유효한 이메일 주소를 입력해주세요." }, { status: 400 });
    }

    const birth_date = `${birthYear}-${String(birthMonth).padStart(2, '0')}-${String(birthDay).padStart(2, '0')}`;
    const isValidDate = !isNaN(Date.parse(birth_date));
    if (!isValidDate) {
      return NextResponse.json({ error: "유효한 생년월일을 입력해주세요." }, { status: 400 });
    }

    const existingUser = await db.get("SELECT * FROM doctor_test WHERE email = ? OR user_id = ?", [email, user_id]);
    if (existingUser) {
      return NextResponse.json({ error: "이미 사용 중인 이메일 또는 사용자 이름입니다." }, { status: 400 });
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("hashing pass : ", hashedPassword);
    
    await db.run(
      `INSERT INTO doctor_test (user_id, password, name, gender, birth_date, email, hospital)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, hashedPassword, name, gender, birth_date, email, hospital]
    );

    return NextResponse.json({ message: "회원가입 성공!" });
  } catch (error) {
    console.error("회원가입 실패:", error);
    return NextResponse.json({ error: "회원가입 실패! 내부 오류가 발생했습니다." }, { status: 500 });
  } finally {
    await db.close();
  }
}
