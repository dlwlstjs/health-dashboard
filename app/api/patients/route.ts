import { NextRequest, NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// 데이터베이스 열기 함수
async function openDb() {
  return open({
    filename: './database.sqlite', // 데이터베이스 파일 위치
    driver: sqlite3.Database,
  });
}

// GET 요청 처리: 모든 환자 목록 가져오기
export async function GET() {
  try {
    const db = await openDb();
    const patients = await db.all('SELECT * FROM patient');
    await db.close();
    return NextResponse.json(patients); // 환자 목록을 JSON으로 반환
  } catch (error) {
    console.error('DB 오류:', error);
    return NextResponse.json({ error: '환자 목록을 가져오는데 실패했습니다.' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
    try {
      const { name, gender, birthDate, email } = await request.json();
      const db = await openDb();
  
      // 이메일 중복 확인
      const existingPatient = await db.get(`SELECT * FROM patient WHERE email = ?`, email);
      if (existingPatient) {
        return NextResponse.json({ message: '이미 존재하는 이메일입니다.' }, { status: 400 });
      }
  
      await db.run(
        `INSERT INTO patient (name, gender, birthdate, email, link) VALUES (?, ?, ?, ?, ?)`,
        name,
        gender,
        birthDate,
        email,
        `/surveyresult?name=${encodeURIComponent(name)}`
      );
      await db.close();
  
      return NextResponse.json({ message: '환자 추가 성공!' }, { status: 201 });
    } catch (error) {
      console.error('DB 오류:', error);
      return NextResponse.json({ message: '환자 추가 실패. 서버 오류.' }, { status: 500 });
    }
  }
  