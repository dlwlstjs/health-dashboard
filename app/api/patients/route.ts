import { NextResponse } from 'next/server';
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

// POST 요청 처리: 새로운 환자 추가
export async function POST(req: Request) {
  try {
    // 요청 본문에서 필요한 데이터를 가져옵니다.
    const { name, gender, birthDate, email } = await req.json();

    const db = await openDb();
    await db.run(
      'INSERT INTO patient (name, gender, birthYear, birthMonth, birthDay, email) VALUES (?, ?, ?, ?, ?, ?)',
      name,
      gender,
      parseInt(birthDate.split('-')[0]), // birthYear
      parseInt(birthDate.split('-')[1]), // birthMonth
      parseInt(birthDate.split('-')[2]), // birthDay
      email
    );
    await db.close();
    return NextResponse.json({ message: '환자가 성공적으로 추가되었습니다.' }, { status: 201 });
  } catch (error) {
    console.error('DB 오류:', error);
    return NextResponse.json({ error: '환자 추가에 실패했습니다.' }, { status: 500 });
  }
}
