// app/user/login/route.ts
import { NextResponse } from 'next/server';
import { openDb } from '@/app/db/sqlite';

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const db = await openDb();

  try {
    const user = await db.get('SELECT * FROM doctor WHERE username = ? AND password = ?', [username, password]);
    if (user) {
      return NextResponse.json({ message: '로그인 성공!' });
    } else {
      return NextResponse.json({ message: '로그인 실패! 아이디 또는 비밀번호가 일치하지 않습니다.' }, { status: 401 });
    }
  } catch (error) {
    return NextResponse.json({ error: '로그인 중 오류가 발생했습니다.' }, { status: 500 });
  } finally {
    await db.close();
  }
}
