import { NextResponse } from 'next/server';
import { openDb } from '@/app/db/sqlite';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'; // bcrypt 라이브러리 사용

interface Doctor {
  id: number;
  name: string;
  gender: string;
  birthdate: string;
  email: string;
  username: string;
  password: string;
}

// 서버에서만 사용되는 비밀키 환경변수
const secretKey = process.env.NEXT_SECRET_KEY;

// secretKey가 정의되지 않았을 경우 예외 처리
if (!secretKey) {
  throw new Error("SECRET_KEY가 정의되지 않았습니다. 환경 변수를 확인하세요.");
}

export async function POST(req: Request) {
  const db = await openDb();
  const { userId, password } = await req.json();

  try {
    const user = await db.get(
      'SELECT * FROM doctor WHERE LOWER(username) = LOWER(?)',
      [userId.toLowerCase()]
    ) as unknown as Doctor | undefined;

    // 비밀번호 해시 비교
    if (user && user.id && await bcrypt.compare(password, user.password)) {
      const payload = { userId: user.id };
      
      // JWT 생성 시 secretKey를 string으로 단언
      const token = jwt.sign(payload, secretKey as string, { expiresIn: '1h' });

      // 로그: 토큰이 잘 생성되었는지 확인
      console.log('Generated token:', token); // 여기에 로그 추가

      const response = NextResponse.json({ message: '로그인 성공!' });
      response.cookies.set('auth-token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24,
        path: '/',
      });

      // 로그: 쿠키에 저장된 내용 확인
      console.log('Cookie set with auth-token:', response.cookies.get('auth-token')); // 쿠키 로그 추가

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
