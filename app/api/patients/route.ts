import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { openDb } from "@/app/db/sqlite";

// GET: 특정 doctor_id에 해당하는 환자 목록 가져오기
export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;

  if (!token) {
    return NextResponse.json(
      { error: "인증 토큰이 없습니다." },
      { status: 401 }
    );
  }

  try {
    const decoded: any = jwt.verify(token, process.env.NEXT_SECRET_KEY as string);
    const doctorId = decoded.userId; // 토큰의 doctor_id
    console.log("get의 doctor_id : ",decoded.userId);
    
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

// POST: doctor_id에 환자 추가
export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth-token")?.value;
  
  if (!token) {
    return NextResponse.json(
      { error: "인증 토큰이 없습니다." },
      { status: 401 }
    );
  }

  try {
    const decoded: any = jwt.verify(token, process.env.NEXT_SECRET_KEY as string);
    const doctorId = decoded.userId; // 토큰의 doctor_id
    console.log("POST 요청의 doctor_id:", doctorId);

    const { name, gender, birthDate, email } = await req.json();

    const db = await openDb();

    // 동일한 doctor_id와 이메일로 환자가 존재하는지 확인
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

    // 환자 추가
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