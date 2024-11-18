// app/middleware.ts
import { NextResponse } from 'next/server';
import { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth-token');

  // 토큰이 없으면 로그인 페이지로 리디렉션
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next(); // 토큰이 있으면 요청 계속 처리
}

// 특정 경로에 대해서만 미들웨어 적용 (예: 로그인, 회원가입 제외)
export const config = {
  matcher: ['/dashboard', '/profile', '/settings', '/'],
};
