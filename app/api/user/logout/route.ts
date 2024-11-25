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

  const response = NextResponse.json({ message: '로그아웃 성공!' });
  response.cookies.delete('auth-token'); // 쿠키 삭제
  
  return response;
}
