import { NextResponse } from 'next/server';
import { openDb } from '@/app/db/sqlite';

interface Doctor {
  id: number;
  name: string;
  gender: string;
  birthdate: string;
  email: string;
  username: string;
  password: string;
}

export async function POST(req: Request) {
  const db = await openDb();
  const { userId, password } = await req.json();

  try {
    // SQL 결과를 명시적으로 Doctor 타입으로 단언
    const user = (await db.get(
      'SELECT * FROM doctor WHERE LOWER(username) = LOWER(?) AND password = ?',
      [userId.toLowerCase(), password]
    )) as unknown as Doctor | undefined;

    if (user) {
      // 쿠키에 email을 auth-token으로 저장
      const response = NextResponse.json({ message: '로그인 성공!' });
      response.cookies.set('auth-token', user.email, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 1일
        path: '/',
      });
      return response;
    }

    return NextResponse.json({ message: '아이디 또는 비밀번호가 일치하지 않습니다.' }, { status: 401 });
  } catch (error) {
    console.error('로그인 처리 중 오류:', error);
    return NextResponse.json({ message: '서버 에러가 발생했습니다.' }, { status: 500 });
  } finally {
    await db.close();
  }
}
