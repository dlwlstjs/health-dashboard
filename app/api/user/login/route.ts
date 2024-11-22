import { NextResponse } from 'next/server';
import { openDb } from '@/app/db/sqlite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Doctor } from '@/app/types/DoctorProps';

// 서버에서만 사용되는 비밀키 환경변수
const secretKey = process.env.NEXT_SECRET_KEY;

export async function POST(req: Request) {
  const db = await openDb();
  const { userId, password } = await req.json();

  try {
    const user = await db.get(
      'SELECT * FROM doctor WHERE LOWER(username) = LOWER(?)',
      [userId.toLowerCase()]
    ) as unknown as Doctor | undefined;

    if (user && user.id && await bcrypt.compare(password, user.password)) {
      const payload = { userId: user.id };
      const token = jwt.sign(payload, secretKey as string, { expiresIn: '1h' });

      const response = NextResponse.json({ message: '로그인 성공!' });
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
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
