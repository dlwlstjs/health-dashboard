import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  // 'auth-token' 쿠키를 가져옵니다.
  const authToken = request.cookies.get('auth-token');

  // 만약 auth-token이 없으면 로그아웃 실패 처리
  if (!authToken) {
    return NextResponse.json(
      { message: '유효하지 않은 세션입니다.' },
      { status: 400 }
    );
  }

  // auth-token이 있으면 쿠키를 만료시키고 성공 메시지 반환
  const response = NextResponse.json({ message: '로그아웃 성공!' });
  response.cookies.set('auth-token', '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 0, // 즉시 만료
    path: '/',
  });

  return response;
}
