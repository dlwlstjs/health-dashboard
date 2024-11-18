import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ message: '로그아웃 성공!' });
  response.cookies.set('auth-token', '', {
    maxAge: 0, // 즉시 만료
    path: '/',
  });
  return response;
}
