// app/api/user/signup/route.ts
import { NextResponse } from "next/server";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

// 데이터베이스 열기 함수
async function openDb() {
  return open({
    filename: "./database.sqlite",
    driver: sqlite3.Database,
  });
}

export async function POST(req: Request) {
  const db = await openDb();
  const { userId, password, name, gender, birthYear, birthMonth, birthDay, emailPrefix } = await req.json();

  try {
    // 데이터 저장 SQL 실행
    await db.run(
      "INSERT INTO doctor (username, password, name, gender, birthdate, email) VALUES (?, ?, ?, ?, ?, ?)",
      [
        userId,
        password,
        name,
        gender,
        `${birthYear}-${birthMonth}-${birthDay}`,
        `${emailPrefix}@example.com`,
      ]
    );
    return NextResponse.json({ message: "회원가입 성공!" });
  } catch (error) {
    return NextResponse.json({ error: "회원가입 실패!" }, { status: 500 });
  } finally {
    await db.close();
  }
}
