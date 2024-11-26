import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { openDb } from "@/app/db/sqlite";
import { DecodedToken } from "@/app/types/DecodedTokenProps";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "인증 토큰이 없습니다." },
      { status: 401 }
    );
  }
  try {
    const decoded = jwt.verify(token, process.env.NEXT_SECRET_KEY as string) as DecodedToken;
    const doctorId = decoded.userId;
    
    const db = await openDb();
    const patients = await db.all(
      `SELECT * FROM patient WHERE doctorId = ? ORDER BY email`,
      [doctorId]
    );
    await db.close();
    
    return NextResponse.json(patients);
  } catch (error) {
    console.error("DB 조회 또는 토큰 검증 오류:", error);
    return NextResponse.json(
      { error: "유효하지 않은 토큰이거나 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: "인증 토큰이 없습니다." },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.NEXT_SECRET_KEY as string) as DecodedToken;
    const doctorId = decoded.userId;

    const { name, gender, birthDate, email } = await req.json();

    const db = await openDb();

    const existingPatient = await db.get(
      `SELECT * FROM patient WHERE email = ? AND doctorId = ?`,
      [email, doctorId]
    );

    if (existingPatient) {
      await db.close();
      return NextResponse.json(
        { message: "이미 존재하는 환자입니다." },
        { status: 400 }
      );
    }

    await db.run(
      `INSERT INTO patient (name, gender, birthdate, email, doctorId) VALUES (?, ?, ?, ?, ?)`,
      [name, gender, birthDate, email, doctorId]
    );
    await db.close();

    return NextResponse.json({ message: "환자 추가 성공!" });
  } catch (error) {
    console.error("DB 오류:", error);
    return NextResponse.json(
      { error: "환자 추가 실패. 서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email");

  if (!email) {
    return NextResponse.json(
      { error: "삭제할 환자의 이메일이 필요합니다." },
      { status: 400 }
    );
  }

  try {
    const db = await openDb();

    await db.run("DELETE FROM patient WHERE email = ?", [email]);
    await db.run("DELETE FROM health WHERE email = ?", [email]);

    await db.close();
    return NextResponse.json({ message: "환자가 성공적으로 삭제되었습니다." });
  } catch (error) {
    console.error("환자 삭제 중 오류:", error);
    return NextResponse.json(
      { error: "환자 삭제 중 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}