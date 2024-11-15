import { NextRequest, NextResponse } from 'next/server';
import { openDb } from '@/app/db/sqlite';

// GET : 모든 환자 목록 가져오기
export async function GET() {
  try {
    const db = await openDb();
    const patients = await db.all('SELECT * FROM patient');
    await db.close();
    return NextResponse.json(patients);
  } catch (error) {
    console.error('DB 오류:', error);
    return NextResponse.json({ error: '환자 목록을 가져오는데 실패했습니다.' }, { status: 500 });
  }
}

// POST : 환자 추가
export async function POST(request: NextRequest) {
    try {
      const { name, gender, birthDate, email } = await request.json();
      const db = await openDb();
  
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
  