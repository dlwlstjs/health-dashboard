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

export async function POST(req: NextRequest) {
  const { userName } = await req.json();
  
  // SQLite 데이터베이스 연결
  const db = await openDb();
  
  try {
    // 해당 사용자의 문진 결과를 가져오기
    const result = db.prepare('SELECT * FROM survey_results WHERE name = ?').get(userName);

    if (result) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json({ message: '문진 결과가 없습니다.' }, { status: 404 });
    }
  } catch (error) {
    console.error('데이터베이스 오류:', error);
    return NextResponse.json({ message: '문진 결과 조회에 실패했습니다.' }, { status: 500 });
  } finally {
    db.close();
  }
}
