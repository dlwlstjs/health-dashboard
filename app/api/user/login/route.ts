import { NextResponse } from "next/server";
import { openDb } from "@/app/db/sqlite";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Doctor } from "@/app/types/DoctorProps";

const secretKey = process.env.NEXT_SECRET_KEY;

export async function POST(req: Request) {
  const db = await openDb();
  const { user_id, password } = await req.json();

  if (!user_id || !password) {
    return NextResponse.json(
      { message: "아이디와 비밀번호를 모두 입력해야 합니다." },
      { status: 400 }
    );
  }

  try {
    const user = (await db.get(
      "SELECT * FROM doctor_test WHERE LOWER(user_id) = LOWER(?)",
      [user_id.toLowerCase()]
    )) as unknown as Doctor | undefined;

    if (user && user.doctor_id && (await bcrypt.compare(password, user.password))) {
      const payload = { user_id: user.doctor_id };
      const token = jwt.sign(payload, secretKey as string, { expiresIn: "1h" });
      
      const response = NextResponse.json({ message: "로그인 성공!" });
      response.cookies.set("auth-token", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24,
        path: "/",
      });
      
      return response;
    }
    const hashedPassword = await bcrypt.hash("screw210", 10);
    console.log("해싱된 비밀번호:", hashedPassword);

    const isMatch = await bcrypt.compare("screw210", hashedPassword);
    console.log("비밀번호 일치 여부:", isMatch);

    return NextResponse.json(
      { message: "아이디 또는 비밀번호가 일치하지 않습니다." },
      { status: 401 }
    );
  } catch (error) {
    console.error("로그인 처리 중 오류:", error);
    return NextResponse.json(
      { message: "서버 에러가 발생했습니다." },
      { status: 500 }
    );
  } finally {
    await db.close();
  }
}
