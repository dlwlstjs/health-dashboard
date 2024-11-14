// app/api/user/login/route.ts
import { NextResponse } from 'next/server';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

// 데이터베이스 열기 함수
async function openDb() {
  return open({
    filename: './database.sqlite',
    driver: sqlite3.Database,
  });
}

export async function POST(req: Request) {
  const db = await openDb();
  const { userId, password } = await req.json(); // userId와 password를 받아옴

  try {
    // 데이터베이스에서 사용자 조회
    const user = await db.get(
      'SELECT * FROM doctor WHERE LOWER(username) = LOWER(?) AND password = ?',
      [userId.toLowerCase(), password]
    );

    if (user) {
      return NextResponse.json({ message: '로그인 성공!' });
    } else {
      return NextResponse.json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }
  } catch (error) {
    console.error('로그인 중 오류 발생:', error); // 에러 로그 추가
    return NextResponse.json({ error: '로그인 중 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await db.close();
  }
}
